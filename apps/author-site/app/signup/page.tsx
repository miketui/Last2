import { AuthForm } from "@/components/AuthForm";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Sign up", "Create a customer account.", true);
export default function SignupPage() { return <main className="px-6 py-16"><h1 className="text-center font-display text-5xl text-white">Create account</h1><div className="mt-8"><AuthForm mode="signup" /></div></main>; }
