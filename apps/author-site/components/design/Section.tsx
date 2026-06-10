import type { ReactNode } from "react";
import clsx from "clsx";

export function Section({ eyebrow, title, children, className }: { eyebrow?: string; title?: string; children: ReactNode; className?: string }) {
  return <section className={clsx("mx-auto w-full max-w-6xl px-6 py-16 md:py-24", className)}>{eyebrow && <p className="editorial-kicker mb-4">{eyebrow}</p>}{title && <h2 className="font-display text-4xl text-white md:text-6xl">{title}</h2>}<div className="mt-8 text-lg leading-8 text-whitegold/85">{children}</div></section>;
}
