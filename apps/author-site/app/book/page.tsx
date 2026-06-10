import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Book", "The direct digital edition, pricing, and protected delivery path for Curls & Contemplation.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="Book"><p>The direct digital edition, pricing, and protected delivery path for Curls & Contemplation.</p><div className="mt-8"><PricingCard /></div><p className="mt-4 text-sm">Kindle external: ${priceConfig.kindleExternal.amount.toFixed(2)}. Paperback/POD placeholder: ${priceConfig.paperbackExternal.amount.toFixed(2)}.</p></Section></main>;
}
