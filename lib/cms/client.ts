import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

/** One Payload Local API instance per request. */
export const getCms = cache(async () => getPayload({ config }))
