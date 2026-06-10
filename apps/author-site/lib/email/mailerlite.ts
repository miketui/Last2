export type MailerLiteGroup =
  | "subscribers"
  | "free_chapter"
  | "preorders"
  | "customers"
  | "abandoned_checkout"
  | "bonus_claim_started"
  | "bonus_claim_completed"
  | "refunded"
  | "blog_readers";

const groupEnv: Record<MailerLiteGroup, string> = {
  subscribers: "MAILERLITE_GROUP_SUBSCRIBERS",
  free_chapter: "MAILERLITE_GROUP_FREE_CHAPTER",
  preorders: "MAILERLITE_GROUP_PREORDERS",
  customers: "MAILERLITE_GROUP_CUSTOMERS",
  abandoned_checkout: "MAILERLITE_GROUP_ABANDONED_CHECKOUT",
  bonus_claim_started: "MAILERLITE_GROUP_BONUS_CLAIM_STARTED",
  bonus_claim_completed: "MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED",
  refunded: "MAILERLITE_GROUP_REFUNDED",
  blog_readers: "MAILERLITE_GROUP_BLOG_READERS"
};

export async function upsertSubscriber(email: string, group: MailerLiteGroup, fields: Record<string, string> = {}) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env[groupEnv[group]];
  if (!apiKey || !groupId) return { ok: false, skipped: true, reason: "MailerLite is not configured." } as const;

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, fields, groups: [groupId] })
  });

  if (!response.ok) return { ok: false, skipped: false, reason: await response.text() } as const;
  return { ok: true, skipped: false } as const;
}
