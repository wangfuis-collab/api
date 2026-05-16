"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Chrome, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function submit(formData: FormData) {
    setLoading(true);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const res = mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${env.appUrl}/auth/callback` } });
    setLoading(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(mode === "login" ? "Welcome back" : "Check your email to confirm your account");
    router.push("/dashboard");
  }
  async function google() { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${env.appUrl}/auth/callback` } }); }
  return <main className="grid min-h-screen place-items-center px-4"><Card className="neon-border w-full max-w-md"><CardContent className="p-8"><Link href="/" className="mb-8 flex items-center gap-3 text-xl font-bold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500"><Sparkles /></span>Nova AI Video</Link><h1 className="text-3xl font-bold">{mode === "login" ? "Login" : "Create account"}</h1><p className="mt-2 text-sm text-white/55">Access your AI video studio, credits, and render history.</p><form action={submit} className="mt-8 space-y-4"><Input name="email" type="email" placeholder="you@company.com" required /><Input name="password" type="password" placeholder="Password" required minLength={6} /><Button className="w-full" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</Button></form><Button className="mt-3 w-full" variant="secondary" onClick={google}><Chrome className="h-4 w-4" /> Continue with Google</Button><p className="mt-6 text-center text-sm text-white/55">{mode === "login" ? "No account? " : "Have an account? "}<Link className="text-cyan-300" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Sign up" : "Login"}</Link></p></CardContent></Card></main>;
}
