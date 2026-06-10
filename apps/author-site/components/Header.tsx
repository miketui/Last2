import Link from "next/link";
import { LaunchModeCTA } from "@/components/LaunchModeCTA";
const nav = ["book", "chapters", "resources", "about", "faq"];
export function Header() { return <header className="sticky top-0 z-30 border-b border-whitegold/10 bg-obsidian/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4"><Link href="/" className="font-display text-2xl text-white">Curls & Contemplation</Link><nav className="hidden items-center gap-5 text-sm text-whitegold/80 md:flex">{nav.map((item) => <Link key={item} href={`/${item}`}>{item}</Link>)}</nav><div className="hidden md:block"><LaunchModeCTA /></div></div></header>; }
