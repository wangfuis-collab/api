"use client";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Image, Loader2, WandSparkles } from "lucide-react";
import { createVideoGeneration } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function GeneratorForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createVideoGeneration, null);
  const [mode, setMode] = useState("TEXT_TO_VIDEO");
  useEffect(() => { if (state?.ok) { toast.success("Generation queued"); router.push(`/generate?video=${state.id}`); } else if (state?.error) toast.error(state.error); }, [state, router]);
  return <Card className="neon-border"><CardContent className="p-6"><form action={action} className="space-y-5"><input type="hidden" name="mode" value={mode} /><div><label className="mb-2 block text-sm text-white/70">Prompt</label><Textarea name="prompt" placeholder="Describe camera, subject, motion, lighting, and mood..." required /></div><div className="grid gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm text-white/70">Mode</label><Select value={mode} onValueChange={setMode}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TEXT_TO_VIDEO">Text to video</SelectItem><SelectItem value="IMAGE_TO_VIDEO">Image to video</SelectItem></SelectContent></Select></div><div><label className="mb-2 block text-sm text-white/70">Image URL</label><Input name="sourceImageUrl" placeholder="https://..." disabled={mode === "TEXT_TO_VIDEO"} /></div><div><label className="mb-2 block text-sm text-white/70">Aspect ratio</label><Select name="aspectRatio" defaultValue="16:9"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="16:9">16:9 Landscape</SelectItem><SelectItem value="9:16">9:16 Portrait</SelectItem><SelectItem value="1:1">1:1 Square</SelectItem></SelectContent></Select></div><div><label className="mb-2 block text-sm text-white/70">Duration</label><Select name="duration" defaultValue="5"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5 seconds</SelectItem><SelectItem value="10">10 seconds</SelectItem><SelectItem value="15">15 seconds</SelectItem></SelectContent></Select></div><div><label className="mb-2 block text-sm text-white/70">Style</label><Select name="style" defaultValue="cinematic"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cinematic">Cinematic</SelectItem><SelectItem value="cyberpunk">Cyberpunk</SelectItem><SelectItem value="anime">Anime</SelectItem><SelectItem value="product">Product commercial</SelectItem></SelectContent></Select></div><label className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-3 text-sm"><input type="checkbox" name="enhance" defaultChecked /> Enhance prompt with AI film grammar</label></div><Button size="lg" className="w-full" disabled={pending}>{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <WandSparkles className="h-5 w-5" />}Generate video</Button>{pending && <Progress value={35} />}</form></CardContent></Card>;
}

export function StatusPanel({ videoId }: { videoId?: string }) {
  const [video, setVideo] = useState<any>(null);
  useEffect(() => {
    if (!videoId) return;
    let active = true;
    async function poll() { const res = await fetch(`/api/videos/${videoId}`); if (active && res.ok) setVideo(await res.json()); }
    poll(); const t = setInterval(poll, 2500); return () => { active = false; clearInterval(t); };
  }, [videoId]);
  if (!videoId) return <EmptyPreview />;
  return <Card><CardContent className="p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Render status</h2><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{video?.status ?? "LOADING"}</span></div><Progress value={video?.progress ?? 10} /><div className="mt-6 aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black/40">{video?.videoUrl ? <video src={video.videoUrl} controls className="h-full w-full" /> : <div className="grid h-full place-items-center text-center text-white/50"><Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-cyan-300" />AI engines are generating your video...</div>}</div>{video?.errorMessage && <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">{video.errorMessage}</p>}{video?.videoUrl && <Button asChild className="mt-4 w-full"><a href={video.videoUrl} download>Download video</a></Button>}</CardContent></Card>;
}
function EmptyPreview() { return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Card><CardContent className="grid min-h-[28rem] place-items-center p-6 text-center"><div><Image className="mx-auto mb-4 h-12 w-12 text-cyan-300" /><h2 className="text-2xl font-semibold">Your render preview appears here</h2><p className="mt-2 text-white/55">Queue a text or image generation to watch live progress.</p></div></CardContent></Card></motion.div>; }
