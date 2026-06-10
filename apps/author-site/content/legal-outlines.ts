export const legalOutlines = {
  privacy: ["Data collected for account, purchase, delivery, consent, analytics, and support operations.", "Human legal review required before production."],
  terms: ["Use of the site, account responsibilities, digital product delivery, and limitation language are scaffolded.", "Human legal review required before production."],
  refund: ["Refund decisions should revoke download entitlement when granted.", "Human legal review required before production."],
  preorder: ["Preorder terms must state expected delivery timing, price, and contact path.", "Human legal review required before production."],
  delivery: ["Digital files are delivered only through authenticated, protected signed URLs.", "Human legal review required before production."],
  cookies: ["Consent-aware analytics and marketing pixels must honor user choices.", "Human legal review required before production."],
  accessibility: ["The site aims for readable copy, keyboard access, reduced motion support, and clear contrast.", "Human accessibility review required before production."]
} as const;
