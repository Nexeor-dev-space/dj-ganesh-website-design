"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Share of the normal speed a marquee keeps while it is hovered or focused. */
const HOVER_RATE = 0.25;
/** How long the ease between the two speeds takes, in ms. */
const EASE_MS = 600;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Slows every CSS animation inside it while hovered or focused, and eases it
 * back up on leave.
 *
 * Room names are content, so they have to be readable under the pointer — but
 * a hard stop reads as broken. Instead of `animation-play-state`, this tweens
 * each animation's `playbackRate`, which the Web Animations API changes in
 * place without moving the current frame, so the band never jumps.
 * Under reduced motion there are no animations to find and this does nothing.
 */
export function MarqueeSlowdown({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getAnimations !== "function") return;

    let rate = 1;
    let frame = 0;
    let hovered = false;
    let focused = false;

    const easeTo = (target: number) => {
      cancelAnimationFrame(frame);
      const from = rate;
      const start = performance.now();
      const animations = el.getAnimations({ subtree: true });

      const step = (now: number) => {
        const t = Math.min((now - start) / EASE_MS, 1);
        rate = from + (target - from) * easeInOut(t);
        for (const animation of animations) animation.playbackRate = rate;
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const update = () => easeTo(hovered || focused ? HOVER_RATE : 1);
    const onEnter = () => {
      hovered = true;
      update();
    };
    const onLeave = () => {
      hovered = false;
      update();
    };
    const onFocusIn = () => {
      focused = true;
      update();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (el.contains(event.relatedTarget as Node | null)) return;
      focused = false;
      update();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
