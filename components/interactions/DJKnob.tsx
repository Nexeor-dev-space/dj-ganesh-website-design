"use client";

import { useEffect, useRef } from "react";
import { useAudioEngine } from "@/components/interactions/AudioController";
import { approach, spinStep, type Spin } from "@/components/interactions/motion";
import {
  decayPointerVelocity,
  readPointer,
  subscribeToPointer,
} from "@/components/interactions/pointerStore";

const SIZE = 46;

/** How hard the knob chases the pointer. Lower = further behind, more weight. */
const FOLLOW = { default: 0.11, interactive: 0.16, play: 0.2 } as const;
/** Degrees of spin per pixel of horizontal pointer travel. */
const TORQUE = { default: 0.5, interactive: 0.7, play: 1.1 } as const;

type DJKnobProps = {
  /** Provided by CustomCursor; the knob positions itself in the viewport. */
  className?: string;
};

/**
 * A mixer knob that trails the pointer.
 *
 * It never tracks the cursor directly — position is integrated toward the
 * pointer each frame, so it lags slightly and glides to a stop. Horizontal
 * travel spins the dial, that spin decays to rest, and playing audio makes the
 * ring breathe. All of it is written straight to the DOM inside one animation
 * frame; this component renders once.
 */
export function DJKnob({ className }: DJKnobProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<SVGGElement>(null);
  const accentRef = useRef<SVGCircleElement>(null);
  const { readLevels } = useAudioEngine();

  useEffect(() => {
    const root = rootRef.current;
    const dial = dialRef.current;
    const accentRing = accentRef.current;
    if (!root || !dial || !accentRing) return;

    let x = readPointer().x;
    let y = readPointer().y;
    let spin: Spin = { angle: 0, velocity: 0 };
    let accent = 0;
    let level = 0;
    let frame = 0;

    const unsubscribe = subscribeToPointer(() => {
      root.style.opacity = readPointer().visible ? "1" : "0";
    });

    const render = () => {
      const pointer = readPointer();
      const follow = FOLLOW[pointer.target];
      const torque = TORQUE[pointer.target];

      // Spring-ish follow: a fraction of the remaining distance per frame.
      x = approach(x, pointer.x, follow);
      y = approach(y, pointer.y, follow);

      // Horizontal travel drives the dial; the spin then bleeds off so the
      // knob settles instead of stopping dead.
      spin = spinStep(spin, pointer.vx, torque);
      decayPointerVelocity(0.86);

      // Ease toward the accent while over something interactive.
      accent = approach(accent, pointer.target === "default" ? 0 : 1, 0.12);

      // Audio makes the ring breathe, subtly.
      level = approach(level, readLevels(), 0.2);
      const scale = 1 + level * 0.14 + accent * 0.06;

      root.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(4)})`;
      dial.style.transform = `rotate(${spin.angle.toFixed(2)}deg)`;
      accentRing.style.opacity = accent.toFixed(3);

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, [readLevels]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ width: SIZE, height: SIZE, opacity: 0 }}
      aria-hidden
    >
      <svg width={SIZE} height={SIZE} viewBox="0 0 46 46" fill="none">
        {/* Housing */}
        <circle cx="23" cy="23" r="22" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        <circle
          ref={accentRef}
          cx="23"
          cy="23"
          r="22"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0"
        />

        {/* Dial: tick marks and the indicator, rotating as one */}
        <g ref={dialRef} style={{ transformOrigin: "23px 23px" }}>
          {Array.from({ length: 12 }, (_, i) => {
            const rotation = (i * 360) / 12;
            return (
              <line
                key={i}
                x1="23"
                y1="4"
                x2="23"
                y2={i % 3 === 0 ? "9" : "7"}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                transform={`rotate(${rotation} 23 23)`}
              />
            );
          })}
          <line
            x1="23"
            y1="12"
            x2="23"
            y2="23"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.25"
          />
        </g>
      </svg>
    </div>
  );
}
