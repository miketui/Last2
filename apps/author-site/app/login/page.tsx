import { AuthForm } from "@/components/AuthForm";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Log in", "Log in to a customer account.", true);
export default function LoginPage() { return <main className="px-6 py-16"><h1 className="text-center font-display text-5xl text-white">Log in</h1><div className="mt-8"><AuthForm mode="login" /></div></main>; }
