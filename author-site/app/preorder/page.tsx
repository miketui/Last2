import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { PreorderCheckout } from "@/components/PreorderCheckout";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Preorder", "Reserve the direct digital edition of Curls & Contemplation at the $17.99 launch price.");

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Direct preorder"
        title="Reserve the direct edition."
        description="The launch price is $17.99 — and stays there through the first fifteen days after release, then becomes $19.99 permanently. Delivery is protected through your account: EPUB and PDF by signed link, never a public file."
        secondaryHref="/free-chapter"
        secondaryLabel="Read Chapter 1 Free"
      >
        <ul className="space-y-3 text-sm leading-6 text-whitegold/78">
          <li>• EPUB/PDF delivered from private storage only — signed URLs, 3 downloads over 7 days.</li>
          <li>• Regular direct price becomes ${priceConfig.regularDirect.amount.toFixed(2)} after the launch window.</li>
          <li>• Refunds revoke digital access automatically. Honest both ways.</li>
        </ul>
      </PageHero>
      <Section eyebrow="Checkout" title="Simple, protected, direct.">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PreorderCheckout />
          <PricingCard />
        </div>
      </Section>
    </main>
  );
}
