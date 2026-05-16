import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export type VideoJobData = { videoId: string; userId: string };
export const VIDEO_QUEUE_NAME = "nova-video-generation";

export const videoQueue = new Queue<VideoJobData>(VIDEO_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { age: 60 * 60 * 24, count: 1000 },
    removeOnFail: { age: 60 * 60 * 24 * 7 },
  },
});

export async function enqueueVideoGeneration(data: VideoJobData) {
  return videoQueue.add("generate-video", data, { jobId: data.videoId, timeout: 1000 * 60 * 20 });
}
