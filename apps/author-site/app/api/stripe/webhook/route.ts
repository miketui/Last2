import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!stripe || !secret || !signature) return NextResponse.json({ error: "Webhook signature verification is not configured or signature is missing." }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    await supabase.from("webhook_events").upsert({ provider: "stripe", provider_event_id: event.id, event_type: event.type, payload: event, processed_at: new Date().toISOString() }, { onConflict: "provider_event_id" });
  }

  if (event.type === "checkout.session.completed") {
    await recordServerEvent({ eventName: analyticsEvents.purchaseCompleted, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id } });
    // Scaffold: create order, active purchase entitlement, subscriber event, and Resend/MailerLite follow-up.
  }

  if (event.type === "charge.refunded" || event.type === "refund.created") {
    await recordServerEvent({ eventName: analyticsEvents.refundRecorded, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id } });
    // Scaffold: revoke purchase entitlement and notify the customer.
  }

  return NextResponse.json({ received: true });
}
