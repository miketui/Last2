import { requireAdmin } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Content", "Admin Content surface.", true);
export default async function Page() { const admin = await requireAdmin(); if (!admin.ok) return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="font-display text-5xl text-white">Admin gated</h1><p className="mt-4 text-whitegold/80">{admin.reason}</p></main>; return <main className="mx-auto max-w-5xl px-6 py-16"><p className="editorial-kicker">Authorized admin</p><h1 className="mt-4 font-display text-5xl text-white">Content</h1><p className="mt-6 text-whitegold/80">Admin-ready scaffold for content backed by service-role routes and admin_users intent.</p></main>; }
