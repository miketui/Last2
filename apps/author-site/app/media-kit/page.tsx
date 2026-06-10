import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { EmailSignup } from "@/components/EmailSignup";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Media Kit", "Media-ready facts and approved positioning placeholders.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="Media Kit"><p>Media-ready facts and approved positioning placeholders.</p></Section></main>;
}
