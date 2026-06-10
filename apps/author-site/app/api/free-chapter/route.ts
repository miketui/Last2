import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { sendTransactionalEmail } from "@/lib/email/resend";
const schema = z.object({ email: z.string().email() });
export async function POST(request: Request) { const parsed = schema.safeParse(await request.json().catch(() => ({}))); if (!parsed.success) return NextResponse.json({ error: "Valid email required." }, { status: 400 }); const mailerlite = await upsertSubscriber(parsed.data.email, "free_chapter"); const resend = await sendTransactionalEmail({ to: parsed.data.email, subject: "Your Curls & Contemplation chapter", html: "<p>Free chapter delivery scaffold. Configure the final asset before production.</p>" }); return NextResponse.json({ ok: true, mailerlite, resend }); }
