import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Preorder", "Reserve the direct digital edition at the $17.99 preorder / launch price.");

export default function Page() {
  return <main><PageHero eyebrow="Direct preorder" title="Reserve the direct edition without putting paid files in public." description="The launch price is $17.99. Checkout remains scaffolded until live Stripe keys are added by the owner; delivery remains protected through account entitlements." primaryHref="/api/checkout" primaryLabel="Preorder — $17.99" secondaryHref="/free-chapter" secondaryLabel="Read Chapter 1 Free"><ul className="space-y-3 text-sm leading-6 text-whitegold/78"><li>• EPUB/PDF bundle path is private Supabase Storage only.</li><li>• Regular direct price remains ${priceConfig.regularDirect.amount.toFixed(2)} after launch.</li><li>• Refund policy must revoke entitlements when granted.</li></ul></PageHero><Section eyebrow="What happens next" title="Simple, protected, direct."><PricingCard /></Section></main>;
}
