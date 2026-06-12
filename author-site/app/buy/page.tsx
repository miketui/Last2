import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { PreorderCheckout } from "@/components/PreorderCheckout";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Buy", "Choose the format that fits how you read — direct digital, Kindle, or paperback.", { path: "/buy" });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Purchase paths"
        title="Choose the format that fits how you read."
        description="The direct digital edition is delivered through your protected account — EPUB and PDF by signed link. Kindle and paperback editions link out to their stores as each goes live."
        secondaryHref="/book"
        secondaryLabel="Review the Book"
      >
        <div className="grid gap-3 text-sm text-whitegold/78">
          <p>Direct digital: ${priceConfig.regularDirect.amount.toFixed(2)}</p>
          <p>Kindle (external store): ${priceConfig.kindleExternal.amount.toFixed(2)}</p>
          <p>Paperback (external, arrives with launch): ${priceConfig.paperbackExternal.amount.toFixed(2)}</p>
        </div>
      </PageHero>
      <Section eyebrow="Direct digital" title="Fast path, private delivery.">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PreorderCheckout
            title="Direct digital edition"
            price={`$${priceConfig.regularDirect.amount.toFixed(2)}`}
            ctaLabel={`Buy the Book — $${priceConfig.regularDirect.amount.toFixed(2)}`}
            note="EPUB + PDF, delivered through your protected account the moment payment clears."
            sourcePage="/buy"
          />
          <PricingCard />
        </div>
      </Section>
    </main>
  );
}
