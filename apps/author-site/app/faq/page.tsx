import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata = pageMetadata("FAQ", "Frequently asked questions for direct digital delivery.");

export default function Page() {
  return <main><PageHero eyebrow="FAQ" title="Clear answers before checkout." description="Pricing, delivery, files, and subscriptions are explained plainly so the purchase path stays calm." primaryHref="/preorder" primaryLabel="Preorder — $17.99" /><Section eyebrow="Answers" title="No hype. Just the useful details."><FAQAccordion /></Section></main>;
}
