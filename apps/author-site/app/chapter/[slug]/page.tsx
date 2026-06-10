import { notFound } from "next/navigation";
import { chapters } from "@/content/chapters";
import { Section } from "@/components/design/Section";
export function generateStaticParams() { return chapters.map((chapter) => ({ slug: chapter.slug })); }
export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const chapter = chapters.find((item) => item.slug === slug); if (!chapter) notFound(); return <main><Section eyebrow="Chapter preview" title={chapter.title}><p>{chapter.excerpt}</p><p className="mt-4 text-sm">Preview copy scaffold only; full paid files stay in private Storage.</p></Section></main>; }
