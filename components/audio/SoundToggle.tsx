/**
 * The site's sound button — reserved, not wired to anything yet.
 *
 * The background mix and its switch were deliberately removed (see the note
 * on `resolveHeroAudio` in `lib/media.ts`): nothing on the site plays on
 * arrival any more, and the Tracks player is the only audio a visitor hears,
 * scoped to the Music section rather than global. This keeps the same round
 * control in the same spot so the corner isn't left empty, showing the muted
 * state permanently until it has something real to govern.
 */
export function SoundToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      disabled
      aria-label="Sound not available yet"
      className={[
        "flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-full border border-white/20",
        "bg-background/30 text-white/25 backdrop-blur-sm md:h-14 md:w-14",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-6 w-6 md:h-7 md:w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" />
        <path d="m16.5 9.5 4 4m0-4-4 4" />
      </svg>
    </button>
  );
}
