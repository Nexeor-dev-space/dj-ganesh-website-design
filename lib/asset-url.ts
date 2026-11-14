/**
 * Site photos, video and audio live in object storage (MinIO bucket
 * `dj-ganesh`, folder `assets/`), not in `public/`. Every hardcoded asset path
 * goes through here, so the storage host or a CDN in front of it is one env
 * var: NEXT_PUBLIC_MEDIA_BASE_URL, e.g.
 *   https://api.staging-obj-blob.client2.nexeor.com/dj-ganesh/assets
 *
 * Unset (local dev), paths stay relative and are served from `public/`.
 * It is inlined at build time, so on Coolify it must also be a build variable.
 */
const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").trim().replace(/\/+$/, "");

/** `/images/x.jpg` -> `<base>/images/x.jpg`, or unchanged when no base is set. */
export function assetUrl(path: string): string {
  if (!MEDIA_BASE_URL) return path;
  return `${MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
