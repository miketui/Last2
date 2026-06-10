import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { EmailSignup } from "@/components/EmailSignup";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Worksheets", "Worksheet scaffolds for the future resource library.");

export default function Page() {
  return <main><Section eyebrow="Curls & Contemplation" title="Worksheets"><p>Worksheet scaffolds for the future resource library.</p><div className="mt-8 grid gap-6 md:grid-cols-2">{worksheets.map((worksheet) => <WorksheetCard key={worksheet.slug} worksheet={worksheet} />)}</div></Section></main>;
}
