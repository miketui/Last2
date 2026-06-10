import { notFound } from "next/navigation";
import { posts } from "@/content/blog";
import { Section } from "@/components/design/Section";
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = posts.find((item) => item.slug === slug); if (!post) notFound(); return <main><Section eyebrow={post.date} title={post.title}><p>{post.excerpt}</p><p className="mt-4">Editorial scaffold; final copy must remain claim-safe and traceable.</p></Section></main>; }
