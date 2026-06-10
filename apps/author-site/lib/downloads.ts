import { siteConfig } from "@/content/site";
import { checkDownloadEntitlement } from "@/lib/entitlements";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const deliverables = {
  epub: { slug: "epub", label: "EPUB", path: siteConfig.deliverables.epub },
  pdf: { slug: "pdf", label: "PDF", path: siteConfig.deliverables.pdf }
} as const;

export type DeliverableSlug = keyof typeof deliverables;

export async function createSignedDownloadUrl(userId: string, slug: DeliverableSlug) {
  const entitlement = await checkDownloadEntitlement(userId, slug);
  if (!entitlement.allowed) return entitlement;

  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { allowed: false as const, reason: "Download signing service is not configured." };

  const item = deliverables[slug];
  const { data, error } = await supabase.storage.from(siteConfig.storageBucket).createSignedUrl(item.path, 60 * 60 * 24);
  if (error || !data?.signedUrl) return { allowed: false as const, reason: "Unable to create a private signed URL." };

  await supabase.from("download_events").insert({ user_id: userId, purchase_id: entitlement.purchaseId, deliverable_slug: slug, event_type: "download_signed" });
  return { allowed: true as const, url: data.signedUrl, expiresInSeconds: 60 * 60 * 24 };
}
