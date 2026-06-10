import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { EmailSignup } from "@/components/EmailSignup";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Free Chapter", "Join the email list for a free chapter delivery scaffold.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="Free Chapter"><p>Join the email list for a free chapter delivery scaffold.</p><div className="mt-8"><EmailSignup source="free-chapter" /></div></Section></main>;
}
