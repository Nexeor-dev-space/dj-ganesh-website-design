import { APIError, type CollectionConfig, type PayloadRequest } from 'payload'
import { formatEnquiryEmail } from '../email/enquiryNotification.ts'

function getClientIp(req: PayloadRequest): string {
  if (req.headers && typeof req.headers.get === 'function') {
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    const realIp = req.headers.get('x-real-ip')
    if (realIp) return realIp.trim()
    const cfIp = req.headers.get('cf-connecting-ip')
    if (cfIp) return cfIp.trim()
  }
  return 'unknown'
}

// In-memory sliding window rate limiter for public contact submissions
const ipSubmissionTimestamps = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  if (!ip || ip === 'unknown') return true
  const now = Date.now()
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000 // 10 minutes default
  const maxSubmissions = Number(process.env.RATE_LIMIT_MAX_SUBMISSIONS) || 5 // 5 submissions per window

  const timestamps = (ipSubmissionTimestamps.get(ip) || []).filter(
    (t) => now - t < windowMs,
  )

  if (timestamps.length >= maxSubmissions) {
    return false
  }

  timestamps.push(now)
  ipSubmissionTimestamps.set(ip, timestamps)

  // Periodic cleanup of expired entries
  if (ipSubmissionTimestamps.size > 500) {
    for (const [key, times] of ipSubmissionTimestamps.entries()) {
      const valid = times.filter((t) => now - t < windowMs)
      if (valid.length === 0) ipSubmissionTimestamps.delete(key)
      else ipSubmissionTimestamps.set(key, valid)
    }
  }

  return true
}

/**
 * Contact / booking enquiries submitted from the public contact page.
 *
 * Admin-read-only: the public site may CREATE a submission (the enquiry form
 * POSTs here) but only authenticated admins can read, update or delete them.
 */
const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
  admin: {
    group: 'Submissions',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'email',
      'eventType',
      'eventDate',
      'location',
      'organisation',
      'audience',
      'budget',
      'status',
      'createdAt',
    ],
    description: 'Booking / contact enquiries submitted from the public site.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        // Enforce rate limiting on unauthenticated submissions
        if (operation === 'create' && !req.user) {
          const ip = getClientIp(req)
          if (!checkRateLimit(ip)) {
            req.payload.logger.warn(
              `[Rate Limiting] Blocked excessive submission from IP: ${ip}`,
            )
            throw new APIError(
              'Too many submissions. Please wait a few minutes before trying again.',
              429,
            )
          }
        }
      },
    ],
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          // Reject submissions containing a non-empty honeypot value
          if (data?.honeypot && String(data.honeypot).trim().length > 0) {
            const ip = getClientIp(req)
            req.payload.logger.warn(
              `[Spam Protection] Honeypot triggered from IP ${ip}: honeypot="${data.honeypot}"`,
            )
            throw new APIError('Invalid submission.', 400)
          }

          // Strip honeypot field so it does not persist in the database
          if (data && 'honeypot' in data) {
            delete data.honeypot
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Trigger email notification only on creation, avoiding duplicates on updates
        if (operation !== 'create') {
          return
        }

        const bookingInbox = process.env.BOOKING_NOTIFICATION_EMAIL

        if (!bookingInbox) {
          req.payload.logger.warn(
            `[Enquiry Notification] Skipped email delivery for enquiry #${doc.id}: BOOKING_NOTIFICATION_EMAIL is not configured in environment variables.`,
          )
          return
        }

        try {
          const emailContent = formatEnquiryEmail(doc)

          await req.payload.sendEmail({
            to: bookingInbox,
            replyTo: doc.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
            attachments: emailContent.attachments,
          })

          req.payload.logger.info(
            `[Enquiry Notification] Email delivered to ${bookingInbox} for enquiry #${doc.id} from ${doc.email}`,
          )
        } catch (err: unknown) {
          req.payload.logger.error(
            `[Enquiry Notification] Failed to deliver email for enquiry #${doc.id}: ${err instanceof Error ? err.message : String(err)}`,
          )
          // Keep database submission saved even if notification fails
        }
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    {
      name: 'organisation',
      label: 'Event / Organisation',
      type: 'text',
      admin: { description: 'Venue, company or event host.' },
    },
    {
      name: 'eventType',
      label: 'Event Type / Subject',
      type: 'text',
      admin: { description: 'e.g. Wedding, Festival, Corporate Event.' },
    },
    {
      name: 'eventDate',
      label: 'Event Date',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Scheduled date of the event.',
      },
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      admin: { description: 'City, Country or Venue location.' },
    },
    {
      name: 'audience',
      label: 'Expected Audience',
      type: 'text',
      admin: { description: 'Estimated guest count or venue capacity.' },
    },
    {
      name: 'budget',
      label: 'Budget / Fee Range',
      type: 'text',
      admin: { description: 'Budget indication or fee range.' },
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Responded', value: 'responded' },
      ],
    },
    {
      name: 'honeypot',
      label: 'Honeypot',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
}

export default ContactSubmissions
