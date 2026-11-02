# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM base AS builder
# Coolify passes env vars as build args when "Build Variable" is ticked.
# Next prerenders pages that query Payload, so the DB must be reachable at build.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_PAYLOAD_URL
# Read at build time: the live domain (canonical URLs, sitemap, link
# previews), the GA4 Measurement ID (analytics stays off when it is empty)
# and the Search Console verification code.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ENV DATABASE_URL=$DATABASE_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    NEXT_PUBLIC_PAYLOAD_URL=$NEXT_PUBLIC_PAYLOAD_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NODE_OPTIONS=--max-old-space-size=2048 \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runtime ----
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# Full app (not standalone) so `payload migrate` and the seed script can run.
COPY --from=builder /app ./
# Payload uploads land here — mount a persistent volume at /app/public/media.
RUN mkdir -p public/media && chown -R node:node public/media .next
USER node
EXPOSE 3000
CMD ["sh", "-c", "npm run migrate && npm run start"]
