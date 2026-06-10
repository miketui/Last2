"use client";
import { useEffect } from "react";
import type { AnalyticsEventName } from "@/lib/analytics";
export function AnalyticsEvent({ name, metadata }: { name: AnalyticsEventName; metadata?: Record<string, unknown> }) { useEffect(() => { void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventName: name, metadata }) }); }, [name, metadata]); return null; }
