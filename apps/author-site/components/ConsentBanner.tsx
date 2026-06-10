"use client";
import { useState } from "react";
export function ConsentBanner() { const [hidden, setHidden] = useState(false); if (hidden) return null; return <div className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl border border-antique/40 bg-obsidian p-4 text-sm text-whitegold shadow-gold md:left-auto md:w-96"><p>We use consent-aware analytics scaffolding. Marketing pixels should remain disabled until configured.</p><button onClick={() => setHidden(true)} className="mt-3 rounded-full bg-antique px-4 py-2 font-semibold text-obsidian">Acknowledge</button></div>; }
