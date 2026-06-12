import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { book } from "@/content/book";

export const metadata = pageMetadata("About", "About Michael David and the Curls & Contemplation project.", { path: "/about" });

export default function Page() {
  return <main><PageHero eyebrow="About Michael" title="A working creative, writing for working creatives." description="Michael David writes from lived hairstylist practice and the reality of building standards in rooms where every detail carries weight." primaryHref="/book" primaryLabel="Explore the Book" secondaryHref="/contact" secondaryLabel="Contact" /><Section eyebrow="Credibility note" title="Claim-safe until the evidence gate closes."><p>{book.credibilityNote}</p><p className="mt-4 text-sm text-whitegold/70">Specific celebrity, award, testimonial, or training claims remain omitted until substantiated in claims-evidence.md and approved for publication.</p></Section></main>;
}
