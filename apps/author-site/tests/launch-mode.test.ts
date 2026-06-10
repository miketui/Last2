import { describe, expect, it } from "vitest";
import { getLaunchCta, type LaunchMode } from "@/lib/launch-mode";

describe("launch mode CTA", () => {
  it.each([
    ["preorder", "Preorder the direct edition"],
    ["launched", "Buy the direct edition"],
    ["paused", "Join the update list"]
  ] as Array<[LaunchMode, string]>)("switches %s copy", (mode, label) => {
    expect(getLaunchCta(mode).label).toBe(label);
  });
});
