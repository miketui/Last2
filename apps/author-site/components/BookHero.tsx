import { book } from "@/content/book";
import { BookMockup } from "@/components/BookMockup";
import { LaunchModeCTA } from "@/components/LaunchModeCTA";
import { BookTilt } from "@/components/motion/BookTilt";

export function BookHero() { return <section className="experience-surface px-6 py-20 md:py-28"><div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]"><div><p className="editorial-kicker">Recognition • Relief • Authority</p><h1 className="mt-5 font-display text-5xl text-white md:text-7xl">{book.title}</h1><p className="mt-4 max-w-2xl text-2xl text-whitegold">{book.subtitle}</p><p className="mt-6 max-w-2xl text-lg leading-8 text-whitegold/80">{book.description}</p><LaunchModeCTA className="mt-8" /></div><BookTilt><BookMockup /></BookTilt></div></section>; }
