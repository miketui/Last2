import { DashboardShell } from "@/components/DashboardShell";
import { DownloadList } from "@/components/DownloadList";
import { pageMetadata } from "@/lib/seo";
import { getSessionUser } from "@/lib/supabase/server";
export const metadata = pageMetadata("Downloads", "Protected downloads.", true);
export default async function DownloadsPage() { const user = await getSessionUser(); return <DashboardShell title="Downloads">{user ? <DownloadList /> : <p>Log in before requesting a private signed download URL. Non-buyers and refunded buyers are denied server-side.</p>}</DashboardShell>; }
