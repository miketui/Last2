"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { shouldDisableCurlTrail } from "@/lib/motion-policy";

type TrailPoint = { x: number; y: number; id: number; age: number };

export function CurlCursorTrail() {
  const reduced = useReducedMotion();
  const pathname = usePathname() ?? "/";
  const [enabledPointer, setEnabledPointer] = useState(false);
  const [points, setPoints] = useState<TrailPoint[]>([]);
  const rafRef = useRef<number | null>(null);
  const latestRef = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const disabled = shouldDisableCurlTrail(pathname, reduced);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointer = () => setEnabledPointer(finePointer.matches);
    const frame = window.requestAnimationFrame(updatePointer);
    finePointer.addEventListener("change", updatePointer);
    return () => {
      window.cancelAnimationFrame(frame);
      finePointer.removeEventListener("change", updatePointer);
    };
  }, []);

  useEffect(() => {
    if (disabled || !enabledPointer) return undefined;

    const flush = () => {
      rafRef.current = null;
      const latest = latestRef.current;
      if (!latest) return;
      idRef.current += 1;
      setPoints((current) => [
        ...current.slice(-7).map((point) => ({ ...point, age: point.age + 1 })),
        { x: latest.x, y: latest.y, id: idRef.current, age: 0 }
      ]);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.pointerType === "pen") return;
      latestRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [disabled, enabledPointer]);

  const strands = useMemo(() => ["M3 21C12 4 20 28 31 10", "M2 14C10 2 19 25 28 6", "M4 24C8 10 22 25 30 13"], []);

  if (disabled || !enabledPointer || points.length === 0) return null;

  return (
    <div aria-hidden="true" data-testid="curl-cursor-trail" className="curl-cursor-trail pointer-events-none fixed inset-0 z-50 hidden md:block">
      {points.map((point, index) => (
        <svg
          key={point.id}
          className="curl-trail-mark absolute h-8 w-8 text-antique"
          viewBox="0 0 34 34"
          style={{
            transform: `translate3d(${point.x - 12}px, ${point.y - 12}px, 0) rotate(${index * 8}deg)`,
            opacity: Math.max(0.04, 0.18 - point.age * 0.02)
          }}
        >
          <path d={strands[index % strands.length]} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      ))}
    </div>
  );
}
