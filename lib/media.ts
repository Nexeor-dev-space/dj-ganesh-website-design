import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const AUDIO_DIR = "audio";
const AUDIO_EXTENSIONS = [".mp3", ".m4a", ".ogg", ".wav"];

/**
 * Preferred hero mixes, in order. The first name that actually exists in
 * `public/audio` wins; if none match, the first audio file found is used.
 * Nothing here is assumed to exist — the directory is the source of truth.
 */
const PREFERRED_HERO_MIXES = ["hero-mix", "hero", "openformat", "bollywood"];

/** Every audio file present in `public/audio`, as public URLs. */
export function listAudioSources(): string[] {
  const dir = path.join(process.cwd(), "public", AUDIO_DIR);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => AUDIO_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => `/${AUDIO_DIR}/${file}`);
}

/**
 * A mix to hand the interaction sandbox (`/dev/interactions`), which needs
 * some audio to exercise the analyser against. Returns null when no audio has
 * been supplied at all, so callers can render a disabled control rather than
 * a broken one.
 *
 * The site itself no longer plays anything on arrival — the background mix
 * and its switch were removed. The Tracks player is the only audio a visitor
 * hears, and it reads `data/tracks.ts` rather than this.
 */
export function resolveHeroAudio(): string | null {
  const sources = listAudioSources();
  if (sources.length === 0) return null;

  const preferred = PREFERRED_HERO_MIXES.map((name) =>
    sources.find((src) => path.basename(src, path.extname(src)) === name),
  ).find(Boolean);

  return preferred ?? sources[0];
}
