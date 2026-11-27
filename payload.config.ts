import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

// Uploads arrive as temp files (upload.useTempFiles). sharp's cache keeps the
// file it read open, and on Windows Payload then can't write the processed
// image back to it ("UNKNOWN: unknown error, open"). No cache, no open handle.
sharp.cache(false)

const configDir = path.dirname(fileURLToPath(import.meta.url))

// Media uploads live in MinIO: bucket MINIO_BUCKET, folder assets/media/.
// The files already there were copied from public/media with the same names,
// so existing rows (no stored prefix) and new uploads share one folder, and
// every URL is built from NEXT_PUBLIC_MEDIA_BASE_URL (MinIO now, a CDN later).
// Without MINIO_ENDPOINT/MINIO_BUCKET (local dev) Payload keeps using
// public/media on disk.
const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').trim().replace(/\/+$/, '')
const objectStorageEnabled = Boolean(process.env.MINIO_ENDPOINT && process.env.MINIO_BUCKET && MEDIA_BASE_URL)

// Collections
import Users from './src/collections/Users.ts'
import Media from './src/collections/Media.ts'
import UpcomingShows from './src/collections/UpcomingShows.ts'
import MusicReleases from './src/collections/MusicReleases.ts'
import PerformanceHistory from './src/collections/PerformanceHistory.ts'
import Gallery from './src/collections/Gallery.ts'
import LegacyMilestones from './src/collections/LegacyMilestones.ts'
import Testimonials from './src/collections/Testimonials.ts'
import ExperiencesServices from './src/collections/ExperiencesServices.ts'
import ContactSubmissions from './src/collections/ContactSubmissions.ts'

// Globals
import SiteSettings from './src/globals/SiteSettings.ts'
import Navigation from './src/globals/Navigation.ts'
import HomePage from './src/globals/HomePage.ts'
import ContactBooking from './src/globals/ContactBooking.ts'
import About from './src/globals/About.ts'
import MusicPage from './src/globals/MusicPage.ts'
import PrivacyPolicy from './src/globals/PrivacyPolicy.ts'
import { withGlobalSiteRefresh, withSiteRefresh } from './src/hooks/revalidateSite.ts'
import { removeUploadTempFiles, startUploadTempSweep, UPLOAD_TEMP_DIR } from './src/hooks/uploadTempFiles.ts'
import { handlePoolErrors } from './src/hooks/poolErrors.ts'
import { withGlobalGuideLink, withGuideLink } from './src/admin/guide/withGuideLink.ts'

// Email
import { bookingEmailAdapter } from './src/email/adapter.ts'

export default buildConfig({
  // Email adapter for transactional notifications (e.g. contact enquiries)
  email: bookingEmailAdapter,

  // Required by Payload to encrypt tokens and sessions.
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',

  // PostgreSQL database adapter.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      // The database link drops for a moment now and then (ECONNREFUSED). Keep
      // connections open and alive between requests, so fewer new ones have to
      // be opened during a drop, and give a slow connect time to finish.
      connectionTimeoutMillis: 15_000,
      keepAlive: true,
      // The server closes a session left idle for 5 minutes (idle_session_timeout).
      // Close pooled connections before that, or the pool hands out one the
      // server has already ended and the query fails.
      idleTimeoutMillis: 4 * 60_000,
      // The server ends a transaction left idle for 10s (25P03). Payload keeps
      // one open while it sends an upload to MinIO, so a large file took
      // longer than that and failed with a 500. This raises the limit for the
      // app's own connections only (a startup parameter; no server change).
      idle_in_transaction_session_timeout: 10 * 60_000,
    },
    // Dev auto-syncs the schema (push), but only against a local database.
    // Remote DBs (preview/production) must use the committed migrations in
    // ./src/migrations instead (run via `payload migrate`).
    push:
      process.env.NODE_ENV !== 'production' &&
      /@(localhost|127\.0\.0\.1)(:|\/)/.test(process.env.DATABASE_URL || ''),
    migrationDir: path.resolve(configDir, 'src/migrations'),
  }),

  // Admin panel configuration.
  admin: {
    // The collection used for admin authentication.
    user: 'users',
    components: {
      beforeDashboard: ['/src/admin/Dashboard#default'],
      // The Admin Guide: a page at /admin/guide, linked at the top of the
      // side menu and from the Help button on every screen (withGuideLink).
      beforeNavLinks: ['/src/admin/guide/GuideNavLink#default'],
      views: {
        guide: {
          Component: '/src/admin/guide/GuideView#default',
          path: '/guide',
          meta: { title: 'Admin Guide' },
        },
      },
    },
    meta: {
      titleSuffix: '– DJ Ganesh CMS',
    },
  },

  // Register all content collections.
  // Every save or delete refreshes the public site, so edits show on the
  // next page load instead of after the 60-second refresh.
  collections: [
    Users,
    Media,
    UpcomingShows,
    MusicReleases,
    PerformanceHistory,
    Gallery,
    LegacyMilestones,
    Testimonials,
    ExperiencesServices,
    ContactSubmissions,
  ]
    .map(withSiteRefresh)
    .map(withGuideLink),

  // Register all globals.
  globals: [
    SiteSettings,
    Navigation,
    HomePage,
    ContactBooking,
    About,
    MusicPage,
    PrivacyPolicy,
  ]
    .map(withGlobalSiteRefresh)
    .map(withGlobalGuideLink),

  // Generates the Media image sizes (thumbnail, card, hero) on upload.
  sharp,

  // Uploads stream to a temp file while they arrive, not into memory, so slow
  // or parallel uploads don't pile up in RAM. Saving still reads an audio or
  // video file into memory once, and the MinIO step buffers up to a couple of
  // 50 MB parts. 120 MB cap (see README "Upload size" for what is tested);
  // anything larger is refused with 413 instead of being cut short.
  upload: {
    limits: { fileSize: 120 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: UPLOAD_TEMP_DIR,
  },

  // Payload removes a temp file only after a successful save; these clean up
  // after failed uploads and anything left behind (src/hooks/uploadTempFiles.ts).
  hooks: {
    afterError: [removeUploadTempFiles],
  },
  onInit: async (payload) => {
    startUploadTempSweep()
    handlePoolErrors(payload)
  },

  plugins: [
    s3Storage({
      enabled: objectStorageEnabled,
      // Keep the plugin's `prefix` column in the schema even when it is off,
      // so local dev and the servers share one schema and one migration set.
      alwaysInsertFields: true,
      bucket: process.env.MINIO_BUCKET || '',
      collections: {
        media: {
          prefix: 'assets/media',
          generateFileURL: ({ filename }) => `${MEDIA_BASE_URL}/media/${encodeURIComponent(filename)}`,
        },
      },
      config: {
        endpoint: process.env.MINIO_ENDPOINT,
        region: process.env.MINIO_REGION || 'us-east-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY || '',
          secretAccessKey: process.env.MINIO_SECRET_KEY || '',
        },
      },
    }),
  ],

  // TypeScript types output file.
  typescript: {
    outputFile: './payload-types.ts',
  },
})
