"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query as an external store — the right primitive here,
 * since the browser owns the value. No effects, no cascading renders, and it
 * renders as `false` on the server so the markup matches first paint.
 */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** True when the visitor has asked for less motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for a precise pointing device (mouse/trackpad). Touch and stylus
 * input report `coarse`, which is how the cursor system stays off phones.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
