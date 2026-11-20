import { cache } from 'react'
import type {
  SiteSetting, Navigation, HomePage, About, MusicPage, ContactBooking, PrivacyPolicy,
  UpcomingShow, MusicRelease, PerformanceHistory, Gallery, LegacyMilestone,
  Testimonial, ExperiencesService,
} from '../../payload-types'
import { getCms } from './client'

// Empty CMS content -> null / [], and each page falls back to its built-in
// copy. A failed read is different: it is retried, and if the database still
// can't be reached the error is thrown, so the page rebuild fails and Next
// keeps serving the last good version (built from the CMS) instead of caching
// the built-in copy over the editors' content.

const DEPTH = 2

/** Three tries, ~0.4s and ~0.8s apart: the database link drops for a moment now and then. */
async function withRetry<T>(run: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await run()
    } catch (error) {
      lastError = error
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)))
    }
  }
  throw lastError
}

function global<T>(slug: string) {
  return cache(async (): Promise<T | null> =>
    withRetry(async () => {
      const payload = await getCms()
      return ((await payload.findGlobal({ slug: slug as never, depth: DEPTH })) as unknown as T) ?? null
    }),
  )
}

function collection<T>(slug: string, where?: Record<string, unknown>, sort = 'order') {
  return cache(async (): Promise<T[]> =>
    withRetry(async () => {
      const payload = await getCms()
      const res = await payload.find({
        collection: slug as never,
        depth: DEPTH,
        draft: false,
        limit: 200,
        pagination: false,
        sort,
        where: where as never,
      })
      return (res?.docs ?? []) as unknown as T[]
    }),
  )
}

const published = { publishedStatus: { equals: true } }

export const getSiteSettings = global<SiteSetting>('site-settings')
export const getNavigation = global<Navigation>('navigation')
export const getHomePage = global<HomePage>('home-page')
export const getAbout = global<About>('about')
export const getMusicPage = global<MusicPage>('music-page')
export const getContactBooking = global<ContactBooking>('contact-booking')
export const getPrivacyPolicy = global<PrivacyPolicy>('privacy-policy')

export const getUpcomingShows = collection<UpcomingShow>('upcoming-shows', { showStatus: { equals: 'upcoming' } })
export const getMusicReleases = collection<MusicRelease>('music-releases', published)
export const getPerformanceHistory = collection<PerformanceHistory>('performance-history')
export const getGalleryAlbums = collection<Gallery>('gallery', published)
export const getLegacyMilestones = collection<LegacyMilestone>('legacy-milestones', published)
export const getTestimonials = collection<Testimonial>('testimonials', published)
export const getExperiencesServices = collection<ExperiencesService>('experiences-services', published)

export const getMilestoneBySlug = cache(async (slug: string): Promise<LegacyMilestone | null> =>
  withRetry(async () => {
    const payload = await getCms()
    const res = await payload.find({
      collection: 'legacy-milestones',
      depth: DEPTH,
      draft: false,
      limit: 1,
      where: { and: [{ slug: { equals: slug } }, published] },
    })
    return (res?.docs?.[0] as LegacyMilestone) ?? null
  }),
)
