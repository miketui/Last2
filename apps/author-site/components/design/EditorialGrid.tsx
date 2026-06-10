import type { ReactNode } from "react";
export function EditorialGrid({ children }: { children: ReactNode }) { return <div className="grid gap-8 md:grid-cols-3">{children}</div>; }
