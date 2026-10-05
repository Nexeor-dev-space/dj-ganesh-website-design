import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

const configDir = path.dirname(fileURLToPath(import.meta.url))

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

export default buildConfig({
  // Required by Payload to encrypt tokens and sessions.
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',

  // PostgreSQL database adapter.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
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
    },
    meta: {
      titleSuffix: '– DJ Ganesh CMS',
    },
  },

  // Register all content collections.
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
  ],

  // Register all globals.
  globals: [
    SiteSettings,
    Navigation,
    HomePage,
    ContactBooking,
    About,
    MusicPage,
  ],

  // TypeScript types output file.
  typescript: {
    outputFile: './payload-types.ts',
  },
})
