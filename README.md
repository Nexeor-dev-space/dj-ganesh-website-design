# DJ Ganesh — Official Website

Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Set these in `.env` locally and as build variables on the host. `NEXT_PUBLIC_*`
values are baked in at build time, so a change needs a rebuild.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Payload CMS Postgres connection |
| `PAYLOAD_SECRET` | yes | Payload CMS secret |
| `NEXT_PUBLIC_SITE_URL` | recommended | Live address, e.g. `https://djganeshbombay.com` (no trailing slash). Used for canonical URLs, the sitemap, robots.txt, link previews and structured data. Defaults to `https://djganeshbombay.com`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | for analytics | Google Analytics 4 Measurement ID, `G-XXXXXXXXXX` (GA → Admin → Data streams → your web stream). Analytics and the cookie banner stay off while this is empty. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | for Search Console | The `content` value from Search Console's "HTML tag" verification method. Adds `<meta name="google-site-verification">` to every page. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | WhatsApp booking number (digits, with country code) |
| `BOOKING_NOTIFICATION_EMAIL` | for email alerts | Inbox recipient for enquiry notification emails (e.g. `info@djganeshbombay.com`) |
| `RESEND_API_KEY` | no | Resend API key for instant email delivery |
| `EMAIL_FROM` | no | Sender email address (defaults to `bookings@djganeshbombay.com`) |
| `EMAIL_FROM_NAME` | no | Sender display name (defaults to `DJ Ganesh Bookings`) |
| `SMTP_HOST` | no | SMTP host (if using SMTP instead of Resend) |
| `SMTP_PORT` | no | SMTP port (e.g. 587 or 465) |
| `SMTP_USER` | no | SMTP username |
| `SMTP_PASS` | no | SMTP password |
| `SMTP_SECURE` | no | Set `true` for SSL/TLS port 465 |
| `RATE_LIMIT_WINDOW_MS` | no | Rate limiting time window in ms (default: 600000 = 10 min) |
| `RATE_LIMIT_MAX_SUBMISSIONS` | no | Max submissions per IP per time window (default: 5) |

### Analytics and cookies

Google Analytics loads only after a visitor presses **Accept** in the cookie
banner; until then nothing is requested from Google. The choice is stored in
the visitor's browser and can be changed from **Cookie settings** in the
footer. Advertising features are off (Consent Mode: ad storage denied).

Tracked: page views on every public page, and one custom event,
`booking_submitted`, sent only after an enquiry is accepted by the server.
The site sends one page view per page itself, including moves between pages
inside the site. **In GA, turn off** Admin → Data streams → your stream →
Enhanced measurement → ⚙ → "Page changes based on browser history events",
or those moves are counted twice. Mark `booking_submitted` as a Key event
(Admin → Events) to count it as a conversion.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Structure

```
app/          App Router entry (layout, page, globals.css)
components/   layout · navigation · hero · sections · ui
lib/          Shared config and helpers (siteConfig)
types/        Shared TypeScript types
public/       images · videos · audio · fonts
```

## Conventions

- **Design tokens** live in `app/globals.css` (`:root`) and are exposed to
  Tailwind through `@theme inline`. Do not hardcode colours or spacing in
  components — use `bg-background`, `text-muted-foreground`, `border-border`,
  `py-3xl`, `gap-md`, etc.
- **Spacing scale**: `xs 8` · `sm 16` · `md 24` · `lg 32` · `xl 48` ·
  `2xl 64` · `3xl 96` · `4xl 120` · `5xl 160` (px).
- **Layout**: wrap every section in `<Container>` (`components/layout/Container.tsx`)
  or the `.container-page` class so the whole site shares one max-width
  (1440px) and gutter.
- **Accent**: one signature colour, `--accent` (`#B8FF66`), used sparingly —
  small labels, nav hover, CTA hover, the sound indicator. Never as a fill.
- **Assets**: client-provided media goes in `public/audio`, `public/images`,
  `public/videos`. Do not rename or re-encode client audio files.

## Hero media

- **Photograph**: `public/images/banner-bg.png` is the fixed visual identity of
  the first viewport. It is never modified on disk — grade, grain, vignette and
  scrims are applied in CSS (`.hero-photo`, `.overlay-*` in `globals.css`).
- **Sound**: the hero toggle activates automatically once a client mix is placed
  at `public/audio/hero-mix.mp3` (see `lib/media.ts`). Until then the control
  renders disabled. Nothing ever autoplays.
