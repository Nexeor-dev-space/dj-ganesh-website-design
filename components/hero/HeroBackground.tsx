import Image from "next/image";
import { resolveHeroMedia } from "@/lib/media";

/**
 * Full-bleed cinematic backdrop for the hero.
 *
 * Media is resolved from `public/` at build time (see `lib/media.ts`):
 * `videos/hero.mp4` wins, `images/dj-ganesh-hero.jpg` is the fallback, and a
 * CSS-only backdrop renders when neither is present. Everything here is
 * decorative and absolutely positioned, so it can never shift hero content.
 */
export function HeroBackground() {
  const media = resolveHeroMedia();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {media.kind === "video" && (
        <video
          className="reveal-fade absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.poster ?? undefined}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      )}

      {media.kind === "image" && (
        <div className="media-drift absolute inset-0">
          <Image
            src={media.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="reveal-fade object-cover object-[62%_38%] md:object-[50%_42%]"
          />
        </div>
      )}

      {media.kind === "none" && (
        <div className="overlay-placeholder media-drift absolute inset-0" />
      )}

      {/* 1 — overall darkening, keeps white type readable */}
      <div className="absolute inset-0 bg-[rgba(5,5,5,0.28)]" />
      {/* 2 — bottom-to-top black gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
      {/* 3 — top scrim, keeps the navigation and eyebrow legible */}
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-background/70 via-background/20 to-transparent" />
      {/* 4 — left column weight, so the editorial content reads first */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent md:from-background/75 md:via-background/5" />
      {/* 5 — vignette */}
      <div className="overlay-vignette absolute inset-0" />
      {/* 6 — grain */}
      <div className="overlay-grain absolute inset-0" />
    </div>
  );
}
