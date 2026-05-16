import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const schema = z.object({ priceId: z.string().min(1) });
export async function POST(request: Request) {
  const user = await requireUser();
  const { priceId } = schema.parse(await request.json());
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name ?? undefined, metadata: { userId: user.id } });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }
  const session = await stripe.checkout.sessions.create({ mode: "subscription", customer: customerId, line_items: [{ price: priceId, quantity: 1 }], success_url: `${env.appUrl}/dashboard?checkout=success`, cancel_url: `${env.appUrl}/#pricing`, metadata: { userId: user.id } });
  return NextResponse.json({ url: session.url });
}
