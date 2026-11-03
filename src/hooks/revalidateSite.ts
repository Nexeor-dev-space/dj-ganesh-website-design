import type { CollectionConfig, GlobalConfig } from 'payload'

/**
 * Which public pages read each CMS collection or global, so a save refreshes
 * only those pages. Anything that feeds the header, footer or menu — shown
 * on every page — refreshes the whole site, as does anything not listed.
 */
const SITE = 'all' as const
const PAGES: Record<string, readonly string[] | typeof SITE> = {
  // Shared layout (navigation, footer, menu marquee, Book button, WhatsApp).
  'site-settings': SITE,
  navigation: SITE,
  'contact-booking': SITE,
  'home-page': SITE,
  // Media can appear anywhere.
  media: SITE,

  about: ['/', '/about'],
  'music-page': ['/', '/music'],
  'privacy-policy': ['/privacy'],

  'upcoming-shows': ['/'],
  'music-releases': ['/', '/music'],
  testimonials: ['/'],
  'legacy-milestones': ['/about'],
  'experiences-services': ['/about'],
}

/**
 * Marks the pages that show this content as stale; each rebuilds on its
 * next visit. `next/cache` is loaded only here, not at the top of the file:
 * the Payload CLI (migrations, type generation, the seed) loads this config
 * outside Next.js, where that import can't resolve. There, and anywhere
 * else outside a Next.js request, there is no cache to clear; that is ignored.
 */
async function refresh(slug: string) {
  const pages = PAGES[slug] ?? SITE
  try {
    const { revalidatePath } = await import('next/cache')
    if (pages === SITE) revalidatePath('/', 'layout')
    else for (const path of pages) revalidatePath(path)
  } catch {
    // Not running inside Next.js: nothing to refresh.
  }
}

/** Collections whose documents never appear on the site. */
const PRIVATE = new Set(['users', 'contact-submissions'])

/** Adds "refresh the affected pages after a save or delete" to a collection. */
export function withSiteRefresh(collection: CollectionConfig): CollectionConfig {
  if (PRIVATE.has(collection.slug)) return collection
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [
        ...(collection.hooks?.afterChange ?? []),
        async ({ doc }) => {
          await refresh(collection.slug)
          return doc
        },
      ],
      afterDelete: [
        ...(collection.hooks?.afterDelete ?? []),
        async ({ doc }) => {
          await refresh(collection.slug)
          return doc
        },
      ],
    },
  }
}

/** Adds "refresh the affected pages after a save" to a global. */
export function withGlobalSiteRefresh(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    hooks: {
      ...global.hooks,
      afterChange: [
        ...(global.hooks?.afterChange ?? []),
        async ({ doc }) => {
          await refresh(global.slug)
          return doc
        },
      ],
    },
  }
}
