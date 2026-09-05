"use client";

import { useEffect, useRef } from "react";
import { approach } from "@/components/interactions/motion";
import {
  readPointer,
  subscribeToPointer,
} from "@/components/interactions/pointerStore";
import {
  useHasFinePointer,
  usePrefersReducedMotion,
} from "@/components/interactions/environment";

/**
 * The site cursor: a ring and a dot.
 *
 * The dot sits on the pointer and the ring follows a beat behind, so movement
 * has a little weight without the circle ever losing the pointer. Over
 * anything clickable the ring opens up and takes the accent, and the dot
 * steps back — the whole state change is two numbers eased per frame.
 *
 * Deliberately plain. It replaced a mixer-knob cursor that spun with pointer
 * travel and breathed with the audio, and a pointer-driven flame that revealed
 * a photograph through the page; both were doing more work than a cursor
 * should.
 *
 * Renders nothing at all on touch devices or when reduced motion is requested,
 * and the native cursor is only hidden while it is actually active — so
 * keyboard use, focus rings and screen readers are untouched.
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const active = hasFinePointer && !reducedMotion;

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.dataset.customCursor = "on";

    const start = readPointer();
    let dotX = start.x;
    let dotY = start.y;
    let ringX = start.x;
    let ringY = start.y;
    /** 0 while over ordinary ground, 1 over something clickable. */
    let accent = 0;
    let frame = 0;

    const unsubscribe = subscribeToPointer(() => {
      const opacity = readPointer().visible ? "1" : "0";
      ring.style.opacity = opacity;
      dot.style.opacity = opacity;
    });

    const render = () => {
      const pointer = readPointer();

      // The dot is all but pinned to the pointer; the ring is what trails.
      dotX = approach(dotX, pointer.x, 0.55);
      dotY = approach(dotY, pointer.y, 0.55);
      ringX = approach(ringX, pointer.x, 0.18);
      ringY = approach(ringY, pointer.y, 0.18);

      accent = approach(accent, pointer.target === "default" ? 0 : 1, 0.12);

      const ringScale = 1 + accent * 0.55;
      const dotScale = 1 - accent * 0.6;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;
      ring.style.borderColor = accent > 0.5 ? "var(--accent)" : "rgba(255,255,255,0.45)";
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale.toFixed(3)})`;

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      delete document.documentElement.dataset.customCursor;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden lg:block" aria-hidden>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 h-9 w-9 rounded-full border border-white/45 opacity-0 transition-[border-color] duration-200 will-change-transform"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-[5px] w-[5px] rounded-full bg-foreground opacity-0 will-change-transform"
      />
    </div>
  );
}
