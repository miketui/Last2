import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { EmailSignup } from "@/components/EmailSignup";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("About Michael", "About Michael David and the Curls & Contemplation project.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="About Michael"><p>About Michael David and the Curls & Contemplation project.</p></Section></main>;
}
