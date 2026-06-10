"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
const ReducedMotionContext = createContext(true);
export function ReducedMotionProvider({ children }: { children: ReactNode }) { const [reduced, setReduced] = useState(true); useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReduced(media.matches); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []); return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>; }
export function useReducedMotion() { return useContext(ReducedMotionContext); }
