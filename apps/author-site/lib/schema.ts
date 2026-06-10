import { book, priceConfig } from "@/content/book";
import { siteConfig } from "@/content/site";

export function bookJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    description: book.description,
    offers: {
      "@type": "Offer",
      price: priceConfig.preorderDirect.amount.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      url: `${siteConfig.siteUrl}/preorder`
    }
  };
}
