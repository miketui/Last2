import { NextResponse } from "next/server";
import { z } from "zod";
import { isAnalyticsEventName } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
const schema = z.object({ eventName: z.string(), route: z.string().optional(), source: z.string().optional(), anonymousId: z.string().optional(), metadata: z.record(z.string(), z.unknown()).optional() });
export async function POST(request: Request) { const parsed = schema.safeParse(await request.json().catch(() => ({}))); if (!parsed.success || !isAnalyticsEventName(parsed.data.eventName)) return NextResponse.json({ error: "Unknown analytics event." }, { status: 400 }); const result = await recordServerEvent({ eventName: parsed.data.eventName, route: parsed.data.route, source: parsed.data.source, anonymousId: parsed.data.anonymousId, metadata: parsed.data.metadata }); return NextResponse.json({ ok: true, result }); }
