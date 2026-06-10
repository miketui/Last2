import { DashboardShell } from "@/components/DashboardShell";
import { pageMetadata } from "@/lib/seo";
import { getSessionUser } from "@/lib/supabase/server";
export const metadata = pageMetadata("Dashboard", "Customer dashboard.", true);
export default async function DashboardPage() { const user = await getSessionUser(); return <DashboardShell title="Dashboard">{user ? <p>Signed in as {user.email}. Orders, downloads, and bonus claims will appear here.</p> : <p>Please log in to view purchases and protected downloads.</p>}</DashboardShell>; }
