import { Section } from "@/components/design/Section";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Thank you", "Checkout or signup thank-you page.", true);
export default function ThankYouPage() { return <main><Section eyebrow="Thank you" title="Your next step is protected."><p>If this followed checkout, entitlement creation is finalized through the verified Stripe webhook scaffold.</p></Section></main>; }
