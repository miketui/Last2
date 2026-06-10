import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
export const metadata = pageMetadata("Chapters", "Chapter pathway scaffold for the book.");
export default function ChaptersPage() { return <main><Section eyebrow="Chapter pathway" title="Move through the work with intention."><ChapterPathway /></Section></main>; }
