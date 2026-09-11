import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

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

// Globals
import SiteSettings from './src/globals/SiteSettings.ts'
import Navigation from './src/globals/Navigation.ts'
import HomePage from './src/globals/HomePage.ts'
import ContactBooking from './src/globals/ContactBooking.ts'

export default buildConfig({
  // Required by Payload to encrypt tokens and sessions.
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',

  // PostgreSQL database adapter.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: true,
  }),

  // Admin panel configuration.
  admin: {
    // The collection used for admin authentication.
    user: 'users',
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
  ],

  // Register all globals.
  globals: [
    SiteSettings,
    Navigation,
    HomePage,
    ContactBooking,
  ],

  // TypeScript types output file.
  typescript: {
    outputFile: './payload-types.ts',
  },
})
