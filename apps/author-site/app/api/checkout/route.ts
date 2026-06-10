import { NextResponse } from "next/server";
import { z } from "zod";
import { getLaunchMode } from "@/lib/env";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { buildCheckoutMetadata, checkoutUrls, getStripe, resolveServerPriceId } from "@/lib/stripe";

const checkoutSchema = z.object({
  product: z.enum(["direct_ebook", "bundle", "worksheets"]).default("direct_ebook"),
  sourcePage: z.string().max(120).optional(),
  utm: z.object({ utm_source: z.string().max(80).optional(), utm_medium: z.string().max(80).optional(), utm_campaign: z.string().max(120).optional() }).optional(),
  customerEmail: z.string().email().optional(),
  price: z.unknown().optional(),
  priceId: z.unknown().optional()
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_request", message: "Invalid checkout request." } }, { status: 400 });

  const mode = getLaunchMode();
  if (mode === "paused") return NextResponse.json({ ok: false, error: { code: "checkout_paused", message: "Checkout is currently paused." } }, { status: 503 });

  const resolved = resolveServerPriceId(mode, parsed.data.product);
  if (!resolved.ok) return NextResponse.json({ ok: false, error: { code: resolved.reason, message: "Checkout is not configured for sandbox use.", missing: "missing" in resolved ? resolved.missing : undefined } }, { status: 503 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ ok: false, error: { code: "config_missing", message: "Stripe server configuration is missing." } }, { status: 503 });

  const metadata = buildCheckoutMetadata(parsed.data);
  const urls = checkoutUrls();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: resolved.priceId, quantity: 1 }],
      success_url: urls.successUrl,
      cancel_url: urls.cancelUrl,
      customer_email: parsed.data.customerEmail,
      metadata
    });
    await recordServerEvent({ eventName: analyticsEvents.checkoutStarted, route: "/api/checkout", metadata: { product: parsed.data.product, launchMode: mode, priceTier: resolved.tier }, operational: true });
    return NextResponse.json({ ok: true, url: session.url });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "stripe_error", message: "Unable to start checkout." } }, { status: 502 });
  }
}
