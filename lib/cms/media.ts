import type { Media } from '../../payload-types'

export type ResolvedMedia = { url: string | undefined; alt: string | undefined }

/**
 * Resolve a Payload upload field (Media object | id | null | undefined)
 * to { url, alt }. Falls back to the supplied code constants.
 */
export function resolveMedia(
  field: number | Media | null | undefined,
  fallbackSrc?: string,
  fallbackAlt?: string,
): ResolvedMedia {
  if (field && typeof field === 'object' && field.url) {
    return { url: field.url, alt: field.alt || fallbackAlt }
  }
  return { url: fallbackSrc, alt: fallbackAlt }
}
