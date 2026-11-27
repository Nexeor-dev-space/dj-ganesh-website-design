/**
 * The temporary admin user and the sample enquiry the Admin Guide
 * screenshots need (see capture.ts). Both are clearly labelled, and
 * `removeFixtures` deletes them again, so nothing real is shown or left
 * behind.
 */
import { randomBytes } from 'node:crypto'
import type { Payload } from 'payload'

export const GUIDE_USER_EMAIL = 'admin-guide-screenshots@example.com'
export const SAMPLE_ENQUIRY_EMAIL = 'sample.enquiry@example.com'

export type Fixtures = { email: string; password: string; userId: number | string; enquiryId: number | string }

export async function bootPayload(): Promise<Payload> {
  // The sample enquiry must never send a real booking notification.
  delete process.env.BOOKING_NOTIFICATION_EMAIL
  const { getPayload } = await import('payload')
  const config = (await import('../../payload.config.ts')).default
  return getPayload({ config })
}

export async function createFixtures(payload: Payload): Promise<Fixtures> {
  // A leftover from a run that was killed before it could clean up.
  await removeFixtures(payload)

  const password = randomBytes(18).toString('base64url')
  const user = await payload.create({
    collection: 'users',
    data: { email: GUIDE_USER_EMAIL, password, name: 'Admin Guide (temporary)' } as never,
    overrideAccess: true,
  })
  const enquiry = await payload.create({
    collection: 'contact-submissions',
    data: {
      name: 'Sample Enquiry',
      email: SAMPLE_ENQUIRY_EMAIL,
      phone: '+00 0000 000000',
      organisation: 'Sample Event Co.',
      eventType: 'Wedding',
      eventDate: '2027-02-14',
      location: 'Sample City',
      audience: '300 guests',
      budget: 'Sample budget',
      message: 'This is a sample enquiry used for the Admin Guide screenshots. It is deleted straight after.',
      status: 'new',
    } as never,
    overrideAccess: true,
  })
  return { email: GUIDE_USER_EMAIL, password, userId: user.id, enquiryId: enquiry.id }
}

export async function removeFixtures(payload: Payload): Promise<void> {
  await payload.delete({ collection: 'users', where: { email: { equals: GUIDE_USER_EMAIL } }, overrideAccess: true })
  await payload.delete({
    collection: 'contact-submissions',
    where: { email: { equals: SAMPLE_ENQUIRY_EMAIL } },
    overrideAccess: true,
  })
}
