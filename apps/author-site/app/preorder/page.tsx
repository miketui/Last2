import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Preorder", "Reserve the direct digital edition at the $17.99 preorder / launch price.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="Preorder"><p>Reserve the direct digital edition at the $17.99 preorder / launch price.</p><div className="mt-8"><PricingCard /></div><p className="mt-4 text-sm">Kindle external: ${priceConfig.kindleExternal.amount.toFixed(2)}. Paperback/POD placeholder: ${priceConfig.paperbackExternal.amount.toFixed(2)}.</p></Section></main>;
}
