import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { EmailSignup } from "@/components/EmailSignup";

export const metadata = pageMetadata("Free Chapter", "Join the email list for a free chapter delivery scaffold.");

export default function Page() {
  return <main><PageHero eyebrow="Free chapter" title="Start with the first turn in the path." description="Read Chapter 1 before you buy. The delivery flow is scaffolded for Resend and MailerLite, with consent-aware analytics only." primaryHref="/preorder" primaryLabel="Preorder — $17.99" secondaryHref="/chapters" secondaryLabel="Preview Chapters" /><Section eyebrow="Get Chapter 1" title="A quiet sample before the direct edition."><EmailSignup source="free-chapter" /></Section></main>;
}
