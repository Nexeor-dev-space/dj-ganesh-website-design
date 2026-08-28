import { existsSync } from "node:fs";
import path from "node:path";

/**
 * The hero mix for the in-page sound toggle.
 *
 * Drop a client-supplied file at this exact path and the control activates on
 * the next build; until then it renders disabled rather than pointing at a
 * filename that does not exist.
 */
export const heroAudioSrc = "/audio/hero-mix.mp3";

export function resolveHeroAudio(): string | null {
  const onDisk = path.join(process.cwd(), "public", heroAudioSrc);
  return existsSync(onDisk) ? heroAudioSrc : null;
}
