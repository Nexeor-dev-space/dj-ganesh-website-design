/**
 * Idempotent CMS seed. Populates every global + collection from the current
 * hardcoded content in data/ and lib/. Safe to run repeatedly.
 *
 * Run (native Node ESM + type stripping):
 *   NODE_OPTIONS="--experimental-strip-types --no-warnings" DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dj_ganesh_cms PAYLOAD_SECRET=local-dev-secret-change-me node scripts/seed.ts
 */
import path from 'node:path'
import fs from 'node:fs'



import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
// data/ + lib/ files import via the tsconfig "@/" alias (extensionless) - resolve that natively.
const rootUrl = pathToFileURL(process.cwd() + '/').href
register('data:text/javascript,' + encodeURIComponent('export async function resolve(s,c,n){if(s.startsWith("@/"))return n("' + rootUrl + '"+s.slice(2)+".ts");return n(s,c)}'))
const ld = (f: string) => import(f)
const { siteConfig, navLinks, socialLinks } = await ld('../lib/site.ts')
const { statement, statementLabel } = await ld('../data/statement.ts')
const { stageRows, stagesSectionLabel, stagesHeading, stagesLede, stagesCtaHref, stagesCtaLabel } = await ld('../lib/stages.ts')
const { trustedNames, trustedLabel } = await ld('../data/trusted.ts')
const { galleryItems, gallerySectionLabel } = await ld('../data/gallery.ts')
const { followHeading, followLinks } = await ld('../data/follow.ts')
const { experienceSectionLabel, experienceHeading, experienceCtaHref, offerings } = await ld('../data/experience.ts')
const { tourCities, tourShows } = await ld('../lib/tour.ts')
const { tracks, musicSectionLabel, musicHeading, allReleasesUrl } = await ld('../data/tracks.ts')
const { musicPageTitle, musicPageStatement, musicPageLabels } = await ld('../data/music-page.ts')
const {
  aboutPageLabels,
  aboutStatement,
  aboutParagraphs,
  aboutFrames,
  experienceHref,
  bookingHref: aboutBookingHref,
  aboutOutro,
} = await ld('../data/about-page.ts')
const {
  aboutSectionLabel,
  aboutHeading,
  careerStart,
  soundStrands,
  careerStats,
  aboutPortrait,
  aboutCta,
} = await ld('../lib/about.ts')
const { milestones, legacySectionLabel, legacyHeading } = await ld('../lib/legacy.ts')
const { testimonials, testimonialsSectionLabel, testimonialsHeading } = await ld('../lib/testimonials.ts')
const {
  bookingSectionLabel,
  bookingHeading,
  bookingLede,
  bookingScope,
  bookingLinks,
  bookingCta,
  bookingEmail,
  whatsappLabel,
  whatsappMessage,
} = await ld('../data/booking.ts')
const { contactMeta, enquiryMeta, bookingInfo, finalCta } = await ld('../data/contact.ts')
const { call } = await ld('../data/call.ts')
const {
  footerColumns,
  footerSocialLinks,
  footerStatement,
  footerCopyright,
  footerContactEmail,
} = await ld('../data/footer.ts')

const ROOT = process.cwd()
const pub = (p: string) => path.join(ROOT, 'public', p.replace(/^\//, ''))
const lines = (a: readonly string[]) => a.map((line) => ({ line }))
// Text-only mode: skip ALL media uploads/references so upload fields stay empty
// and the frontend falls back to the committed /images and /videos files.
// Used to seed environments (e.g. staging) whose media disk we can't populate.
const TEXT_ONLY = process.env.SEED_TEXT_ONLY === '1'

async function main() {
const { getPayload } = await import('payload')
const config = (await import('../payload.config.ts')).default as any
const payload = await getPayload({ config })
const counts: Record<string, number> = {}

// ---------- Media ----------
const mediaIds: Record<string, number | string> = {}
const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' }

async function media(src: string, alt: string): Promise<number | string | undefined> {
  if (TEXT_ONLY) return undefined
  const filename = path.basename(src)
  if (mediaIds[src]) return mediaIds[src]
  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (found.docs[0]) return (mediaIds[src] = found.docs[0].id)
  const data = fs.readFileSync(pub(src))
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, name: filename, mimetype: MIME[path.extname(filename).toLowerCase()], size: data.length },
  })
  console.log('uploaded media:', filename)
  return (mediaIds[src] = doc.id)
}

async function upsert(collection: string, where: any, data: any) {
  const found = await payload.find({ collection: collection as any, where, limit: 1, depth: 0, draft: true })
  if (found.docs[0]) {
    return payload.update({ collection: collection as any, id: found.docs[0].id, data, depth: 0 })
  }
  return payload.create({ collection: collection as any, data, depth: 0 })
}

// Upload all media referenced by code
const heroVideo = await media('/videos/dj-ganesh.mp4', siteConfig.name)
const aboutStage = await media(aboutFrames.stage.src, aboutFrames.stage.alt)
const aboutPortraitFrame = await media(aboutFrames.portrait.src, aboutFrames.portrait.alt)
const aboutDecks = await media(aboutFrames.decks.src, aboutFrames.decks.alt)
const aboutPortraitId = await media(aboutPortrait.src, aboutPortrait.alt)
const galleryMedia: (number | string)[] = []
for (const gi of galleryItems) galleryMedia.push(await media(gi.src, gi.alt))
const artworkIds: (number | string)[] = []
for (const t of tracks) artworkIds.push(await media(t.artwork!, t.title))
for (const w of ['wedding', 'club', 'concert', 'beach', 'corporate', 'cdj']) {
  await media(`/images/wall/gallery-${w}.png`, `Wall image - ${w}`)
}

// ---------- Collections ----------
const genreMap: Record<string, string> = {
  'Indo Tech': 'indo-tech',
  'Afro House': 'afro-house',
  'Afro Mashup': 'afro-mashup',
  BollyAfro: 'bollyafro',
}

const trackDocs: any[] = []
for (const [i, t] of tracks.entries()) {
  trackDocs.push(
    await upsert(
      'music-releases',
      { title: { equals: t.title } },
      {
        title: t.title,
        genre: genreMap[t.tag] ?? 'other',
        artist: t.artist,
        artwork: artworkIds[i],
        youtubeUrl: `https://www.youtube.com/watch?v=${t.youtubeId}`,
        audioUrl: t.audio,
        featured: true,
        publishedStatus: true,
        order: i,
        _status: 'published',
      },
    ),
  )
}

const monthIdx: Record<string, string> = { Jul: '07' }
const countryOf: Record<string, string> = {
  Mumbai: 'India',
  Hyderabad: 'India',
  Bengaluru: 'India',
  Goa: 'India',
  Dubai: 'United Arab Emirates',
  London: 'United Kingdom',
  Nairobi: 'Kenya',
  'New York': 'United States',
  Singapore: 'Singapore',
}
const showDocs: any[] = []
for (const [i, s] of tourShows.entries()) {
  showDocs.push(
    await upsert(
      'upcoming-shows',
      { title: { equals: s.venue } },
      {
        title: s.venue,
        date: `2026-${monthIdx[s.month]}-${s.day.padStart(2, '0')}T00:00:00.000Z`,
        city: s.city,
        country: countryOf[s.city],
        venue: s.venue,
        ticketUrl: s.ticketsUrl,
        showStatus: 'upcoming',
        order: i,
        _status: 'published',
      },
    ),
  )
}

const milestoneDocs: Record<string, any> = {}
for (const [i, m] of milestones.entries()) {
  milestoneDocs[m.id] = await upsert(
    'legacy-milestones',
    { slug: { equals: m.id } },
    {
      slug: m.id,
      year: Number(m.year),
      title: m.title,
      description: m.lede,
      more: m.more,
      order: i,
      publishedStatus: true,
      _status: 'published',
    },
  )
}

for (const [i, t] of testimonials.entries()) {
  await upsert(
    'testimonials',
    { testimonial: { equals: t.quote } },
    {
      name: t.author,
      testimonial: t.quote,
      location: t.location,
      order: i,
      publishedStatus: true,
      _status: 'published',
    },
  )
}

for (const [i, o] of offerings.entries()) {
  await upsert(
    'experiences-services',
    { title: { equals: o.title } },
    {
      title: o.title,
      shortDescription: o.summary,
      features: o.points.map((feature) => ({ feature })),
      ctaText: o.cta,
      order: i,
      publishedStatus: true,
      _status: 'published',
    },
  )
}

// ---------- Gallery album (requires images; skipped in text-only mode) ----------
if (!TEXT_ONLY) {
  await upsert(
    'gallery',
    { title: { equals: 'Live Sets' } },
    {
      title: 'Live Sets',
      album: 'Live Sets',
      images: galleryItems.map((it: any, i: number) => ({ image: galleryMedia[i], caption: it.alt })),
      order: 0,
      publishedStatus: true,
      _status: 'published',
    },
  )
}

// ---------- Performance history (real tour data) ----------
const perfImg = [artworkIds[1], artworkIds[0], galleryMedia[3], artworkIds[3]]
const perfCategory: Record<string, string> = { India: 'india', 'United Kingdom': 'europe' }
for (const [i, s] of tourShows.entries()) {
  await upsert(
    'performance-history',
    { and: [{ venue: { equals: s.venue } }, { city: { equals: s.city } }] },
    {
      venue: s.venue,
      city: s.city,
      country: countryOf[s.city],
      year: 2026,
      category: perfCategory[countryOf[s.city]] ?? 'other',
      description: `${s.venue}, ${s.city} — Global World Tour 2026`,
      image: perfImg[i],
      order: i,
    },
  )
}

// ---------- Placeholder images on existing docs (client's own images) ----------
if (!TEXT_ONLY) {
const wall = (n: string) => mediaIds[`/images/wall/gallery-${n}.png`]
const milestoneImg: Record<string, any> = {
  taj: wall('wedding'),
  ambani: wall('corporate'),
  'karan-johar': wall('concert'),
  'a-list': wall('club'),
  'world-tour': artworkIds[1],
  origin: wall('cdj'),
}
for (const m of milestones) {
  await upsert('legacy-milestones', { slug: { equals: m.id } }, { image: milestoneImg[m.id] })
}
const testimonialImg = [wall('club'), wall('beach'), wall('wedding')]
for (const [i, t] of testimonials.entries()) {
  await upsert('testimonials', { testimonial: { equals: t.quote } }, { image: testimonialImg[i] })
}
const offeringImg = [wall('wedding'), artworkIds[2], aboutDecks]
for (const [i, o] of offerings.entries()) {
  await upsert('experiences-services', { title: { equals: o.title } }, { image: offeringImg[i] })
}
}

// ---------- Globals ----------
const g = (slug: string, data: any) => payload.updateGlobal({ slug: slug as any, data, depth: 0 })

await g('site-settings', {
  siteName: siteConfig.name,
  seo: { defaultSeoTitle: siteConfig.title, defaultSeoDescription: siteConfig.description },
  socialLinks: socialLinks.map((s) => ({ platform: s.icon, url: s.href })),
  contact: { contactEmail: footerContactEmail },
  footer: {
    columns: footerColumns.map((c) => ({
      title: c.label,
      links: c.links.map((l: any) => ({ label: l.label, href: l.href, external: !!l.external })),
    })),
    statement: footerStatement,
    copyright: footerCopyright,
    contactEmail: footerContactEmail,
  },
})

await g('navigation', {
  items: navLinks.map((n, i) => ({ label: n.label, url: n.href, isExternal: false, order: i, visible: true })),
})

await g('home-page', {
  hero: { heroVideo },
  globalReach: {
    locations: tourCities.map((c) => ({
      city: c.name,
      country: countryOf[c.name],
      lat: c.lat,
      lng: c.lng,
      labelDx: c.labelDx,
      labelDy: c.labelDy,
      hub: !!c.hub,
    })),
  },
  featuredShows: { shows: showDocs.map((d) => d.id) },
  featuredMusic: { tracks: trackDocs.map((d) => d.id) },
  statementPlate: {
    label: statementLabel,
    lines: lines(statement.lines),
    spoken: statement.spoken,
    name: statement.name,
    note: statement.note,
  },
  stages: {
    label: stagesSectionLabel,
    heading: lines(stagesHeading),
    lede: stagesLede,
    ctaLabel: stagesCtaLabel,
    ctaHref: stagesCtaHref,
    stages: stageRows.flat().map((s) => ({ name: s.name, featured: !!s.featured })),
  },
  trustedBy: { label: trustedLabel, names: trustedNames.map((name) => ({ name })) },
  galleryStrip: {
    label: gallerySectionLabel,
    items: galleryItems.map((it, i) => ({ image: galleryMedia[i], alt: it.alt, href: it.href })),
  },
  follow: {
    heading: followHeading,
    links: followLinks.map((l: any) => ({
      label: l.label,
      caption: l.caption,
      href: l.href,
      icon: l.icon,
      external: !!l.external,
    })),
  },
  bookingSection: {
    label: bookingSectionLabel,
    heading: lines(bookingHeading),
    lede: bookingLede,
    scope: bookingScope.map((item) => ({ item })),
    links: bookingLinks.map((l: any) => ({
      label: l.label,
      value: l.value,
      href: l.href,
      external: !!l.external,
    })),
  },
  legacySection: { label: legacySectionLabel, heading: lines(legacyHeading) },
  testimonialsSection: { label: testimonialsSectionLabel, heading: lines(testimonialsHeading) },
  experienceSection: { label: experienceSectionLabel, heading: lines(experienceHeading), ctaHref: experienceCtaHref },
})

await g('about', {
  labels: { ...aboutPageLabels, sectionLabel: aboutSectionLabel },
  story: {
    heading: lines(aboutHeading),
    statement: aboutStatement,
    paragraphs: aboutParagraphs.map((paragraph) => ({ paragraph })),
    careerStart,
  },
  soundStrands: soundStrands.map((strand) => ({ strand })),
  frames: { stage: aboutStage, portrait: aboutPortraitFrame, decks: aboutDecks },
  portrait: aboutPortraitId,
  careerStats: {
    stats: careerStats.map((s) => ({ value: String(s.value), suffix: s.suffix, label: s.label })),
  },
  experiencePreview: {
    milestones: ['origin', 'taj', 'world-tour'].map((id) => milestoneDocs[id].id),
    experienceHref,
    bookingHref: aboutBookingHref,
  },
  outro: { question: aboutOutro.question, cta: aboutOutro.cta },
  cta: { label: aboutCta.label, href: aboutCta.href },
})

await g('music-page', {
  pageTitle: musicPageTitle,
  statement: musicPageStatement,
  labels: { ...musicPageLabels },
  homeSection: { sectionLabel: musicSectionLabel, heading: musicHeading, allReleasesUrl },
})

await g('contact-booking', {
  bookingEmail,
  enquiryEmail: bookingEmail,
  agency: { agencyName: 'BMT Agency', agencyWebsite: 'https://www.bmtagency.in' },
  socialLinks: footerSocialLinks.filter((s) => s.icon !== 'email').map((s) => ({ platform: s.icon, url: s.href })),
  bookingCtaText: bookingCta.label,
  // The site-wide Book CTA (used by the Navbar) historically points at /contact
  // (lib/site.ts `bookingHref`). Keep that exact target so the header link is
  // unchanged; the mailto lives on the booking section's own CTA, not here.
  bookingCtaUrl: '/contact',
  whatsapp: { whatsappLabel, whatsappMessage },
  contactMeta: { eyebrow: contactMeta.eyebrow, heading: lines(contactMeta.heading), lede: contactMeta.lede },
  enquiry: { ...enquiryMeta },
  bookingInfoBlock: { heading: bookingInfo.heading, copy: bookingInfo.copy },
  finalCta: { heading: lines(finalCta.heading), lede: finalCta.lede, label: finalCta.label, href: finalCta.href },
  callBand: {
    heading: lines(call.heading),
    lede: call.lede,
    ctaLabel: call.ctaLabel,
    agencies: call.agencies.map((name) => ({ name })),
  },
})

for (const c of [
  'media',
  'music-releases',
  'upcoming-shows',
  'legacy-milestones',
  'testimonials',
  'experiences-services',
  'performance-history',
  'gallery',
]) {
  counts[c] = (await payload.count({ collection: c as any, draft: true })).totalDocs
}
console.log('counts:', JSON.stringify(counts))
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
