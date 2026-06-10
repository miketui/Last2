import { getLaunchCta, getLaunchMode } from "@/lib/launch-mode";
import { Button } from "@/components/Button";

export function LaunchModeCTA({ className }: { className?: string }) {
  const cta = getLaunchCta(getLaunchMode());
  return <div><Button href={cta.href} className={className}>{cta.label}</Button><p className="mt-2 text-sm text-whitegold/70">{cta.helper}</p></div>;
}
