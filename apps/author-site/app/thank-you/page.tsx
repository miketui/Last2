import { UtilityShell } from "@/components/design/UtilityShell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Thank You", "Post-checkout confirmation.", true);
export default function Page() { return <UtilityShell eyebrow="Confirmation" title="Thank you." description="When live checkout is activated, this page will confirm the order and point buyers to protected account delivery."><div className="editorial-panel rounded-3xl p-6"><p className="text-whitegold/75">Scaffold state: no live payment has been processed in this environment.</p></div></UtilityShell>; }
