import { env } from "@/lib/env";

export type SeedanceTask = { taskId: string; status?: string; videoUrl?: string; progress?: number; error?: string };

type GenerateInput = { prompt: string; aspectRatio: string; duration: number; style: string; callbackUrl?: string };
type ImageInput = GenerateInput & { imageUrl: string };

async function seedanceFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(`${env.seedanceBaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.seedanceApiKey}`, ...(init?.headers ?? {}) },
    });
    if (!response.ok) throw new Error(`Seedance API ${response.status}: ${await response.text()}`);
    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateVideo(input: GenerateInput) {
  const res = await seedanceFetch<{ id?: string; task_id?: string }>("/videos/generations", { method: "POST", body: JSON.stringify(input) });
  return { taskId: res.task_id ?? res.id ?? "" };
}

export async function imageToVideo(input: ImageInput) {
  const res = await seedanceFetch<{ id?: string; task_id?: string }>("/videos/image-to-video", { method: "POST", body: JSON.stringify(input) });
  return { taskId: res.task_id ?? res.id ?? "" };
}

export async function getTaskStatus(taskId: string): Promise<SeedanceTask> {
  const res = await seedanceFetch<{ id?: string; task_id?: string; status: string; output_url?: string; video_url?: string; progress?: number; error?: string }>(`/tasks/${taskId}`, { method: "GET" });
  return { taskId: res.task_id ?? res.id ?? taskId, status: res.status, videoUrl: res.video_url ?? res.output_url, progress: res.progress, error: res.error };
}

export async function downloadVideo(videoUrl: string) {
  const response = await fetch(videoUrl);
  if (!response.ok) throw new Error(`Video download failed: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export function enhancePrompt(prompt: string, style = "cinematic") {
  return `${prompt.trim()}, ${style} AI film, dynamic camera movement, volumetric neon lighting, high detail, professional color grading, smooth motion, 4K, no text artifacts`;
}
