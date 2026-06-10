import type { ReactNode } from "react";
export function DashboardShell({ title, children }: { title: string; children: ReactNode }) { return <main className="mx-auto min-h-screen max-w-5xl px-6 py-16"><p className="editorial-kicker">Customer area</p><h1 className="mt-4 font-display text-5xl text-white">{title}</h1><div className="mt-8">{children}</div></main>; }
