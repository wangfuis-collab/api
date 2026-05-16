import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CosmicBackground } from "@/components/marketing/background";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Nova AI Video — Seedance2.0 AI Video Generator", template: "%s | Nova AI Video" },
  description: "Commercial-grade AI video generation SaaS with Seedance2.0, subscriptions, credits, dashboard, and Cloudflare R2 storage.",
  keywords: ["AI video", "Seedance", "text to video", "image to video", "SaaS", "Runway alternative"],
  openGraph: { title: "Nova AI Video", description: "Generate cinematic AI videos with a neon SaaS studio.", type: "website", images: ["/og.svg"] },
  twitter: { card: "summary_large_image", title: "Nova AI Video", description: "Generate cinematic AI videos with Seedance2.0." },
};
export const viewport: Viewport = { themeColor: "#03030a", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="dark"><body><CosmicBackground />{children}<Toaster /></body></html>;
}
