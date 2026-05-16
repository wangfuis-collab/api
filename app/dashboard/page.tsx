import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/dashboard/shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };
export default async function DashboardPage() {
  const user = await requireUser();
  const [videos, apiCalls] = await Promise.all([
    prisma.videoGeneration.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.apiCall.count({ where: { userId: user.id } }),
  ]);
  const done = videos.filter((v) => v.status === "SUCCEEDED").length;
  return <AppShell><div className="mb-8"><h1 className="text-4xl font-bold">Welcome, {user.name}</h1><p className="mt-2 text-white/55">Monitor credits, usage, API calls, and your latest generations.</p></div><div className="grid gap-4 md:grid-cols-4">{[["Credits", user.plan === "UNLIMITED" ? "∞" : user.credits], ["Plan", user.plan], ["Videos", videos.length], ["API calls", apiCalls]].map(([k,v]) => <Card key={k}><CardContent className="p-6"><div className="text-sm text-white/50">{k}</div><div className="mt-3 text-3xl font-bold">{v}</div></CardContent></Card>)}</div><section id="videos" className="mt-10"><h2 className="mb-4 text-2xl font-semibold">Generation history</h2>{videos.length === 0 ? <Card><CardContent className="p-8 text-center text-white/55"><Skeleton className="mx-auto mb-4 h-32 w-full max-w-md" />No videos yet. Create your first AI film from the Generate page.</CardContent></Card> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{videos.map((video) => <Card key={video.id} className="overflow-hidden"><div className="aspect-video bg-black/40">{video.videoUrl ? <video src={video.videoUrl} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-white/40">{video.status} · {video.progress}%</div>}</div><CardContent className="p-5"><div className="mb-2 flex justify-between text-xs text-white/45"><span>{video.style}</span><span>{formatDistanceToNow(video.createdAt)} ago</span></div><p className="line-clamp-2 text-sm text-white/75">{video.prompt}</p><div className="mt-4 text-xs text-cyan-200">{video.creditsCost} credits · {video.aspectRatio} · {video.duration}s</div></CardContent></Card>)}</div>}</section></AppShell>;
}
