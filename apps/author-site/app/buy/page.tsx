import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Buy", "Choose direct digital, Kindle, or paperback placeholder purchase paths.");

export default function Page() {
  return <main><PageHero eyebrow="Purchase paths" title="Choose the format that fits how you read." description="Direct digital stays protected behind account delivery. Kindle and paperback are external placeholders until Michael approves final links." primaryHref="/api/checkout" primaryLabel="Buy the Book — $19.99" secondaryHref="/book" secondaryLabel="Review the Book"><div className="grid gap-3 text-sm text-whitegold/78"><p>Direct digital: ${priceConfig.regularDirect.amount.toFixed(2)}</p><p>Kindle external bare ebook: ${priceConfig.kindleExternal.amount.toFixed(2)}</p><p>Paperback/POD external placeholder: ${priceConfig.paperbackExternal.amount.toFixed(2)}</p></div></PageHero><Section eyebrow="Direct digital" title="Fast path, private delivery."><PricingCard /></Section></main>;
}
