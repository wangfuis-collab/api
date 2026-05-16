"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CosmicBackground() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 24 });
  const sy = useSpring(y, { stiffness: 80, damping: 24 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);
  return <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03030a]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(79,70,229,.28),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,.18),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(217,70,239,.18),transparent_30%)]" />
    <div className="absolute inset-0 opacity-50 grid-bg animate-grid" />
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(3,3,10,.92))]" />
    <motion.div className="absolute h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }} />
    <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-aurora rounded-full bg-indigo-600/20 blur-3xl" />
    <div className="absolute bottom-10 right-1/5 h-[30rem] w-[30rem] animate-aurora rounded-full bg-fuchsia-600/15 blur-3xl [animation-delay:-4s]" />
    {Array.from({ length: 70 }).map((_, i) => <span key={i} className="absolute h-1 w-1 rounded-full bg-white/40" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, opacity: (i % 5) / 7 + .15 }} />)}
  </div>;
}
