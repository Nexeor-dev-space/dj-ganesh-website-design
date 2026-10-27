import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * One Payload Local API instance per request.
 *
 * Without a database there is nothing to read, so this fails fast instead of
 * letting Payload try to connect: that attempt rejects somewhere the queries
 * cannot catch it, and every page then logs an unhandled rejection. Failing
 * here lands in the queries' own catch, and the pages fall back to the
 * built-in content as they already do for any CMS error.
 */
export const getCms = cache(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set; using built-in content.')
  }
  return getPayload({ config })
})
