/**
 * Shared CMS→code-shape mappers.
 *
 * Wiring agents use these so the shapes the components already expect
 * (types/*) are produced identically from Payload docs. Usage pattern:
 *
 *   const releases = await getMusicReleases()
 *   const items = releases.length ? releases.map(toTrack) : tracks // code fallback
 *
 * When the CMS mirrors the seeded code content, the mapped output equals the
 * hardcoded constant, so the rendered site stays byte-identical.
 */
import type { MusicRelease, LegacyMilestone, Testimonial as CmsTestimonial } from '@/payload-types'
import type { Track } from '@/types/music'
import type { Milestone } from '@/types/legacy'
import type { Testimonial } from '@/types/testimonials'
import { resolveMedia } from '@/lib/cms/media'

/** CMS `genre` select value → the human label the release cards show as `tag`. */
const GENRE_LABEL: Record<string, string> = {
  'indo-tech': 'Indo Tech',
  'afro-house': 'Afro House',
  'afro-mashup': 'Afro Mashup',
  bollyafro: 'BollyAfro',
  other: 'Other',
}

/** Pull the 11-char YouTube id from a watch/share/embed URL, or pass an id through. */
export function extractYoutubeId(input: string | null | undefined): string {
  if (!input) return ''
  const s = String(input).trim()
  // already a bare id
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : ''
}

function youtubeThumbnail(youtubeId: string): string {
  return youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : ''
}

/** MusicRelease → Track (types/music). */
export function toTrack(r: MusicRelease): Track {
  const youtubeId = extractYoutubeId(r.youtubeUrl)
  return {
    id: String(r.id),
    title: r.title ?? '',
    tag: GENRE_LABEL[r.genre as string] ?? String(r.genre ?? ''),
    artist: r.artist ?? '',
    audio: r.audioUrl ?? '',
    youtubeId,
    thumbnail: youtubeThumbnail(youtubeId),
    artwork: resolveMedia(r.artwork as never, '').url ?? '',
  }
}

/** LegacyMilestone → Milestone (types/legacy). `id` prefers the stable slug. */
export function toMilestone(m: LegacyMilestone): Milestone {
  return {
    id: m.slug || String(m.id),
    year: String(m.year ?? ''),
    title: m.title ?? '',
    lede: m.description ?? '',
    more: m.more ?? '',
  }
}

/**
 * Testimonial (CMS) → Testimonial (types/testimonials).
 * `id` is the archive number shown in the UI ("01", "02", …); it comes from the
 * sorted position so it matches the code fallback, since the CMS has no such field.
 */
export function toTestimonial(t: CmsTestimonial, index: number): Testimonial {
  return {
    id: String(index + 1).padStart(2, '0'),
    quote: t.testimonial ?? '',
    author: t.name ?? '',
    location: t.location ?? '',
  }
}
