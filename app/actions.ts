"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { enhancePrompt } from "@/lib/seedance";
import { enqueueVideoGeneration } from "@/lib/queue";

const videoSchema = z.object({
  prompt: z.string().min(5).max(2000),
  mode: z.enum(["TEXT_TO_VIDEO", "IMAGE_TO_VIDEO"]),
  sourceImageUrl: z.string().url().optional().or(z.literal("")),
  aspectRatio: z.string().default("16:9"),
  duration: z.coerce.number().min(3).max(15).default(5),
  style: z.string().default("cinematic"),
  enhance: z.coerce.boolean().default(true),
});

export async function createVideoGeneration(_: unknown, formData: FormData) {
  const user = await requireUser();
  const parsed = videoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;
  const creditsCost = data.duration * (data.mode === "IMAGE_TO_VIDEO" ? 3 : 2);
  if (user.credits < creditsCost && user.plan !== "UNLIMITED") return { ok: false, error: "Insufficient credits. Upgrade your plan to continue." };
  const enhancedPrompt = data.enhance ? enhancePrompt(data.prompt, data.style) : data.prompt;
  const video = await prisma.$transaction(async (tx) => {
    if (user.plan !== "UNLIMITED") {
      await tx.user.update({ where: { id: user.id }, data: { credits: { decrement: creditsCost } } });
      await tx.creditTransaction.create({ data: { userId: user.id, amount: -creditsCost, reason: "video_generation" } });
    }
    return tx.videoGeneration.create({ data: { userId: user.id, prompt: data.prompt, enhancedPrompt, mode: data.mode, sourceImageUrl: data.sourceImageUrl || null, aspectRatio: data.aspectRatio, duration: data.duration, style: data.style, creditsCost } });
  });
  await enqueueVideoGeneration({ videoId: video.id, userId: user.id });
  revalidatePath("/dashboard");
  return { ok: true, id: video.id };
}
