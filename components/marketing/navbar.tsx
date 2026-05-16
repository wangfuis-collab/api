import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03030a]/55 backdrop-blur-2xl">
    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-3 font-bold"><span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-neon"><Sparkles className="h-5 w-5" /></span>Nova AI Video</Link>
      <div className="hidden items-center gap-8 text-sm text-white/70 md:flex"><a href="/#features">Features</a><a href="/#pricing">Pricing</a><a href="/#faq">FAQ</a><Link href="/generate">Generate</Link></div>
      <div className="flex items-center gap-2"><Button asChild variant="ghost"><Link href="/login">Login</Link></Button><Button asChild><Link href="/generate">Start free</Link></Button></div>
    </nav>
  </header>;
}
