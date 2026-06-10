import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getLaunchMode, resolveStripePriceId } from "@/lib/launch-mode";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";

const checkoutSchema = z.object({
  product: z.enum(["direct_ebook", "bundle", "worksheets"]).default("direct_ebook"),
  sourcePage: z.string().max(120).optional(),
  utm: z.record(z.string(), z.string()).optional()
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout request.", details: parsed.error.flatten() }, { status: 400 });

  const mode = getLaunchMode();
  if (mode === "paused") return NextResponse.json({ error: "Checkout is currently paused." }, { status: 503 });

  const stripe = getStripe();
  const priceId = resolveStripePriceId(mode, parsed.data.product);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  if (!stripe || !priceId) return NextResponse.json({ error: "Checkout is not configured. Missing Stripe server key or server-side price ID." }, { status: 503 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${mode === "launched" ? "buy" : "preorder"}`,
    metadata: {
      book_slug: "curls-and-contemplation",
      launch_mode: mode,
      price_tier: mode === "launched" ? "regular" : "preorder",
      source_page: parsed.data.sourcePage ?? "unknown",
      ...(parsed.data.utm ?? {})
    }
  });

  await recordServerEvent({ eventName: analyticsEvents.checkoutStarted, route: "/api/checkout", metadata: { product: parsed.data.product, launchMode: mode } });
  return NextResponse.json({ url: session.url });
}
