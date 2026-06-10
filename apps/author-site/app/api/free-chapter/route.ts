import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { sendFreeChapter } from "@/lib/email/resend";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";

const schema = z.object({ email: z.string().email(), turnstileToken: z.string().optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_email" } }, { status: 400 });
  const mailerlite = await upsertSubscriber(parsed.data.email, "free_chapter", { source: "free_chapter" });
  const resend = await sendFreeChapter(parsed.data.email);
  await recordServerEvent({ eventName: analyticsEvents.freeChapterRequested, route: "/api/free-chapter", metadata: { mailerliteSkipped: mailerlite.skipped, resendSkipped: resend.skipped }, operational: true });
  return NextResponse.json({ ok: true, mailerlite, resend, delivery: resend.ok ? "email_sent" : "email_not_configured_no_public_link" });
}
