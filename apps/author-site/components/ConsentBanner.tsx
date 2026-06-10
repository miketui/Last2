"use client";

import { useState } from "react";

export function ConsentBanner() {
  const [choice, setChoice] = useState<string | null>(() => (typeof window === "undefined" ? "pending" : window.localStorage.getItem("cc_analytics_consent")));
  if (choice) return null;
  function choose(value: "granted" | "denied") {
    window.localStorage.setItem("cc_analytics_consent", value);
    setChoice(value);
  }
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl border border-antique/40 bg-obsidian p-4 text-sm text-whitegold shadow-gold md:left-auto md:w-96">
      <p>We use consent-aware analytics. Operational security and order events may still be recorded server-side.</p>
      <div className="mt-3 flex gap-3">
        <button onClick={() => choose("granted")} className="rounded-full bg-antique px-4 py-2 font-semibold text-obsidian">Allow analytics</button>
        <button onClick={() => choose("denied")} className="rounded-full border border-whitegold/30 px-4 py-2 font-semibold text-whitegold">Essential only</button>
      </div>
    </div>
  );
}
