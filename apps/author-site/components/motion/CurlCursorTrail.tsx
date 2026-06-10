"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

const disabledPrefixes = ["/checkout", "/login", "/signup", "/dashboard", "/downloads", "/admin", "/privacy", "/terms", "/refund-policy", "/preorder-policy", "/digital-delivery-policy", "/cookies", "/accessibility"];

export function CurlCursorTrail() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const disabled = reduced || disabledPrefixes.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (disabled || matchMedia("(pointer: coarse)").matches) return;
    let id = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      id += 1;
      setPoints((current) => [...current.slice(-5), { x: event.clientX, y: event.clientY, id }]);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [disabled]);

  if (disabled) return null;
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-50 hidden md:block">{points.map((point) => <span key={point.id} className="curl-trail-mark absolute text-2xl text-antique" style={{ left: point.x, top: point.y }}>⌁</span>)}</div>;
}
