import Stripe from "stripe";
import { env } from "@/lib/env";
export const stripe = new Stripe(env.stripeSecretKey || "sk_test_placeholder", { apiVersion: "2025-05-28.basil" });
export const plans = [
  { name: "Free", plan: "FREE", price: "$0", credits: "100 credits", features: ["Text-to-video", "Community queue", "720p exports"] },
  { name: "Pro", plan: "PRO", price: "$29", priceId: env.stripeProPriceId, credits: "2,000 credits/mo", features: ["Priority queue", "Image-to-video", "1080p exports", "Commercial license"] },
  { name: "Unlimited", plan: "UNLIMITED", price: "$99", priceId: env.stripeUnlimitedPriceId, credits: "Unlimited fair use", features: ["Fastest queue", "4K beta", "Team seats", "Dedicated support"] },
];
