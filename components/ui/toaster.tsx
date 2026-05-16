"use client";
import { Toaster as Sonner } from "sonner";
export function Toaster() { return <Sonner theme="dark" richColors position="top-right" toastOptions={{ style: { background: "rgba(10,10,24,.88)", border: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(18px)" } }} />; }
