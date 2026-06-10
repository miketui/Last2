import type { ReactNode } from "react";
export function ExperienceCard({ title, children }: { title: string; children: ReactNode }) { return <article className="rounded-3xl border border-whitegold/15 bg-white/5 p-6 shadow-gold"><h3 className="font-display text-2xl text-white">{title}</h3><div className="mt-3 text-whitegold/80">{children}</div></article>; }
