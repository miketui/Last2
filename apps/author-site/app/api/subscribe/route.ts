import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
const schema = z.object({ email: z.string().email(), source: z.string().max(80).optional() });
export async function POST(request: Request) { const contentType = request.headers.get("content-type") ?? ""; const body = contentType.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries()); const parsed = schema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: "Valid email required." }, { status: 400 }); const result = await upsertSubscriber(parsed.data.email, "subscribers", { source: parsed.data.source ?? "site" }); await recordServerEvent({ eventName: analyticsEvents.emailCaptureSuccess, route: "/api/subscribe", source: parsed.data.source, metadata: { mailerliteSkipped: "skipped" in result ? result.skipped : false } }); return NextResponse.json({ ok: true, mailerlite: result }); }
