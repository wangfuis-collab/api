import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, sig, env.stripeWebhookSecret); } catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid signature" }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) await prisma.user.update({ where: { id: userId }, data: { plan: session.amount_total && session.amount_total > 5000 ? "UNLIMITED" : "PRO", credits: { increment: session.amount_total && session.amount_total > 5000 ? 20000 : 2000 }, stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined } });
  }
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await prisma.user.updateMany({ where: { stripeSubscriptionId: sub.id }, data: { plan: "FREE" } });
  }
  return NextResponse.json({ received: true });
}
