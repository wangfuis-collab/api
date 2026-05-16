import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  return prisma.user.upsert({
    where: { supabaseId: user.id },
    update: { email: user.email, name: user.user_metadata?.full_name ?? user.email.split("@")[0], avatarUrl: user.user_metadata?.avatar_url },
    create: { supabaseId: user.id, email: user.email, name: user.user_metadata?.full_name ?? user.email.split("@")[0], avatarUrl: user.user_metadata?.avatar_url },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
