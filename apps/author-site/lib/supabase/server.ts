import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get("cc_demo_email")?.value;
  const userId = cookieStore.get("cc_demo_user")?.value;
  if (email && userId) return { id: userId, email };
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
}
