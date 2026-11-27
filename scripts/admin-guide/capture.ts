/**
 * Takes the screenshots for the Admin Guide (/admin/guide) from the real CMS
 * and website, and saves them to public/admin-guide/<id>.jpg.
 *
 *   1. Start the site:            npm run dev
 *   2. In a second terminal:      npm run guide:screenshots
 *      (one shot only:            npm run guide:screenshots -- home-hero)
 *
 * It creates a temporary admin user and one clearly fake "Sample Enquiry",
 * logs in with a local Chrome or Edge, and deletes both again when it
 * finishes, even if a shot fails. Real enquiries never appear in a shot.
 *
 * GUIDE_BASE_URL (default http://localhost:3000) points it at another
 * running copy of the site; GUIDE_BROWSER picks the browser
 * (chrome, msedge, or a path to its executable).
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium, type Browser, type BrowserContext, type Locator, type Page } from 'playwright-core'

import { bootPayload, createFixtures, removeFixtures, SAMPLE_ENQUIRY_EMAIL, type Fixtures } from './fixtures.ts'

const BASE = (process.env.GUIDE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '')
const OUT = path.join(process.cwd(), 'public', 'admin-guide')
const VIEWPORT = { width: 1280, height: 800 }

/** A box drawn round part of the screen, with an optional number badge. */
type Mark = { at: (p: Page) => Locator; n?: number }

type ShotDef = {
  id: string
  /** Logged in to the CMS (default), or a visitor on the public site. */
  as?: 'admin' | 'visitor'
  url: string | ((f: Fixtures) => string)
  /** Clicks, typing or scrolling before the shot. */
  prepare?: (p: Page) => Promise<void>
  marks?: Mark[]
  /** Scroll this into the middle of the screen first (default: the first mark). */
  focus?: (p: Page) => Locator
  /** Shoot the whole length of the marked area instead of one screen. */
  tall?: boolean
}

const field = (id: string) => (p: Page) => p.locator(`#field-${id}`).first()
const checkbox = (id: string) => (p: Page) => p.locator('.field-type.checkbox').filter({ has: p.locator(`#field-${id}`) }).first()
const publishButton = (p: Page) => p.locator('#action-save').first()
const saveDraftButton = (p: Page) => p.locator('#action-save-draft').first()
const helpButton = (p: Page) => p.locator('.doc-controls .admin-guide-help').first()

/** Opens the first item of a list. */
const openFirst = (list: string) => async (p: Page) => {
  await p.goto(`${BASE}/admin/collections/${list}`, { waitUntil: 'networkidle' })
  await p.locator('table tbody tr td a').first().click()
  await p.waitForLoadState('networkidle')
  await p.locator('.doc-controls').first().waitFor()
}

/**
 * Waits until the Dashboard's enquiry list has loaded the sample enquiry,
 * then removes any other enquiry link as a second safety net. The admin
 * browser is only ever sent the sample (see onlySampleEnquiries), so this
 * should find nothing to remove. If the sample has not loaded in time the
 * shot fails rather than risk saving a half-loaded list.
 */
async function showOnlySampleEnquiry(p: Page) {
  await p
    .locator('a[href*="/collections/contact-submissions/"]', { hasText: 'Sample Enquiry' })
    .first()
    .waitFor({ timeout: 20_000 })
    .catch(() => {
      throw new Error('the Sample Enquiry did not load, so the shot was not saved')
    })
  await p.evaluate(() => {
    document.querySelectorAll('a[href*="/collections/contact-submissions/"]').forEach((a) => {
      if (!a.textContent?.includes('Sample Enquiry')) a.remove()
    })
  })
}

const SHOTS: ShotDef[] = [
  /* Getting started ------------------------------------------------------ */
  {
    id: 'login',
    as: 'visitor',
    url: '/admin/login',
    marks: [
      { at: (p) => p.locator('input[name="email"]').locator('xpath=ancestor::div[contains(@class,"field-type")][1]'), n: 1 },
      { at: (p) => p.locator('input[name="password"]').locator('xpath=ancestor::div[contains(@class,"field-type")][1]'), n: 2 },
      { at: (p) => p.locator('button[type="submit"]'), n: 3 },
    ],
  },
  {
    id: 'dashboard',
    url: '/admin',
    prepare: showOnlySampleEnquiry,
    marks: [
      { at: (p) => p.getByRole('link', { name: 'Edit Home Page' }).first().locator('xpath=..'), n: 1 },
      { at: (p) => p.getByRole('link', { name: /Upcoming shows/ }).first().locator('xpath=..'), n: 2 },
    ],
    focus: (p) => p.getByRole('heading', { name: 'Welcome back' }),
  },
  {
    id: 'sidebar',
    url: '/admin',
    prepare: async (p) => {
      // The Dashboard's enquiry list shows beside the menu.
      await showOnlySampleEnquiry(p)
      // A closed menu is still in the page, only faded out.
      const navOnScreen = () => Boolean(document.querySelector('.nav.nav--nav-open'))
      if (!(await p.evaluate(navOnScreen))) await p.locator('.template-default__nav-toggler').first().click()
      await p.waitForFunction(navOnScreen, undefined, { timeout: 10_000 })
      await p.waitForTimeout(500)
    },
    marks: [{ at: (p) => p.locator('#nav-admin-guide'), n: 1 }],
    focus: (p) => p.locator('body'),
  },
  {
    id: 'help-link',
    url: '/admin/collections/upcoming-shows/create',
    marks: [{ at: helpButton, n: 1 }],
  },

  /* Everyday basics ----------------------------------------------------- */
  {
    id: 'shows-list',
    url: '/admin/collections/upcoming-shows',
    marks: [{ at: (p) => p.locator('.list-create-new-doc__create-new-button').first(), n: 1 }],
  },
  {
    id: 'shows-create',
    url: '/admin/collections/upcoming-shows/create',
    prepare: async (p) => {
      // Typed, never saved: a show only exists once Publish is clicked.
      await p.locator('#field-title').fill('Sample Show: Club Night')
      await p.locator('#field-time').fill('9:00 PM')
      await p.locator('#field-city').fill('London')
      await p.locator('#field-country').fill('United Kingdom')
      await p.locator('#field-venue').fill('Sample Venue')
      await p.locator('#field-title').blur()
    },
    marks: [{ at: saveDraftButton }, { at: publishButton, n: 1 }],
    focus: (p) => p.locator('.doc-header__title').first(),
  },
  {
    id: 'published-toggle',
    url: '/admin/collections/music-releases/create',
    marks: [{ at: checkbox('publishedStatus'), n: 1 }],
  },
  {
    id: 'doc-menu',
    url: '/admin/collections/upcoming-shows',
    prepare: async (p) => {
      await openFirst('upcoming-shows')(p)
      await p.locator('.doc-controls__popup .popup-button').first().click()
      await p.getByRole('button', { name: 'Delete' }).first().waitFor()
    },
    marks: [
      { at: (p) => p.locator('.doc-controls__popup .popup-button').first(), n: 1 },
      { at: (p) => p.getByRole('button', { name: 'Delete' }).first() },
    ],
    focus: (p) => p.locator('.doc-controls').first(),
  },
  {
    id: 'rows',
    url: '/admin/globals/site-settings',
    marks: [{ at: (p) => p.locator('#field-socialLinks').getByRole('button', { name: /^Add / }).first(), n: 1 }],
  },
  {
    id: 'upload-field',
    url: '/admin/collections/upcoming-shows/create',
    marks: [
      { at: field('poster') },
      { at: (p) => p.locator('#field-poster').getByRole('button', { name: 'Choose from existing' }).first(), n: 1 },
    ],
  },

  /* Website pages ------------------------------------------------------- */
  {
    id: 'home-hero',
    url: '/admin/globals/home-page',
    marks: [
      { at: (p) => p.locator('#field-hero__heroHeading').locator('xpath=ancestor::div[contains(@class,"field-type")][1]'), n: 1 },
      { at: publishButton, n: 2 },
    ],
    focus: (p) => p.locator('.doc-header__title').first(),
  },
  {
    id: 'home-hero-video',
    url: '/admin/globals/home-page',
    marks: [
      { at: field('hero__heroVideo'), n: 1 },
      { at: field('hero__heroVideoPoster'), n: 2 },
    ],
  },
  { id: 'about-form', url: '/admin/globals/about' },
  { id: 'music-page-form', url: '/admin/globals/music-page' },
  { id: 'navigation-form', url: '/admin/globals/navigation' },
  { id: 'contact-booking-form', url: '/admin/globals/contact-booking' },

  /* Lists ---------------------------------------------------------------- */
  {
    id: 'music-create',
    url: '/admin/collections/music-releases/create',
    marks: [
      { at: field('audioFile'), n: 1 },
      { at: checkbox('publishedStatus'), n: 2 },
    ],
    tall: true,
  },
  { id: 'gallery-list', url: '/admin/collections/gallery' },
  {
    id: 'testimonial-create',
    url: '/admin/collections/testimonials/create',
    marks: [{ at: checkbox('publishedStatus'), n: 1 }],
  },

  /* Media ---------------------------------------------------------------- */
  {
    id: 'media-create',
    url: '/admin/collections/media/create',
    marks: [
      { at: (p) => p.locator('.dropzone').first(), n: 1 },
      { at: (p) => p.locator('#field-alt').locator('xpath=ancestor::div[contains(@class,"field-type")][1]'), n: 2 },
    ],
    focus: (p) => p.locator('.doc-header__title').first(),
  },
  { id: 'media-list', url: '/admin/collections/media' },

  /* Submissions: the sample enquiry only. ------------------------------ */
  {
    id: 'submissions-list',
    url: '/admin/collections/contact-submissions?where[email][equals]=sample.enquiry%40example.com',
  },
  {
    id: 'submission-detail',
    url: (f) => `/admin/collections/contact-submissions/${f.enquiryId}`,
    marks: [{ at: (p) => p.locator('#field-status').first(), n: 1 }],
  },

  /* Settings ------------------------------------------------------------- */
  { id: 'users-create', url: '/admin/collections/users/create' },

  /* Where it appears on the website ------------------------------------ */
  {
    id: 'site-home',
    as: 'visitor',
    url: '/',
    // The background video comes from the media host: wait for its first frame.
    prepare: (p) =>
      p
        .waitForFunction(() => ((document.querySelector('video.hero-media__video') as HTMLVideoElement | null)?.readyState ?? 0) >= 2, undefined, {
          timeout: 30_000,
        })
        .then(() => p.waitForTimeout(1500))
        .catch(() => console.warn('    (the homepage video did not load in time)')),
  },
  { id: 'site-about', as: 'visitor', url: '/about' },
  { id: 'site-music', as: 'visitor', url: '/music' },
  { id: 'site-shows', as: 'visitor', url: '/', focus: (p) => p.locator('#global-reach') },
  { id: 'site-testimonials', as: 'visitor', url: '/', focus: (p) => p.locator('#testimonials') },
  { id: 'site-contact', as: 'visitor', url: '/contact', focus: (p) => p.locator('#booking') },
  { id: 'site-footer', as: 'visitor', url: '/', focus: (p) => p.locator('#footer') },
]

/* ------------------------------------------------------------------------ */

/** Hides what is not part of the screen being shown: the Next.js dev badge, toasts, the cookie question. */
const CLEAN_CSS = `
  nextjs-portal, [data-nextjs-toast], .payload-toast-container { display: none !important; }
  .cookie-banner { display: none !important; }
  *, *::before, *::after { caret-color: transparent !important; }
`

async function drawMarks(page: Page, marks: Mark[]) {
  const boxes: { x: number; y: number; width: number; height: number; n?: number }[] = []
  for (const m of marks) {
    const box = await m.at(page).boundingBox()
    if (box) boxes.push({ ...box, n: m.n })
    else console.warn('    (a highlight was not found on the page)')
  }
  await page.evaluate((list) => {
    const layer = document.createElement('div')
    layer.id = 'guide-marks'
    layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2147483647'
    for (const b of list) {
      const pad = 6
      const box = document.createElement('div')
      box.style.cssText = `position:absolute;left:${b.x + scrollX - pad}px;top:${b.y + scrollY - pad}px;width:${b.width + pad * 2}px;height:${b.height + pad * 2}px;border:3px solid #ff2d87;border-radius:10px;box-shadow:0 0 0 4px rgba(255,45,135,.25)`
      if (b.n) {
        const badge = document.createElement('div')
        badge.textContent = String(b.n)
        badge.style.cssText = 'position:absolute;top:-16px;left:-16px;width:30px;height:30px;border-radius:50%;background:#ff2d87;color:#fff;font:800 16px/30px system-ui,sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.5)'
        box.appendChild(badge)
      }
      layer.appendChild(box)
    }
    document.body.appendChild(layer)
  }, boxes)
  return boxes
}

async function capture(page: Page, shot: ShotDef, fixtures: Fixtures) {
  const url = typeof shot.url === 'function' ? shot.url(fixtures) : shot.url
  await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.addStyleTag({ content: CLEAN_CSS })
  if (shot.prepare) await shot.prepare(page)

  const focus = shot.focus ?? shot.marks?.[0]?.at
  if (focus) {
    // Tall things line up with the top of the screen, small ones sit in the middle.
    await focus(page).evaluate((el) =>
      el.scrollIntoView({
        block: el.getBoundingClientRect().height > window.innerHeight * 0.6 ? 'start' : 'center',
        behavior: 'instant' as ScrollBehavior,
      }),
    )
  }
  // Let scroll-in animations, lazy images and videos settle.
  await page.waitForTimeout(shot.as === 'visitor' ? 2500 : 700)

  const boxes = shot.marks?.length ? await drawMarks(page, shot.marks) : []
  const file = path.join(OUT, `${shot.id}.jpg`)

  if (shot.tall && boxes.length) {
    const scrollY = await page.evaluate(() => window.scrollY)
    const top = Math.max(0, Math.min(...boxes.map((b) => b.y)) + scrollY - 60)
    const bottom = Math.max(...boxes.map((b) => b.y + b.height)) + scrollY + 60
    await page.screenshot({
      path: file,
      type: 'jpeg',
      quality: 85,
      fullPage: true,
      clip: { x: 0, y: top, width: VIEWPORT.width, height: Math.max(VIEWPORT.height * 0.6, bottom - top) },
    })
  } else {
    await page.screenshot({ path: file, type: 'jpeg', quality: 85 })
  }
}

/**
 * Real enquiries must never reach the screenshot browser. Every request the
 * CMS pages make for contact submissions is narrowed to the sample enquiry
 * on the server, and the reply is filtered again before the page sees it.
 */
async function onlySampleEnquiries(context: BrowserContext) {
  await context.route(
    (url) => url.pathname.replace(/\/+$/, '').startsWith('/api/contact-submissions'),
    async (route) => {
      const url = new URL(route.request().url())
      url.searchParams.set('where[email][equals]', SAMPLE_ENQUIRY_EMAIL)
      const reply = await route.fetch({ url: url.toString() })
      let body: unknown
      try {
        body = await reply.json()
      } catch {
        return route.fulfill({ status: 404, json: { errors: [{ message: 'Hidden from screenshots' }] } })
      }
      const isSample = (d: unknown) => (d as { email?: string } | null)?.email === SAMPLE_ENQUIRY_EMAIL
      const res = body as { docs?: unknown[]; totalDocs?: number; email?: string }
      if (Array.isArray(res.docs)) {
        res.docs = res.docs.filter(isSample)
      } else if ('email' in res && !isSample(res)) {
        return route.fulfill({ status: 404, json: { errors: [{ message: 'Hidden from screenshots' }] } })
      }
      return route.fulfill({ response: reply, json: res })
    },
  )
}

async function launch(): Promise<Browser> {
  const wanted = process.env.GUIDE_BROWSER
  if (wanted && /[\\/]/.test(wanted)) return chromium.launch({ executablePath: wanted })
  for (const channel of wanted ? [wanted] : ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel })
    } catch {
      // Not installed: try the next one.
    }
  }
  throw new Error('No Chrome or Edge found. Set GUIDE_BROWSER to chrome, msedge, or the path to a Chromium browser.')
}

async function main() {
  const only = process.argv.slice(2)
  const shots = only.length ? SHOTS.filter((s) => only.includes(s.id)) : SHOTS
  if (!shots.length) throw new Error(`No shot called ${only.join(', ')}. Shots: ${SHOTS.map((s) => s.id).join(', ')}`)

  fs.mkdirSync(OUT, { recursive: true })
  const payload = await bootPayload()
  let fixtures: Fixtures | null = null
  let browser: Browser | null = null
  const failed: string[] = []

  try {
    fixtures = await createFixtures(payload)
    browser = await launch()
    const common = { viewport: VIEWPORT, reducedMotion: 'reduce' as const }

    const visitor = await browser.newContext(common)
    // Without the MINIO_* keys a local copy of the site serves CMS uploads
    // from public/media, which is empty (the files live in MinIO). Fetch
    // anything that fails locally from MinIO, so the website shots show the
    // same photos and video as the live site.
    const media = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').trim().replace(/\/+$/, '')
    if (media) {
      await visitor.route('**/api/media/file/**', async (route) => {
        const local = await route.fetch().catch(() => null)
        if (local && local.ok()) return route.fulfill({ response: local })
        const name = new URL(route.request().url()).pathname.split('/').pop()
        const remote = await route.fetch({ url: `${media}/media/${name}` })
        return route.fulfill({ response: remote })
      })
    }
    const admin = await browser.newContext(common)
    await onlySampleEnquiries(admin)
    const adminPage = await admin.newPage()
    await adminPage.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle', timeout: 120_000 })
    await adminPage.fill('input[name="email"]', fixtures.email)
    await adminPage.fill('input[name="password"]', fixtures.password)
    await adminPage.click('button[type="submit"]')
    await adminPage.waitForURL(/\/admin\/?$/, { timeout: 120_000 })
    const visitorPage = await visitor.newPage()

    for (const shot of shots) {
      process.stdout.write(`  ${shot.id} … `)
      try {
        await capture(shot.as === 'visitor' ? visitorPage : adminPage, shot, fixtures)
        console.log('done')
      } catch (err) {
        failed.push(shot.id)
        console.log('FAILED: ' + (err instanceof Error ? err.message.split('\n')[0] : String(err)))
      }
    }
  } finally {
    await browser?.close()
    await removeFixtures(payload)
    console.log('Temporary user and sample enquiry removed.')
  }

  console.log(`\nSaved ${shots.length - failed.length} of ${shots.length} screenshots to public/admin-guide/.`)
  if (failed.length) {
    console.log(`Failed: ${failed.join(', ')}. Run again with just those, e.g. npm run guide:screenshots -- ${failed[0]}`)
    process.exitCode = 1
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => process.exit())
