import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { CurlCursorTrail } from "@/components/motion/CurlCursorTrail";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: "Author-commerce scaffold for Michael David's Curls & Contemplation.",
  metadataBase: new URL(siteConfig.siteUrl)
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><ReducedMotionProvider><Header />{children}<Footer /><ConsentBanner /><CurlCursorTrail /></ReducedMotionProvider></body></html>;
}
