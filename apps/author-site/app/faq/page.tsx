import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { EmailSignup } from "@/components/EmailSignup";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("FAQ", "Common preorder, delivery, account, and platform questions.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="FAQ"><p>Common preorder, delivery, account, and platform questions.</p><div className="mt-8"><FAQAccordion /></div></Section></main>;
}
