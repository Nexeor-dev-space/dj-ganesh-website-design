import { cache } from 'react'
import type {
  SiteSetting, Navigation, HomePage, About, MusicPage, ContactBooking,
  UpcomingShow, MusicRelease, PerformanceHistory, Gallery, LegacyMilestone,
  Testimonial, ExperiencesService,
} from '../../payload-types'
import { getCms } from './client'

// Never throw: globals -> null, collections -> [] on any error.
// Pages may set `export const revalidate = N` if they want ISR.

const DEPTH = 2

function global<T>(slug: string) {
  return cache(async (): Promise<T | null> => {
    try {
      const payload = await getCms()
      return ((await payload.findGlobal({ slug: slug as never, depth: DEPTH })) as unknown as T) ?? null
    } catch {
      return null
    }
  })
}

function collection<T>(slug: string, where?: Record<string, unknown>, sort = 'order') {
  return cache(async (): Promise<T[]> => {
    try {
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
    } catch {
      return []
    }
  })
}

const published = { publishedStatus: { equals: true } }

export const getSiteSettings = global<SiteSetting>('site-settings')
export const getNavigation = global<Navigation>('navigation')
export const getHomePage = global<HomePage>('home-page')
export const getAbout = global<About>('about')
export const getMusicPage = global<MusicPage>('music-page')
export const getContactBooking = global<ContactBooking>('contact-booking')

export const getUpcomingShows = collection<UpcomingShow>('upcoming-shows', { showStatus: { equals: 'upcoming' } })
export const getMusicReleases = collection<MusicRelease>('music-releases', published)
export const getPerformanceHistory = collection<PerformanceHistory>('performance-history')
export const getGalleryAlbums = collection<Gallery>('gallery', published)
export const getLegacyMilestones = collection<LegacyMilestone>('legacy-milestones', published)
export const getTestimonials = collection<Testimonial>('testimonials', published)
export const getExperiencesServices = collection<ExperiencesService>('experiences-services', published)

export const getMilestoneBySlug = cache(async (slug: string): Promise<LegacyMilestone | null> => {
  try {
    const payload = await getCms()
    const res = await payload.find({
      collection: 'legacy-milestones',
      depth: DEPTH,
      draft: false,
      limit: 1,
      where: { and: [{ slug: { equals: slug } }, published] },
    })
    return (res?.docs?.[0] as LegacyMilestone) ?? null
  } catch {
    return null
  }
})
