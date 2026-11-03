import type { EmailAdapter, SendEmailOptions } from 'payload'

function formatAddress(addr: unknown): string {
  if (typeof addr === 'string') return addr
  if (addr && typeof addr === 'object' && 'address' in addr) {
    const obj = addr as { name?: string; address: string }
    return obj.name ? `"${obj.name}" <${obj.address}>` : obj.address
  }
  return ''
}

function normalizeAddresses(input: unknown): string[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input.map(formatAddress).filter(Boolean)
  }
  const formatted = formatAddress(input)
  return formatted ? [formatted] : []
}

/**
 * Robust Email Adapter for Payload CMS.
 *
 * Supports:
 * 1. Resend API via native fetch (when RESEND_API_KEY is configured).
 * 2. SMTP via nodemailer (when SMTP_HOST is configured and nodemailer is installed).
 * 3. Fallback simulation via Payload logger in development/test environments.
 */
export const bookingEmailAdapter: EmailAdapter = ({ payload }) => {
  return {
    name: 'booking-email-adapter',
    defaultFromAddress: process.env.EMAIL_FROM || 'bookings@djganeshbombay.com',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'DJ Ganesh Bookings',
    sendEmail: async (message: SendEmailOptions) => {
      // Read environment variables dynamically so hot-reloads of .env work immediately
      const resendApiKey = (process.env.RESEND_API_KEY || '')
        .replace(/^["']|["']$/g, '')
        .trim()
      const resendFromEmail = (
        process.env.RESEND_FROM_EMAIL ||
        process.env.EMAIL_FROM ||
        ''
      )
        .replace(/^["']|["']$/g, '')
        .trim()
      const smtpHost = (process.env.SMTP_HOST || '')
        .replace(/^["']|["']$/g, '')
        .trim()

      const defaultFromName =
        process.env.EMAIL_FROM_NAME || 'DJ Ganesh Bookings'
      const defaultFromAddress =
        process.env.EMAIL_FROM || 'bookings@djganeshbombay.com'

      const from =
        resendFromEmail ||
        formatAddress(message.from) ||
        `"${defaultFromName}" <${defaultFromAddress}>`
      const to = normalizeAddresses(message.to)
      const replyTo =
        formatAddress(message.replyTo) ||
        (message['reply-to'] ? formatAddress(message['reply-to']) : undefined)

      // 1. Resend API (HTTP-based, zero extra dependencies)
      if (resendApiKey) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from,
              to,
              reply_to: replyTo,
              subject: message.subject,
              html: message.html,
              text: message.text,
            }),
          })

          if (!res.ok) {
            const errorBody = await res.text()
            payload.logger.error(
              `[Email Adapter: Resend] Failed to send email (HTTP ${res.status}): ${errorBody}`,
            )
            throw new Error(`Resend delivery failed: ${errorBody}`)
          }

          const result = await res.json()
          payload.logger.info(
            `[Email Adapter: Resend] Email delivered successfully (ID: ${result.id}) to ${to.join(', ')}`,
          )
          return result
        } catch (err: unknown) {
          payload.logger.error(
            `[Email Adapter: Resend] Error during email dispatch: ${err instanceof Error ? err.message : String(err)}`,
          )
          throw err
        }
      }

      // 2. SMTP (via nodemailer if installed)
      if (smtpHost) {
        try {
          // Dynamic runtime evaluation so bundlers (Turbopack / Webpack) don't attempt static resolution
          const importDynamic = new Function(
            'moduleSpecifier',
            'return import(moduleSpecifier)',
          )
          const nodemailer = await importDynamic('nodemailer')
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                }
              : undefined,
          })

          const info = await transporter.sendMail({
            from,
            to,
            replyTo,
            subject: message.subject,
            html: message.html,
            text: message.text,
          })

          payload.logger.info(
            `[Email Adapter: SMTP] Email delivered successfully (MessageID: ${info.messageId}) to ${to.join(', ')}`,
          )
          return info
        } catch (err: unknown) {
          payload.logger.error(
            `[Email Adapter: SMTP] Failed to send email: ${err instanceof Error ? err.message : String(err)}`,
          )
          throw err
        }
      }

      // 3. Fallback / Dev mode: Log full details to Payload logger
      payload.logger.info(`[Email Adapter: Simulated Delivery]
To: ${to.join(', ')}
From: ${from}
Reply-To: ${replyTo || 'None'}
Subject: ${message.subject}
Body (text preview):
${(message.text || message.html || '').toString().slice(0, 200)}...`)

      return Promise.resolve({ simulated: true, to, subject: message.subject })
    },
  }
}
