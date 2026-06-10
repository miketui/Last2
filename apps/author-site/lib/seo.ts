import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

export function pageMetadata(title: string, description: string, noIndex = false): Metadata {
  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, siteName: siteConfig.name, type: "website" }
  };
}
