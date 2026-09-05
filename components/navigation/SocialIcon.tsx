import type { SocialLink } from "@/types/site";

type SocialIconProps = {
  name: SocialLink["icon"];
  className?: string;
};

/**
 * Inline social glyphs — kept local so the navigation ships no icon library.
 * Drawn on a 24×24 grid and inherit `currentColor`.
 *
 * Each viewBox is cropped to its own glyph rather than to the shared grid.
 * On the common 24×24 box the marks are not the same size — Instagram's
 * rounded square fills 18 of the 24 units vertically, YouTube's badge only
 * 14 — so at one box size YouTube came out a fifth shorter than the icon
 * beside it. Cropped, both fill the box's height exactly, and the call sites
 * set a height and leave the width to the aspect ratio: YouTube's badge is a
 * wide mark and stays wider than Instagram's square, which is how the two
 * marks actually are.
 */
export function SocialIcon({ name, className }: SocialIconProps) {
  const common = {
    "aria-hidden": true,
    focusable: false as const,
    className,
  };

  if (name === "instagram") {
    return (
      <svg
        {...common}
        /* Half the 1.6 stroke sits outside the 3→21 path bounds. */
        viewBox="2.2 2.2 19.6 19.6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "email") {
    return (
      <svg
        {...common}
        /* Half the 2px stroke sits outside the 3→19 path bounds. */
        viewBox="1 2.6 22 18.8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2.6 5.4 9.4 6.6 9.4-6.6" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="2 5 20 14" fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.28 5 12 5 12 5s-6.28 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.72 19 12 19 12 19s6.28 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10.1 14.85v-5.7L15 12l-4.9 2.85Z" />
    </svg>
  );
}
