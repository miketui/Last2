import { DashboardShell } from "@/components/DashboardShell";
import { DownloadList } from "@/components/DownloadList";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Downloads", "Protected customer downloads.", true);
export default function Page() { return <DashboardShell title="Protected downloads"><DownloadList /><p className="mt-6 text-sm text-whitegold/70">Paid EPUB/PDF assets are not public files; requests must pass server-side entitlement checks. Download pages are noindex and deny by default until Supabase Auth and purchases are connected.</p></DashboardShell>; }
