import { getLaunchCta, getLaunchMode } from "@/lib/launch-mode";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";

export function LaunchModeCTA({ className }: { className?: string }) {
  const cta = getLaunchCta(getLaunchMode());
  return (
    <div>
      <MagneticCurlButton href={cta.href} className={className}>{cta.label}</MagneticCurlButton>
      <p className="mt-2 max-w-sm text-sm text-whitegold/70">{cta.helper}</p>
    </div>
  );
}
