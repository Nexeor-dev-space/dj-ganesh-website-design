import type { CSSProperties } from "react";
import type { Stage } from "@/types/stages";

type StageMarqueeProps = {
  stages: readonly Stage[];
  /** Which way the row travels. */
  direction: "left" | "right";
  /** Seconds for one full pass. Longer rows should take longer. */
  duration: number;
  /** Lifts a row above the photograph so its names cross in front of it. */
  inFront?: boolean;
};

/**
 * One scrolling row of room names.
 *
 * The list is printed twice and the track slides exactly half its width, so
 * the second copy lands where the first began and the loop is seamless. Only
 * the first copy is in the accessibility tree — the duplicate is decoration,
 * and a screen reader should hear each room once.
 */
export function StageMarquee({
  stages,
  direction,
  duration,
  inFront = false,
}: StageMarqueeProps) {
  const group = (
    <ul className="stage-row__group">
      {stages.map((stage) => (
        <li
          key={stage.name}
          className="stage-row__item"
          data-featured={stage.featured ? "true" : undefined}
        >
          {stage.name}
          <span className="stage-row__sep" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="stage-row"
      data-front={inFront ? "true" : undefined}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-direction": direction === "left" ? "normal" : "reverse",
        } as CSSProperties
      }
    >
      <div className="stage-row__track">
        {group}
        <div aria-hidden>{group}</div>
      </div>
    </div>
  );
}
