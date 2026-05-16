import { Suspense } from "react";
import { AppShell } from "@/components/dashboard/shell";
import { GeneratorForm, StatusPanel } from "@/components/video/generator-form";

export const metadata = { title: "Generate AI Video" };
export default function GeneratePage({ searchParams }: { searchParams: Promise<{ video?: string }> }) {
  return <Suspense fallback={null}><GenerateContent searchParams={searchParams} /></Suspense>;
}
async function GenerateContent({ searchParams }: { searchParams: Promise<{ video?: string }> }) {
  const params = await searchParams;
  return <AppShell><div className="mb-8"><h1 className="text-4xl font-bold">AI video generator</h1><p className="mt-2 text-white/55">Text-to-video and image-to-video with live queue status and Seedance2.0 rendering.</p></div><div className="grid gap-6 xl:grid-cols-[1fr_.9fr]"><GeneratorForm /><StatusPanel videoId={params.video} /></div></AppShell>;
}
