# DJ Ganesh — Official Website

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, with Payload CMS 3 on
PostgreSQL. The site and the CMS run in one Next.js app: the public pages live
under `app/(app)`, the CMS admin and API under `app/(payload)`.

## Getting started

Requirements: Node.js 20.9 or newer (the Docker image uses Node 22), npm, and a
PostgreSQL database.

```bash
npm install
# create .env (see "Local database" and "Environment variables" below)
npm run dev
```

Then open http://localhost:3000 for the site and http://localhost:3000/admin
for the CMS.

Without `DATABASE_URL` the site still runs: every page falls back to the
built-in content in `data/` and `lib/` (see `lib/cms/client.ts`). The admin
needs a database.

### Local database

Any PostgreSQL works. With Docker:

```bash
docker run -d --name dj-ganesh-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=dj_ganesh_cms postgres:16
```

Minimum `.env` for local development:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dj_ganesh_cms
PAYLOAD_SECRET=local-dev-secret-change-me
```

When `DATABASE_URL` points at `localhost` or `127.0.0.1` and `NODE_ENV` is not
`production`, Payload **pushes** the schema automatically on startup (no
migrations needed for a local DB). Against any other host it does not — see
[Migrations](#migrations).

### First run, step by step

1. `npm install`
2. Create `.env` (above).
3. `npm run dev` — on a local DB the schema is created on startup. For a
   remote DB, run `npm run migrate` first.
4. Open `/admin` and create the first admin user (below).
5. Optional: `npm run seed` to fill the CMS with the site's current content.

## Payload CMS

| What | Where |
| --- | --- |
| Config | `payload.config.ts` (re-exported by `src/payload.config.ts`; imported in code as `@payload-config`) |
| Collections | `src/collections/` — Users, Media, UpcomingShows, MusicReleases, PerformanceHistory, Gallery, LegacyMilestones, Testimonials, ExperiencesServices, ContactSubmissions |
| Globals | `src/globals/` — SiteSettings, Navigation, HomePage, ContactBooking, About, MusicPage, PrivacyPolicy |
| Shared fields | `src/fields/` (SEO) |
| Hooks | `src/hooks/revalidateSite.ts` — every save/delete refreshes the public site |
| Email adapter | `src/email/` |
| Admin dashboard | `src/admin/Dashboard.tsx` |
| Migrations | `src/migrations/` |
| Generated types | `payload-types.ts` (do not edit by hand) |
| Admin panel | `/admin` |
| REST / GraphQL API | `/api/...`, `/api/graphql` |

Pages read the CMS through the Local API (`lib/cms/queries.ts`), not over HTTP.
Public pages are regenerated at most every 60 seconds (`revalidate = 60`), and
immediately after an edit, through the hooks above.

### First admin user

Admins are the `users` collection (`auth: true`). On an empty database,
`/admin` shows a **Create first user** form — fill in email and password and you
are logged in. Further users are added from **Settings → Users** in the admin.
The seed script does not create users.

### Types

After changing a collection, global or field, regenerate the TypeScript types:

```bash
npm run payload:types
```

This rewrites `payload-types.ts`. Commit it with the schema change.

## Database seeding

```bash
npm run seed
```

Runs `scripts/seed.ts` (with `node --experimental-strip-types --no-warnings`).

- **What it seeds**: all seven globals (site settings, navigation, home page,
  about, music page, contact & booking, privacy policy) and the collections
  music releases, upcoming shows, legacy milestones, testimonials, experiences &
  services, performance history and the "Live Sets" gallery album — taken from
  the hardcoded content in `data/` and `lib/`. It also uploads the images and
  videos those reference into the Media collection (read from `public/` when the
  file is there, else downloaded from `NEXT_PUBLIC_MEDIA_BASE_URL`). It prints the document counts at the end.
- **Not seeded**: users and contact submissions.
- **Re-running**: safe, no duplicates. Media is matched by filename and reused;
  documents are matched (by slug, title, venue + city, etc.) and updated in place.
  But it **overwrites** — every global and every matched document is reset to
  the code's content, so edits made in the admin to those are lost. Do not run it
  against production once editors have started working.
- **Text-only mode**: `SEED_TEXT_ONLY=1 npm run seed` skips every media upload
  and the gallery album, leaving upload fields empty so the site falls back to
  the committed `/images` and `/videos` files. Use this for an environment whose
  media disk can't be populated.
- **Prerequisites**: `DATABASE_URL` and `PAYLOAD_SECRET` set, and the schema in
  place (local push via `npm run dev`, or `npm run migrate` on a remote DB).
  Uploads go to MinIO when the media variables are set (see
  [Media storage and delivery](#media-storage-and-delivery)), else to `public/media`.

## Migrations

| Command | What it does |
| --- | --- |
| `npm run migrate` | Apply every pending migration in `src/migrations/` |
| `npm run migrate:create <name>` | Generate a migration from the difference between the config and the last migration snapshot |
| `npm run migrate:status` | List migrations and whether each has run |

Each migration is a `.ts` file plus a `.json` schema snapshot, registered in
`src/migrations/index.ts`.

**Rules for any schema change** (new collection, global or field):

1. Change the collection/global in `src/`.
2. `npm run migrate:create <short_name>` and check the generated SQL.
3. `npm run payload:types`.
4. **Commit the migration files with the code.** A field without its migration
   never reaches the remote databases.
5. The migration must be **applied before the new code serves traffic**.
   Payload selects every column it knows about, so code that has a field whose
   column doesn't exist yet fails every query on that table — pages and the
   admin return 500s (`column ... does not exist`).

Local push and migrations don't mix on the same database: if you've been
running `npm run dev` with push against a DB and then run `npm run migrate` on
it, Payload asks about the dev-push marker. See `docs/DEPLOYMENT-MIGRATIONS.md`.

### How deploys run migrations

The `Dockerfile` is a three-stage build (Coolify):

- **Build** — `DATABASE_URL`, `PAYLOAD_SECRET` and the `NEXT_PUBLIC_*` values
  are build args. The database must be **reachable at build time**: `next build`
  prerenders pages that query Payload.
- **Run** — the container starts with `npm run migrate && npm run start`, so
  pending migrations are applied before the server starts. If a migration fails
  the server does not start. The full app is copied (not the standalone output)
  so the Payload CLI and the seed script can run inside the container.

Note the order: because the build prerenders against the database, a build that
introduces a new column runs **before** its migration has been applied by the
start command. Apply the migration first (`npm run migrate` against that
database) when a build depends on a new column.

All PR previews currently share one database. Additive migrations are fine; a
destructive one from an unmerged branch affects every preview.

The history of the migration setup, and the one-time adoption steps for a
database created by push, are in `docs/DEPLOYMENT-MIGRATIONS.md`.

## Environment variables

Set these in `.env` locally and as environment variables on the host
(`.env*` is git-ignored and excluded from the Docker build context).
`NEXT_PUBLIC_*` values are baked in at build time, so a change needs a rebuild;
in the Dockerfile they are build args, so tick "Build Variable" for them in
Coolify. Examples below are placeholders — never commit real values.

### Core / database

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes (for the CMS) | Postgres connection string for Payload. Also needed at build time. Unset → the site serves built-in content and the admin can't work. A `localhost`/`127.0.0.1` host turns on schema push in dev. | `postgresql://postgres:postgres@localhost:5432/dj_ganesh_cms` |
| `PAYLOAD_SECRET` | yes | Encrypts Payload tokens and sessions. Falls back to `change-me-in-production` if unset — always set a long random value outside local dev. | `openssl rand -hex 32` output |
| `NODE_ENV` | set by Next/Docker | `production` disables schema push and the `/dev` sandbox route, and hides the WhatsApp button while it uses the placeholder number. Don't set by hand in dev. | `production` |

### Site URL and SEO

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Live address, no trailing slash. Used for canonical URLs, the sitemap, robots.txt, link previews, structured data and the logo link in notification emails. Defaults to `https://djganeshbombay.com`. | `https://djganeshbombay.com` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | for Search Console | The `content` value from Search Console's "HTML tag" verification method. Adds `<meta name="google-site-verification">` to every page. | `abc123...` |

### Analytics

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | for analytics | Google Analytics 4 Measurement ID (GA → Admin → Data streams → your web stream). Analytics and the cookie banner stay off while this is empty. | `G-XXXXXXXXXX` |

### Contact details

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | WhatsApp booking number, digits with country code (non-digits are stripped). While unset, a placeholder is used and the button is hidden in production. | `919800000000` |
| `NEXT_PUBLIC_GENERAL_EMAIL` | no | "General enquiries" address on the contact page. Defaults to the booking email. | `info@example.com` |

### Email / enquiry notifications

New contact submissions send a notification email (`src/collections/ContactSubmissions.ts`
→ `src/email/`). The adapter picks the first that is configured: **Resend** if
`RESEND_API_KEY` is set, else **SMTP** if `SMTP_HOST` is set, else it only
**logs** the email (simulated delivery).

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `BOOKING_NOTIFICATION_EMAIL` | for email alerts | Inbox that receives enquiry notifications. Unset → no email is sent (a warning is logged); the enquiry is still saved. | `bookings@example.com` |
| `RESEND_API_KEY` | no | Resend API key. When set, mail goes through the Resend HTTP API. | `re_xxxxxxxx` |
| `RESEND_FROM_EMAIL` | no | From address for Resend; takes precedence over `EMAIL_FROM`. Must be on a domain verified in Resend. | `DJ Ganesh <bookings@example.com>` |
| `EMAIL_FROM` | no | Default sender address. Defaults to `bookings@djganeshbombay.com`. | `bookings@example.com` |
| `EMAIL_FROM_NAME` | no | Default sender name. Defaults to `DJ Ganesh Bookings`. | `DJ Ganesh Bookings` |
| `EMAIL_LOGO_URL` | no | Absolute URL of the logo in notification emails. Unset → `public/media/logo-dj-ganesh-full-1.png` is attached inline if present, otherwise `<NEXT_PUBLIC_MEDIA_BASE_URL>/media/logo-dj-ganesh-full-1.png` (or the same path on `NEXT_PUBLIC_SITE_URL` when no media host is set). | `https://example.com/logo.png` |
| `SMTP_HOST` | no | SMTP host, used when `RESEND_API_KEY` is not set. Requires `nodemailer`, which is **not** in `package.json` — `npm install nodemailer` first. | `smtp.example.com` |
| `SMTP_PORT` | no | SMTP port. Defaults to `587`. | `587` |
| `SMTP_SECURE` | no | `true` for implicit TLS (port 465). | `false` |
| `SMTP_USER` | no | SMTP username. No auth is sent when unset. | `bookings@example.com` |
| `SMTP_PASS` | no | SMTP password. | — |

### Spam protection

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `RATE_LIMIT_WINDOW_MS` | no | Rate-limit window for public enquiries, per IP, in ms. Defaults to `600000` (10 min). | `600000` |
| `RATE_LIMIT_MAX_SUBMISSIONS` | no | Max enquiries per IP per window. Defaults to `5`. The limiter is in memory, per server process — it resets on restart. | `5` |

### Scripts only

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `SEED_TEXT_ONLY` | no | `1` makes `npm run seed` skip media uploads. | `1` |

### Set by the Dockerfile

`PORT=3000`, `HOSTNAME=0.0.0.0`, `NEXT_TELEMETRY_DISABLED=1`, and at build
`NODE_OPTIONS=--max-old-space-size=2048`. The Dockerfile also accepts a
`NEXT_PUBLIC_PAYLOAD_URL` build arg, but no code reads it.

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

## Media storage and delivery

Photos, video and audio are stored in **MinIO** (S3-compatible object storage),
bucket `dj-ganesh`, folder `assets/`, and served straight from the MinIO API
host. There is no CDN yet: adding one later only means changing
`NEXT_PUBLIC_MEDIA_BASE_URL` (and pointing the CDN at that folder).

```
dj-ganesh/assets/
  audio/    the four track mixes          (were public/audio)
  images/   site photos, artists/, wall/  (were public/images, logos excluded)
  og/       link-preview image            (was public/og)
  videos/   hero video and reel           (were public/videos)
  media/    CMS Media uploads             (were public/media)
```

- **Built-in assets** (`data/`, `lib/`): every path goes through
  `assetUrl()` in `lib/asset-url.ts`, which prefixes
  `NEXT_PUBLIC_MEDIA_BASE_URL`. Unset (local dev), paths stay relative and are
  served from `public/`. The logos and fonts stay in `public/`.
- **CMS uploads**: `@payloadcms/storage-s3` in `payload.config.ts` writes the
  Media collection to `assets/media/` and builds every Media URL as
  `NEXT_PUBLIC_MEDIA_BASE_URL/media/<filename>`. Payload generates
  `thumbnail` (400×300), `card` (768×576) and `hero` (1920×1080) sizes with
  `sharp`. Without `MINIO_ENDPOINT`/`MINIO_BUCKET`/`NEXT_PUBLIC_MEDIA_BASE_URL`
  the plugin is off and uploads go to `public/media` on disk (local dev).
- `next/image` may optimise from the media host: `next.config.ts` adds
  `NEXT_PUBLIC_MEDIA_BASE_URL/**` to `images.remotePatterns`.
- The music player reads audio through Web Audio, so it loads the mixes with
  `crossOrigin="anonymous"`. The media host must send CORS headers
  (`Access-Control-Allow-Origin`), or the files fail to load.
- The bucket's `assets/` prefix is public **read-only**; the app's MinIO key
  is limited to the `dj-ganesh` bucket.
- Payload sends files under 50 MB to MinIO in one request, so the proxy in
  front of the MinIO API must accept request bodies that large.

### Media environment variables

| Variable | Build var | Purpose | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | yes | Public URL of the `assets/` folder (or a CDN in front of it), no trailing slash. | `https://<minio-api-host>/dj-ganesh/assets` |
| `MINIO_ENDPOINT` | yes | MinIO S3 API URL, with `https://`. | `https://<minio-api-host>` |
| `MINIO_BUCKET` | yes | Bucket name. | `dj-ganesh` |
| `MINIO_REGION` | no | S3 region; MinIO ignores it. Defaults to `us-east-1`. | `us-east-1` |
| `MINIO_ACCESS_KEY` | no (runtime only) | Access key scoped to the bucket. Secret. | — |
| `MINIO_SECRET_KEY` | no (runtime only) | Its secret. Secret. | — |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (site + admin) |
| `npm run build` | Production build (needs the database reachable) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run payload:types` | Regenerate `payload-types.ts` |
| `npm run migrate` | Apply pending migrations |
| `npm run migrate:create <name>` | Create a migration from schema changes |
| `npm run migrate:status` | Show which migrations have run |
| `npm run seed` | Fill the CMS from the built-in content (`scripts/seed.ts`) |

## Structure

```
app/(app)/      Public site (layout, pages, robots, sitemap)
app/(payload)/  Payload admin (/admin) and API routes (/api)
components/     Site components, grouped by section
data/, lib/     Built-in content (CMS fallback, seed source) and helpers
lib/cms/        Payload client, queries, mappers
src/            Payload collections, globals, fields, hooks, email, migrations
scripts/        seed.ts and other Node scripts
docs/           Deployment / migration notes
types/          Shared TypeScript types
public/         images · videos · audio · fonts · media (CMS uploads)
payload.config.ts  Payload config
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
- **Assets**: client-provided media goes in the MinIO bucket under
  `dj-ganesh/assets/` (`audio/`, `images/`, `videos/`, `og/`) and is referenced
  through `assetUrl()`. Do not rename client files.
- **Schema changes** ship with their migration and regenerated types in the
  same commit (see [Migrations](#migrations)).

## Hero media

- **Photograph**: `public/images/banner-bg.png` is the fixed visual identity of
  the first viewport. It is never modified on disk — grade, grain, vignette and
  scrims are applied in CSS (`.hero-photo`, `.overlay-*` in `globals.css`).
- **Sound**: the `/dev/interactions` sandbox plays `assets/audio/openformat.mp3`
  (see `lib/media.ts`). Nothing ever autoplays.

## Troubleshooting

**`ECONNREFUSED` / connection timeouts against a remote Postgres.** The link to
the remote database drops briefly now and then. The pool in `payload.config.ts`
keeps connections alive (`keepAlive: true`, idle connections kept for 5 minutes)
and allows 15 s to connect. Every CMS read in `lib/cms/queries.ts` is tried
3 times, about 0.4 s and 0.8 s apart. If the database is still unreachable the
error is thrown: at runtime the page regeneration fails and Next keeps serving
the last good version; during `next build` the build fails. Check that the DB
host is reachable from where you run (firewall / allowed IPs), and that the
database is reachable at build time on the host. An *unset* `DATABASE_URL` is
different: the site then serves the built-in content without trying to connect.

**Payload CLI fails to load the TypeScript config.** `npm run seed` already runs
with `--experimental-strip-types --no-warnings`. If `npm run migrate`,
`migrate:create`, `migrate:status` or `payload:types` fail to load
`payload.config.ts` on your Node version, prefix them, as in
`docs/DEPLOYMENT-MIGRATIONS.md`:

```bash
NODE_OPTIONS="--experimental-strip-types --no-warnings" npm run migrate
```

Keep any existing options (e.g. `--max-old-space-size=2048`) in `NODE_OPTIONS`.

**500s / `column ... does not exist` after adding a field.** The code has a field
whose migration hasn't been applied to that database. Create it
(`npm run migrate:create <name>`) if it's missing, commit it, and run
`npm run migrate` against the database. `npm run migrate:status` shows what has
run. Locally on `localhost`, restarting `npm run dev` pushes the schema instead.

**`payload migrate` asks about data loss / a dev push.** The database was
previously synced by push. See "One-time adoption" in
`docs/DEPLOYMENT-MIGRATIONS.md`.

**Enquiry emails not arriving.** Check the server log: "Skipped email delivery"
means `BOOKING_NOTIFICATION_EMAIL` is unset; "Simulated Delivery" means neither
`RESEND_API_KEY` nor `SMTP_HOST` is set; an SMTP error with `nodemailer` missing
means it needs installing.

**Uploaded images missing after a redeploy.** The MinIO variables aren't set,
so uploads went to `public/media` inside the container (see
[Media storage and delivery](#media-storage-and-delivery)).
