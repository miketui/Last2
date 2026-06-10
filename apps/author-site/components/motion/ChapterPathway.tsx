import Link from "next/link";
import { chapters } from "@/content/chapters";
export function ChapterPathway() { return <ol className="space-y-4">{chapters.map((chapter, index) => <li key={chapter.slug} className="rounded-3xl border border-whitegold/15 p-5"><Link href={`/chapter/${chapter.slug}`}><span className="text-antique">0{index + 1}</span><h3 className="font-display text-3xl text-white">{chapter.title}</h3><p className="text-whitegold/75">{chapter.excerpt}</p></Link></li>)}</ol>; }
