import { AppShell } from "@/components/dashboard/shell";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin" };
export default async function AdminPage() {
  await requireAdmin();
  const [users, videos, revenueUsers] = await Promise.all([prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }), prisma.videoGeneration.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { user: true } }), prisma.user.count({ where: { plan: { not: "FREE" } } })]);
  return <AppShell><h1 className="mb-8 text-4xl font-bold">Admin control center</h1><div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-6"><div className="text-white/50">Users</div><div className="mt-2 text-3xl font-bold">{users.length}</div></CardContent></Card><Card><CardContent className="p-6"><div className="text-white/50">Videos</div><div className="mt-2 text-3xl font-bold">{videos.length}</div></CardContent></Card><Card><CardContent className="p-6"><div className="text-white/50">Paid accounts</div><div className="mt-2 text-3xl font-bold">{revenueUsers}</div></CardContent></Card></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><Card><CardContent className="p-6"><h2 className="mb-4 text-xl font-semibold">Users</h2>{users.map((u) => <div key={u.id} className="flex justify-between border-b border-white/10 py-3 text-sm"><span>{u.email}</span><span>{u.plan} · {u.credits}</span></div>)}</CardContent></Card><Card><CardContent className="p-6"><h2 className="mb-4 text-xl font-semibold">Videos</h2>{videos.map((v) => <div key={v.id} className="border-b border-white/10 py-3 text-sm"><div className="flex justify-between"><span>{v.user.email}</span><span>{v.status}</span></div><p className="mt-1 line-clamp-1 text-white/50">{v.prompt}</p></div>)}</CardContent></Card></div></AppShell>;
}
