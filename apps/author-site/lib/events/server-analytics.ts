import { analyticsEvents, isAnalyticsEventName, type AnalyticsEventName } from "@/lib/analytics";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function recordServerEvent(input: {
  eventName: AnalyticsEventName;
  route?: string;
  source?: string;
  userId?: string;
  anonymousId?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!isAnalyticsEventName(input.eventName)) return { ok: false, reason: "Unknown event." } as const;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false, skipped: true, reason: "Analytics database is not configured." } as const;
  const { error } = await supabase.from("analytics_events").insert({
    event_name: input.eventName,
    route: input.route,
    source: input.source,
    user_id: input.userId,
    anonymous_id: input.anonymousId,
    metadata: input.metadata ?? {}
  });
  return error ? ({ ok: false, reason: error.message } as const) : ({ ok: true } as const);
}

export { analyticsEvents };
