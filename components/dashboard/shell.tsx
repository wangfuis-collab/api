import Link from "next/link";
import { BarChart3, Film, Shield, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen"><aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-black/30 p-5 backdrop-blur-2xl lg:block"><Link href="/" className="mb-10 flex items-center gap-3 text-xl font-bold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500"><Sparkles /></span>Nova</Link><nav className="space-y-2 text-sm"><Link className="flex gap-3 rounded-2xl px-4 py-3 hover:bg-white/10" href="/dashboard"><BarChart3 className="h-4 w-4" /> Dashboard</Link><Link className="flex gap-3 rounded-2xl px-4 py-3 hover:bg-white/10" href="/generate"><WandSparkles className="h-4 w-4" /> Generate</Link><Link className="flex gap-3 rounded-2xl px-4 py-3 hover:bg-white/10" href="/dashboard#videos"><Film className="h-4 w-4" /> Videos</Link><Link className="flex gap-3 rounded-2xl px-4 py-3 hover:bg-white/10" href="/admin"><Shield className="h-4 w-4" /> Admin</Link></nav><Button asChild className="mt-8 w-full"><Link href="/#pricing">Upgrade</Link></Button></aside><main className="lg:pl-64"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div></main></div>;
}
