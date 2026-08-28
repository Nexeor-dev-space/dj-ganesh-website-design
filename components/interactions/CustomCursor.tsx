"use client";

import { useEffect, useRef } from "react";
import { DJKnob } from "@/components/interactions/DJKnob";
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
 * Desktop cursor system: a small precise dot at the pointer, with the mixer
 * knob trailing behind it.
 *
 * Renders nothing at all on touch devices or when reduced motion is requested,
 * and the native cursor is only hidden while it is actually active — so
 * keyboard use, focus rings and screen readers are untouched.
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const active = hasFinePointer && !reducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.dataset.customCursor = "on";

    let x = readPointer().x;
    let y = readPointer().y;
    let frame = 0;

    const unsubscribe = subscribeToPointer(() => {
      dot.style.opacity = readPointer().visible ? "1" : "0";
    });

    const render = () => {
      const pointer = readPointer();

      // The dot sits almost exactly on the pointer; the knob does the trailing.
      x = approach(x, pointer.x, 0.55);
      y = approach(y, pointer.y, 0.55);

      const scale = pointer.target === "default" ? 1 : 0.4;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;

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
      <DJKnob className="fixed top-0 left-0 will-change-transform" />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-[5px] w-[5px] rounded-full bg-foreground opacity-0 transition-[background-color] duration-200 will-change-transform"
      />
    </div>
  );
}
