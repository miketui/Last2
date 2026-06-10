import { DashboardShell } from "@/components/DashboardShell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Bonus Claim", "Bonus claim intake.", true);
export default function BonusClaimPage() { return <DashboardShell title="Bonus claim"><form action="/api/bonus-claim" method="post" className="space-y-4"><input name="email" type="email" required placeholder="Email" className="w-full rounded-full px-4 py-3 text-obsidian" /><textarea name="note" placeholder="Claim notes" className="min-h-32 w-full rounded-2xl px-4 py-3 text-obsidian" /><button className="rounded-full bg-antique px-5 py-3 font-semibold text-obsidian">Submit claim scaffold</button></form></DashboardShell>; }
