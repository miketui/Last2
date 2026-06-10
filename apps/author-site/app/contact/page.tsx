import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { EmailSignup } from "@/components/EmailSignup";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Contact", "Support and contact intake scaffold.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="Contact"><p>Support and contact intake scaffold.</p><div className="mt-8"><EmailSignup source="contact" /></div></Section></main>;
}
