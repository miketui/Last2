import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_LAUNCH_MODE: z.enum(["preorder", "launched", "paused"]).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_PREORDER: z.string().optional(),
  STRIPE_PRICE_ID_REGULAR: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  MAILERLITE_API_KEY: z.string().optional(),
  ADMIN_EMAILS: z.string().optional()
});

export const env = envSchema.parse(process.env);

export function requiredServerEnv(name: keyof typeof env): string {
  const value = env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

export function hasServerEnv(...names: Array<keyof typeof env>) {
  return names.every((name) => Boolean(env[name]));
}
