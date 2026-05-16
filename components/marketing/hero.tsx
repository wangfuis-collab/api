"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:pt-28">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl text-center">
      <div className="mx-auto mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-neon"><WandSparkles className="mr-2 h-4 w-4" /> Seedance2.0 powered cinematic video studio</div>
      <h1 className="neon-text text-gradient text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">Generate impossible AI videos in seconds.</h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl">Nova AI Video turns prompts and images into production-ready cyberpunk films with async queues, credits, subscriptions, and an enterprise-grade dashboard.</p>
      <div className="neon-border glass mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[2rem] p-3 sm:flex-row">
        <input className="min-h-14 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-white/35" placeholder="A neon samurai crossing rainy Shibuya, cinematic dolly shot..." />
        <Button asChild size="lg"><Link href="/generate">Generate <ArrowRight className="h-5 w-5" /></Link></Button>
      </div>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 50, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: .2, type: "spring" }} className="perspective-1000 mx-auto mt-16 max-w-6xl">
      <div className="neon-border glass group relative overflow-hidden rounded-[2rem] p-3 transition duration-500 hover:-translate-y-2 hover:rotate-1">
        <div className="aspect-video overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.35),transparent_25%),linear-gradient(135deg,#070717,#111145_45%,#3a0a4b)]">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute left-12 top-12 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm backdrop-blur-xl">Rendering frame 847/1200</div>
            <div className="absolute inset-x-10 bottom-10 grid gap-4 md:grid-cols-3">
              {["Prompt analyzer", "Motion planner", "4K upscaler"].map((t, i) => <div key={t} className="glass rounded-2xl p-4 animate-float" style={{ animationDelay: `${i * .7}s` }}><Play className="mb-5 h-5 w-5 text-cyan-300" /><div className="font-semibold">{t}</div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${70 + i * 10}%` }} /></div></div>)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </section>;
}
