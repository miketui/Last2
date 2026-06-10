import { faqs } from "@/content/faq";
export function FAQAccordion() { return <div className="space-y-4">{faqs.map((faq) => <details key={faq.question} className="rounded-2xl border border-whitegold/15 p-5"><summary className="cursor-pointer font-semibold text-white">{faq.question}</summary><p className="mt-3 text-whitegold/80">{faq.answer}</p></details>)}</div>; }
