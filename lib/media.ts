import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolves which hero background media is actually present in `public/`.
 *
 * Drop a file at one of the paths below and it is picked up on the next build —
 * no code change required. Video wins over image; if neither exists the hero
 * falls back to a pure-CSS backdrop.
 */
export const heroMedia = {
  video: "/videos/hero.mp4",
  poster: "/images/dj-ganesh-hero.jpg",
} as const;

function publicFileExists(publicPath: string): boolean {
  return existsSync(path.join(process.cwd(), "public", publicPath));
}

export type HeroMediaSource =
  | { kind: "video"; src: string; poster: string | null }
  | { kind: "image"; src: string }
  | { kind: "none" };

export function resolveHeroMedia(): HeroMediaSource {
  const hasImage = publicFileExists(heroMedia.poster);

  if (publicFileExists(heroMedia.video)) {
    return {
      kind: "video",
      src: heroMedia.video,
      poster: hasImage ? heroMedia.poster : null,
    };
  }

  if (hasImage) {
    return { kind: "image", src: heroMedia.poster };
  }

  return { kind: "none" };
}
