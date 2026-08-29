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
 * The mix the site opens with. Returns null only when no audio has been
 * supplied at all, so callers can render a disabled control rather than a
 * broken one.
 *
 * A kill switch used to sit here, on the grounds that the supplied mixes were
 * corrupt. They are not: all four decode cleanly (2:22 to 4:43, 256–320kbps)
 * and play in the Tracks section. All it did was silence the background mix.
 */
export function resolveHeroAudio(): string | null {
  const sources = listAudioSources();
  if (sources.length === 0) return null;

  const preferred = PREFERRED_HERO_MIXES.map((name) =>
    sources.find((src) => path.basename(src, path.extname(src)) === name),
  ).find(Boolean);

  return preferred ?? sources[0];
}
