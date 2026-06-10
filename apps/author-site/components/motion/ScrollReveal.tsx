"use client";
import type { ReactNode } from "react";
export function ScrollReveal({ children }: { children: ReactNode }) { return <div className="motion-safe:transition motion-safe:duration-500">{children}</div>; }
