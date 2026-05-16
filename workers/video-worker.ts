import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { env } from "@/lib/env";
import { downloadVideo, generateVideo, getTaskStatus, imageToVideo } from "@/lib/seedance";
import { uploadVideoToR2 } from "@/lib/r2";
import { VIDEO_QUEUE_NAME, type VideoJobData } from "@/lib/queue";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

new Worker<VideoJobData>(VIDEO_QUEUE_NAME, async (job) => {
  const video = await prisma.videoGeneration.findUniqueOrThrow({ where: { id: job.data.videoId } });
  await prisma.videoGeneration.update({ where: { id: video.id }, data: { status: "PROCESSING", progress: 5 } });
  const callbackUrl = `${env.appUrl}/api/seedance/webhook`;
  const task = video.mode === "IMAGE_TO_VIDEO" && video.sourceImageUrl
    ? await imageToVideo({ prompt: video.enhancedPrompt ?? video.prompt, imageUrl: video.sourceImageUrl, aspectRatio: video.aspectRatio, duration: video.duration, style: video.style, callbackUrl })
    : await generateVideo({ prompt: video.enhancedPrompt ?? video.prompt, aspectRatio: video.aspectRatio, duration: video.duration, style: video.style, callbackUrl });
  if (!task.taskId) throw new Error("Seedance returned no task id");
  await prisma.videoGeneration.update({ where: { id: video.id }, data: { seedanceTaskId: task.taskId, progress: 12 } });
  const deadline = Date.now() + 1000 * 60 * 18;
  while (Date.now() < deadline) {
    const status = await getTaskStatus(task.taskId);
    const normalized = String(status.status ?? "").toLowerCase();
    await prisma.videoGeneration.update({ where: { id: video.id }, data: { progress: Math.max(status.progress ?? 20, 20), metadata: status as object } });
    if (["succeeded", "success", "completed"].includes(normalized) && status.videoUrl) {
      const buffer = await downloadVideo(status.videoUrl);
      const url = await uploadVideoToR2(`videos/${video.userId}/${video.id}.mp4`, buffer);
      await prisma.videoGeneration.update({ where: { id: video.id }, data: { status: "SUCCEEDED", progress: 100, videoUrl: url } });
      return;
    }
    if (["failed", "error", "canceled"].includes(normalized)) throw new Error(status.error ?? "Seedance generation failed");
    await sleep(5000);
  }
  throw new Error("Seedance generation timed out");
}, { connection: redis, concurrency: Number(process.env.WORKER_CONCURRENCY ?? 3) });
