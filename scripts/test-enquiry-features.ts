/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

const rootUrl = pathToFileURL(process.cwd() + '/').href
register(
  'data:text/javascript,' +
    encodeURIComponent(`
      const rootUrl = "${rootUrl}";
      export async function resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@/')) {
          return nextResolve(rootUrl + specifier.slice(2) + '.ts', context);
        }
        try {
          return await nextResolve(specifier, context);
        } catch (err) {
          if (err.code === 'ERR_MODULE_NOT_FOUND' && !specifier.endsWith('.ts') && !specifier.endsWith('.js') && !specifier.endsWith('.json')) {
            try {
              return await nextResolve(specifier + '.ts', context);
            } catch {
              return nextResolve(specifier, context);
            }
          }
          throw err;
        }
      }
    `),
)

import assert from 'node:assert'
import { describe, it } from 'node:test'

const ld = (f: string) => import(f)

const { default: ContactSubmissions } = await ld('../src/collections/ContactSubmissions.ts')
const { bookingEmailAdapter } = await ld('../src/email/adapter.ts')
const { formatEnquiryEmail } = await ld('../src/email/enquiryNotification.ts')
const {
  emptyEnquiry,
  validateEnquiry,
  composeEnquiry,
} = await ld('../lib/enquiry.ts')
const { migrations } = await ld('../src/migrations/index.ts')

describe('Enquiry System & Spam Protection Tests', () => {
  describe('Task 11: Structured CMS Fields & Validation', () => {
    it('ContactSubmissions collection has all required dedicated fields', () => {
      const fieldNames = ContactSubmissions.fields.map((f: any) => f.name)

      // Expected new fields
      assert.ok(fieldNames.includes('eventDate'), 'Should include eventDate')
      assert.ok(fieldNames.includes('location'), 'Should include location')
      assert.ok(fieldNames.includes('audience'), 'Should include audience')
      assert.ok(fieldNames.includes('budget'), 'Should include budget')
      assert.ok(fieldNames.includes('organisation'), 'Should include organisation')
      assert.ok(fieldNames.includes('honeypot'), 'Should include honeypot')

      // Existing fields preserved
      assert.ok(fieldNames.includes('name'), 'Should include name')
      assert.ok(fieldNames.includes('email'), 'Should include email')
      assert.ok(fieldNames.includes('phone'), 'Should include phone')
      assert.ok(fieldNames.includes('eventType'), 'Should include eventType')
      assert.ok(fieldNames.includes('message'), 'Should include message')
      assert.ok(fieldNames.includes('status'), 'Should include status')

      // Check eventDate type is 'date'
      const eventDateField = ContactSubmissions.fields.find((f: any) => f.name === 'eventDate') as any
      assert.strictEqual(eventDateField.type, 'date')

      // Check honeypot is hidden in admin
      const honeypotField = ContactSubmissions.fields.find((f: any) => f.name === 'honeypot') as any
      assert.strictEqual(honeypotField?.admin?.hidden, true)
    })

    it('Payload admin list contains dedicated fields in defaultColumns', () => {
      const defaultCols = ContactSubmissions.admin?.defaultColumns || []
      assert.ok(defaultCols.includes('eventDate'), 'defaultColumns should include eventDate')
      assert.ok(defaultCols.includes('location'), 'defaultColumns should include location')
      assert.ok(defaultCols.includes('organisation'), 'defaultColumns should include organisation')
      assert.ok(defaultCols.includes('audience'), 'defaultColumns should include audience')
      assert.ok(defaultCols.includes('budget'), 'defaultColumns should include budget')
    })

    it('emptyEnquiry initializes all structured fields including honeypot', () => {
      assert.strictEqual(emptyEnquiry.name, '')
      assert.strictEqual(emptyEnquiry.email, '')
      assert.strictEqual(emptyEnquiry.phone, '')
      assert.strictEqual(emptyEnquiry.organisation, '')
      assert.strictEqual(emptyEnquiry.eventType, '')
      assert.strictEqual(emptyEnquiry.eventDate, '')
      assert.strictEqual(emptyEnquiry.location, '')
      assert.strictEqual(emptyEnquiry.audience, '')
      assert.strictEqual(emptyEnquiry.budget, '')
      assert.strictEqual(emptyEnquiry.message, '')
      assert.strictEqual(emptyEnquiry.honeypot, '')
    })

    it('validateEnquiry validates required and optional fields accurately', () => {
      const valid = {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        phone: '+91 98765 43210',
        organisation: 'Taj Lands End',
        eventType: 'Wedding',
        eventDate: '2027-12-15',
        location: 'Mumbai, India',
        audience: '500 guests',
        budget: '₹5,00,000',
        message: 'Looking for a 4-hour high energy Bollywood and commercial set.',
        honeypot: '',
      }

      const errors = validateEnquiry(valid)
      assert.strictEqual(Object.keys(errors).length, 0, 'Valid enquiry should have zero errors')

      const invalid = {
        ...valid,
        name: '',
        email: 'invalid-email',
        eventDate: '2020-01-01', // in past
        location: '',
        message: 'short', // under 10 chars
      }

      const foundErrors = validateEnquiry(invalid)
      assert.ok(foundErrors.name, 'Should error on empty name')
      assert.ok(foundErrors.email, 'Should error on invalid email')
      assert.ok(foundErrors.eventDate, 'Should error on past date')
      assert.ok(foundErrors.location, 'Should error on empty location')
      assert.ok(foundErrors.message, 'Should error on short message')
    })

    it('Migration add_structured_enquiry_fields is properly registered in migrations index', () => {
      const migration = migrations.find((m: any) =>
        m.name.includes('add_structured_enquiry_fields'),
      )
      assert.ok(migration, 'add_structured_enquiry_fields migration should be registered')
      assert.strictEqual(typeof migration.up, 'function')
      assert.strictEqual(typeof migration.down, 'function')
    })
  })

  describe('Task 2: Spam Protection & Rate Limiting', () => {
    it('beforeChange hook rejects submissions with non-empty honeypot', () => {
      const beforeChangeHook = ContactSubmissions.hooks?.beforeChange?.[0]
      assert.strictEqual(typeof beforeChangeHook, 'function', 'beforeChange hook must be defined')

      const mockReq = {
        payload: {
          logger: {
            warn: () => {},
          },
        },
        headers: new Headers(),
      } as any

      // Bot submission with honeypot filled
      assert.throws(
        () => {
          ;(beforeChangeHook as any)({
            data: {
              name: 'Bot Spammer',
              email: 'spammer@bot.com',
              honeypot: 'http://spam-link.ru',
            },
            req: mockReq,
            operation: 'create',
          })
        },
        (err: any) => {
          return err.message === 'Invalid submission.' && err.status === 400
        },
        'Should reject non-empty honeypot with status 400',
      )
    })

    it('beforeChange hook permits legitimate submissions and cleans up honeypot field', () => {
      const beforeChangeHook = ContactSubmissions.hooks?.beforeChange?.[0] as any

      const mockReq = {
        payload: { logger: { warn: () => {} } },
        headers: new Headers(),
      } as any

      const legitimateData: any = {
        name: 'Priya Patel',
        email: 'priya@example.com',
        honeypot: '',
      }

      const result = beforeChangeHook({
        data: legitimateData,
        req: mockReq,
        operation: 'create',
      })

      assert.strictEqual(result.name, 'Priya Patel')
      assert.strictEqual(result.honeypot, undefined, 'honeypot property must be stripped')
    })

    it('beforeOperation hook rate limits excessive submissions from the same IP', () => {
      const beforeOpHook = ContactSubmissions.hooks?.beforeOperation?.[0] as any
      assert.strictEqual(typeof beforeOpHook, 'function', 'beforeOperation hook must be defined')

      const testIp = '198.51.100.99'
      const headers = new Headers()
      headers.set('x-forwarded-for', testIp)

      const mockReq = {
        user: null, // unauthenticated
        headers,
        payload: {
          logger: {
            warn: () => {},
          },
        },
      } as any

      // Submit up to limit (5)
      for (let i = 0; i < 5; i++) {
        assert.doesNotThrow(() => {
          beforeOpHook({ operation: 'create', req: mockReq })
        }, `Submission ${i + 1} should be accepted`)
      }

      // 6th submission should be rate-limited (429)
      assert.throws(
        () => {
          beforeOpHook({ operation: 'create', req: mockReq })
        },
        (err: any) => {
          return err.status === 429 && err.message.includes('Too many submissions')
        },
        '6th submission should throw APIError with 429',
      )
    })

    it('beforeOperation hook does not rate limit authenticated admin users', () => {
      const beforeOpHook = ContactSubmissions.hooks?.beforeOperation?.[0] as any
      const testIp = '198.51.100.101'
      const headers = new Headers()
      headers.set('x-forwarded-for', testIp)

      const mockAdminReq = {
        user: { id: 1, email: 'admin@djganeshbombay.com' },
        headers,
        payload: { logger: { warn: () => {} } },
      } as any

      // Admins can create repeatedly without rate limit
      for (let i = 0; i < 10; i++) {
        assert.doesNotThrow(() => {
          beforeOpHook({ operation: 'create', req: mockAdminReq })
        })
      }
    })
  })

  describe('Task 1: Email Notifications & Adapter', () => {
    it('formatEnquiryEmail correctly formats structured fields, escaping and links', () => {
      const sample = {
        name: 'Rohan Mehta <script>alert(1)</script>',
        email: 'rohan@example.com',
        phone: '+91 99999 88888',
        organisation: 'Marriott Bonvoy & Co',
        eventType: 'Corporate Event',
        eventDate: '2027-11-20',
        location: 'Goa, India',
        audience: '300 delegates',
        budget: '₹3,50,000',
        message: 'Need sound check by 4pm, performance from 8pm onwards.',
      }

      const { subject, html, text } = formatEnquiryEmail(sample)

      // Subject
      assert.ok(subject.includes('Rohan Mehta'), 'Subject should contain name')
      assert.ok(subject.includes('Corporate Event'), 'Subject should contain eventType')

      // HTML safety
      assert.ok(!html.includes('<script>'), 'HTML must escape scripts')
      assert.ok(html.includes('&lt;script&gt;'), 'HTML must have entity escaping')
      assert.ok(html.includes('mailto:rohan@example.com'), 'HTML must have mailto link')
      assert.ok(html.includes('tel:+91 99999 88888'), 'HTML must have tel link')
      assert.ok(html.includes('Goa, India'), 'HTML must contain location')
      assert.ok(html.includes('Marriott Bonvoy &amp; Co'), 'HTML must contain organisation')
      assert.ok(html.includes('300 delegates'), 'HTML must contain audience')

      // Plain text
      assert.ok(text.includes('Rohan Mehta'), 'Plain text should contain name')
      assert.ok(text.includes('Goa, India'), 'Plain text should contain location')
      assert.ok(text.includes('rohan@example.com'), 'Plain text should contain email')
    })

    it('afterChange hook triggers email notification only on create operation', async () => {
      const afterChangeHook = ContactSubmissions.hooks?.afterChange?.[0] as any
      assert.strictEqual(typeof afterChangeHook, 'function', 'afterChange hook must be defined')

      let emailSent = false
      let sentPayload: any = null

      const mockReq = {
        payload: {
          logger: {
            info: () => {},
            error: () => {},
          },
          sendEmail: async (payload: any) => {
            emailSent = true
            sentPayload = payload
            return Promise.resolve()
          },
        },
      } as any

      const doc = {
        id: 42,
        name: 'Meera Kapoor',
        email: 'meera@example.com',
        phone: '+91 91234 56789',
        organisation: 'Grand Hyatt',
        eventType: 'Wedding',
        eventDate: '2027-02-14',
        location: 'Udaipur, Rajasthan',
        audience: '400',
        budget: '₹6,00,000',
        message: 'Looking for a sundowner set and sangeet night.',
      }

      // Test 1: Update operation should NOT send an email
      await afterChangeHook({ doc, operation: 'update', req: mockReq })
      assert.strictEqual(emailSent, false, 'update operation must not trigger email notification')

      // Test 2: Create operation MUST trigger an email notification
      process.env.BOOKING_NOTIFICATION_EMAIL = 'booking-inbox@example.com'
      await afterChangeHook({ doc, operation: 'create', req: mockReq })
      assert.strictEqual(emailSent, true, 'create operation must trigger email notification')
      assert.strictEqual(sentPayload.replyTo, 'meera@example.com', 'replyTo must be visitor email')
      assert.strictEqual(
        sentPayload.to,
        'booking-inbox@example.com',
        'Notification recipient must match BOOKING_NOTIFICATION_EMAIL',
      )
      assert.ok(sentPayload.subject.includes('Meera Kapoor'))
      assert.ok(sentPayload.html.includes('Udaipur, Rajasthan'))
    })

    it('bookingEmailAdapter logs delivery simulation cleanly when no external provider is set', async () => {
      let loggedMessage = ''
      const mockPayload = {
        logger: {
          info: (msg: string) => {
            loggedMessage = msg
          },
          error: () => {},
        },
      } as any

      const prevKey = process.env.RESEND_API_KEY
      delete process.env.RESEND_API_KEY
      const adapter = bookingEmailAdapter({ payload: mockPayload })
      assert.strictEqual(typeof adapter.sendEmail, 'function')

      const result = await adapter.sendEmail({
        to: 'inbox@example.com',
        from: 'bookings@djganeshbombay.com',
        replyTo: 'client@example.com',
        subject: 'Test Notification',
        text: 'This is a test notification body.',
      })
      if (prevKey) process.env.RESEND_API_KEY = prevKey

      assert.ok(result, 'Send email should return a valid outcome')
      assert.ok(loggedMessage.includes('inbox@example.com'), 'Should log recipient')
      assert.ok(loggedMessage.includes('Test Notification'), 'Should log subject')
    })
  })
})
