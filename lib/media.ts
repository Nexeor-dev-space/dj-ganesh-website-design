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
 * Temporary kill switch: the supplied mixes in `public/audio` are corrupted,
 * so the site ships silent rather than streaming a broken file. The files are
 * left in place — set this back to `false` once a good mix is dropped in.
 */
const BACKGROUND_AUDIO_DISABLED = true;

/**
 * The mix the hero should offer. Returns null when no audio has been supplied
 * yet, so callers can render a disabled control instead of a broken one.
 */
export function resolveHeroAudio(): string | null {
  if (BACKGROUND_AUDIO_DISABLED) return null;

  const sources = listAudioSources();
  if (sources.length === 0) return null;

  const preferred = PREFERRED_HERO_MIXES.map((name) =>
    sources.find((src) => path.basename(src, path.extname(src)) === name),
  ).find(Boolean);

  return preferred ?? sources[0];
}
