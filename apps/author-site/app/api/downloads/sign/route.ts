import { NextResponse } from "next/server";
import { z } from "zod";
import { createSignedDownloadUrl, deliverables } from "@/lib/downloads";
import { getSessionUser } from "@/lib/supabase/server";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
const schema = z.object({ deliverable: z.enum(["epub", "pdf"]) });
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries());
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid deliverable." }, { status: 400 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const result = await createSignedDownloadUrl(user.id, parsed.data.deliverable);
  await recordServerEvent({ eventName: result.allowed ? analyticsEvents.downloadSigned : analyticsEvents.downloadDenied, route: "/api/downloads/sign", userId: user.id, metadata: { deliverable: parsed.data.deliverable } });
  if (!result.allowed) return NextResponse.json({ error: result.reason, limit: "3 downloads / 7 days scaffold" }, { status: 403 });
  return NextResponse.json({ url: result.url, expiresInSeconds: result.expiresInSeconds, label: deliverables[parsed.data.deliverable].label });
}
