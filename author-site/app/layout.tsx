import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { CurlCursorTrail } from "@/components/motion/CurlCursorTrail";
import { PageTransition } from "@/components/motion/PageTransition";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { siteConfig } from "@/content/site";
import { personJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: "Author-commerce scaffold for Michael David's Curls & Contemplation.",
  metadataBase: new URL(siteConfig.siteUrl),
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    title: siteConfig.name,
    description: "A premium author-commerce site for Curls & Contemplation.",
    siteName: siteConfig.name,
    url: siteConfig.siteUrl,
    type: "website"
  },
  twitter: { card: "summary_large_image", title: siteConfig.name }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} /><ReducedMotionProvider><Header /><PageTransition>{children}</PageTransition><Footer /><ConsentBanner /><CurlCursorTrail /></ReducedMotionProvider></body></html>;
}
