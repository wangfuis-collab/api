import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json();
  const taskId = payload.task_id ?? payload.id;
  if (!taskId) return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  await prisma.videoGeneration.updateMany({ where: { seedanceTaskId: taskId }, data: { status: payload.status === "succeeded" ? "SUCCEEDED" : payload.status === "failed" ? "FAILED" : "PROCESSING", progress: payload.progress ?? undefined, videoUrl: payload.video_url ?? payload.output_url ?? undefined, errorMessage: payload.error ?? undefined, metadata: payload } });
  return NextResponse.json({ received: true });
}
