import type { SocialLink } from "@/types/site";

type SocialIconProps = {
  name: SocialLink["icon"];
  className?: string;
};

/**
 * Inline social glyphs — kept local so the navigation ships no icon library.
 * Drawn on a 24×24 grid and inherit `currentColor`.
 */
export function SocialIcon({ name, className }: SocialIconProps) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false as const,
    className,
  };

  if (name === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...common} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.28 5 12 5 12 5s-6.28 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.72 19 12 19 12 19s6.28 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10.1 14.85v-5.7L15 12l-4.9 2.85Z" />
    </svg>
  );
}
