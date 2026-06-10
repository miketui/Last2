import { BookHero } from "@/components/BookHero";
import { Section } from "@/components/design/Section";
import { ExperienceCard } from "@/components/design/ExperienceCard";
import { EditorialGrid } from "@/components/design/EditorialGrid";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
import { bookJsonLd } from "@/lib/schema";

export default function HomePage() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} /><BookHero /><Section eyebrow="Recognition" title="You can be talented and still need a steadier system."><p>Freelance hairstyling asks for artistry, client care, business judgment, and emotional stamina all at once. This platform starts by naming that reality clearly.</p></Section><Section eyebrow="Relief" title="The work can feel premium without feeling frantic."><p>The direct edition is built around calm standards, protected delivery, and practical next steps—not hype, fake urgency, or borrowed authority.</p></Section><Section eyebrow="Authority / Path" title="Follow the creative path with intention."><EditorialGrid><ExperienceCard title="Creative standard">Define what excellence means before the day gets loud.</ExperienceCard><ExperienceCard title="Client rhythm">Shape a guest experience that feels prepared and personal.</ExperienceCard><ExperienceCard title="Business clarity">Make offers, delivery, and follow-through easier to trust.</ExperienceCard></EditorialGrid><div className="mt-10"><ChapterPathway /></div></Section></main>;
}
