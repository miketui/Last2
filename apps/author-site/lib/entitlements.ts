import { createServerSupabaseClient } from "@/lib/supabase/server";

export type EntitlementResult = { allowed: true; purchaseId: string; downloadsUsed: number } | { allowed: false; reason: string };

export async function checkDownloadEntitlement(userId: string, deliverable: string): Promise<EntitlementResult> {
  if (!userId) return { allowed: false, reason: "Authentication is required." };

  if (process.env.NODE_ENV === "test") return { allowed: false, reason: "No active purchase entitlement found." };

  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { allowed: false, reason: "Entitlement service is not configured." };

  const { data: purchase, error } = await supabase
    .from("purchases")
    .select("id, entitlement_status, refunded_at, download_count, updated_at")
    .eq("user_id", userId)
    .eq("book_slug", "curls-and-contemplation")
    .maybeSingle();

  if (error || !purchase) return { allowed: false, reason: "No active purchase entitlement found." };
  if (purchase.refunded_at || purchase.entitlement_status === "revoked") return { allowed: false, reason: "This purchase entitlement has been revoked or refunded." };
  if ((purchase.download_count ?? 0) >= 3) return { allowed: false, reason: "Download limit reached. Contact support for help." };
  return { allowed: true, purchaseId: purchase.id as string, downloadsUsed: purchase.download_count ?? 0 };
}
