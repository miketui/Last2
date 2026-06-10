import { notFound } from "next/navigation";
import { posts } from "@/content/blog";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = posts.find((item) => item.slug === slug); if (!post) notFound(); return <main><PageHero eyebrow={post.date} title={post.title} description={post.excerpt} primaryHref="/free-chapter" primaryLabel="Read Chapter 1 Free" secondaryHref="/blog" secondaryLabel="Back to Journal" /><Section eyebrow="Essay scaffold" title="A short note for the working creative."><p>This editorial route is ready for Michael-approved copy. Placeholder language stays claim-safe and avoids testimonials, awards, or celebrity references.</p></Section></main>; }
