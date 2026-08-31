"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Latches true the first time the element scrolls into view.
 *
 * The page's entrance animations are CSS — `.reveal-scroll` under a
 * `[data-visible="true"]` ancestor — so all this has to do is flip that
 * attribute once and then stop watching.
 */
export function useSectionVisible<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}
