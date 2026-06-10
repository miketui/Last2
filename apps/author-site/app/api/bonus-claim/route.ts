import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
const schema = z.object({ email: z.string().email(), note: z.string().max(1000).optional() });
export async function POST(request: Request) { const contentType = request.headers.get("content-type") ?? ""; const body = contentType.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries()); const parsed = schema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: "Valid bonus claim required." }, { status: 400 }); const mailerlite = await upsertSubscriber(parsed.data.email, "bonus_claim_started"); return NextResponse.json({ ok: true, status: "manual_review_scaffold", mailerlite }); }
