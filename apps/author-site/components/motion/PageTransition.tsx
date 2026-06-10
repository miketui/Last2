"use client";
import type { ReactNode } from "react";
export function PageTransition({ children }: { children: ReactNode }) { return <div className="motion-safe:animate-[fadeIn_300ms_ease-out]">{children}</div>; }
