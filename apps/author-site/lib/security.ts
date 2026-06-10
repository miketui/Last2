import { getSessionUser } from "@/lib/supabase/server";

export function adminEmailAllowlist() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.email) return { ok: false as const, reason: "Admin authentication required." };
  const allowed = adminEmailAllowlist().includes(user.email.toLowerCase());
  return allowed ? { ok: true as const, user } : { ok: false as const, reason: "Admin authorization required." };
}
