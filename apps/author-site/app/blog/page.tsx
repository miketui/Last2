import { posts } from "@/content/blog";
import { BlogCard } from "@/components/BlogCard";
import { Section } from "@/components/design/Section";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Blog", "Editorial posts for the Curls & Contemplation funnel.");
export default function BlogPage() { return <main><Section eyebrow="Journal" title="Notes from the creative path"><div className="grid gap-6 md:grid-cols-2">{posts.map((post) => <BlogCard key={post.slug} post={post} />)}</div></Section></main>; }
