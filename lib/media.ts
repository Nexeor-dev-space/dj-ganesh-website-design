import { assetUrl } from "@/lib/asset-url";

/**
 * The hero mix for the interaction sandbox. The mixes live in object storage
 * (`assets/audio/`), not on disk, so this is a fixed path rather than a
 * directory scan.
 */
const HERO_MIX = "/audio/openformat.mp3";

/**
 * A mix to hand the interaction sandbox (`/dev/interactions`), which needs
 * some audio to exercise the analyser against.
 *
 * The site itself no longer plays anything on arrival — the background mix
 * and its switch were removed. The Tracks player is the only audio a visitor
 * hears, and it reads `data/tracks.ts` rather than this.
 */
export function resolveHeroAudio(): string | null {
  return assetUrl(HERO_MIX);
}
