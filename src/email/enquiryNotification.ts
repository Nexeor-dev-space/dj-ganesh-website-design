import fs from 'node:fs'
import path from 'node:path'

export interface EnquiryNotificationData {
  id?: string | number
  name: string
  email: string
  phone?: string | null
  organisation?: string | null
  eventType?: string | null
  eventDate?: string | Date | null
  location?: string | null
  audience?: string | null
  budget?: string | null
  message: string
  createdAt?: string | Date | null
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Not specified'
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return String(date)
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return String(date)
  }
}

function escapeHtml(text: string | null | undefined): string {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export interface EnquiryEmailAttachment {
  filename: string
  content?: string
  content_id?: string
  cid?: string
  contentType?: string
}

let cachedLogo: { base64: string; filename: string } | null | false = null

function getLocalLogo(): { base64: string; filename: string } | null {
  if (cachedLogo !== null) {
    return cachedLogo === false ? null : cachedLogo
  }

  try {
    const filename = 'logo-dj-ganesh-full-1.png'
    const filePath = path.resolve(process.cwd(), 'public', 'media', filename)
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath)
      cachedLogo = {
        base64: buffer.toString('base64'),
        filename,
      }
      return cachedLogo
    }
  } catch {
    // Graceful fallback if filesystem cannot be read
  }

  cachedLogo = false
  return null
}

export function formatEnquiryEmail(data: EnquiryNotificationData) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://djganeshbombay.com').replace(/\/$/, '')
  const customLogoUrl = process.env.EMAIL_LOGO_URL?.trim()

  const localLogo = getLocalLogo()
  const attachments: EnquiryEmailAttachment[] = []

  let logoUrl: string
  if (customLogoUrl) {
    logoUrl = customLogoUrl
  } else if (localLogo) {
    logoUrl = 'cid:dj-ganesh-logo'
    attachments.push({
      filename: localLogo.filename,
      content: localLogo.base64,
      content_id: 'dj-ganesh-logo',
      cid: 'dj-ganesh-logo',
      contentType: 'image/png',
    })
  } else {
    logoUrl = `${siteUrl}/media/logo-dj-ganesh-full-1.png`
  }

  const formattedDate = formatDate(data.eventDate)
  const subject = `New Booking Enquiry: ${data.name} — ${data.eventType || 'Event'} (${formattedDate})`

  const rows = [
    { label: 'Client Name', value: escapeHtml(data.name), plain: data.name },
    {
      label: 'Email Address',
      value: `<a href="mailto:${escapeHtml(data.email)}" style="color: #b8ff66; text-decoration: none;">${escapeHtml(data.email)}</a>`,
      plain: data.email,
    },
    {
      label: 'Phone Number',
      value: data.phone
        ? `<a href="tel:${escapeHtml(data.phone)}" style="color: #b8ff66; text-decoration: none;">${escapeHtml(data.phone)}</a>`
        : null,
      plain: data.phone || null,
    },
    { label: 'Organisation / Event', value: data.organisation ? escapeHtml(data.organisation) : null, plain: data.organisation },
    { label: 'Event Type', value: data.eventType ? escapeHtml(data.eventType) : null, plain: data.eventType },
    { label: 'Event Date', value: formattedDate !== 'Not specified' ? formattedDate : null, plain: formattedDate !== 'Not specified' ? formattedDate : null },
    { label: 'Location', value: data.location ? escapeHtml(data.location) : null, plain: data.location },
    { label: 'Expected Audience', value: data.audience ? escapeHtml(data.audience) : null, plain: data.audience },
    { label: 'Budget / Fee Range', value: data.budget ? escapeHtml(data.budget) : null, plain: data.budget },
  ].filter((row) => row.value !== null)

  const rowsHtml = rows
    .map(
      (r) => `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #888; font-size: 13px; font-weight: 500; width: 35%; text-transform: uppercase; letter-spacing: 0.5px;">${r.label}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #eee; font-size: 14px;">${r.value}</td>
        </tr>
      `,
    )
    .join('')

  const plainTextRows = rows
    .map((r) => `${r.label}: ${r.plain || r.value}`)
    .join('\n')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #0c0c0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #141414; border: 1px solid #282828; border-radius: 8px; overflow: hidden;">
    <!-- Header with Branding Logo -->
    <tr>
      <td style="padding: 32px 28px 24px 28px; background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%); border-bottom: 1px solid #282828;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td>
              <a href="${siteUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
                <img
                  src="${logoUrl}"
                  alt="DJ Ganesh"
                  width="180"
                  height="26"
                  style="display: block; width: 180px; max-width: 100%; height: auto; border: 0; outline: none; text-decoration: none;"
                />
              </a>
            </td>
          </tr>
        </table>
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #b8ff66; text-transform: uppercase; margin-bottom: 6px;">Booking Notification</div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">New Booking Enquiry</h1>
      </td>
    </tr>

    <!-- Summary Box -->
    <tr>
      <td style="padding: 24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #242424; border-radius: 6px; background-color: #181818;">
          ${rowsHtml}
        </table>
      </td>
    </tr>

    <!-- Message Block -->
    <tr>
      <td style="padding: 0 28px 24px 28px;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px;">Enquiry Message</div>
        <div style="padding: 16px; background-color: #0e0e0e; border: 1px solid #222; border-left: 3px solid #b8ff66; border-radius: 4px; color: #ddd; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
      </td>
    </tr>

    <!-- Reply Button -->
    <tr>
      <td style="padding: 0 28px 28px 28px; text-align: center;">
        <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20Booking%20Enquiry%20%E2%80%94%20DJ%20Ganesh" style="display: inline-block; background-color: #b8ff66; color: #000000; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 6px; text-decoration: none; letter-spacing: 0.3px;">
          Reply to ${escapeHtml(data.name)} &rarr;
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 28px; background-color: #0d0d0d; border-top: 1px solid #202020; text-align: center; font-size: 12px; color: #666;">
        Enquiry received via <a href="${siteUrl}/contact" style="color: #888; text-decoration: none;">${siteUrl.replace(/^https?:\/\//, '')}/contact</a>.
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
========================================
DJ GANESH — BOOKING NOTIFICATION
========================================

${plainTextRows}

--- ENQUIRY MESSAGE ---
${data.message}

Reply to: ${data.name} <${data.email}>
Received via ${siteUrl}/contact
`.trim()

  return { subject, html, text, attachments }
}
