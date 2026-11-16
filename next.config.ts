import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

// Photos, video and audio are served from object storage (see
// lib/asset-url.ts). Allow next/image to optimise from that folder only.
const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim().replace(/\/+$/, '')
const mediaPattern = mediaBaseUrl ? [new URL(`${mediaBaseUrl}/**`)] : []

const config: NextConfig = {
  // One 404 for every unknown URL: the app has two root layouts (site and
  // CMS admin), so it is served by app/global-not-found.tsx.
  experimental: {
    globalNotFound: true,
  },
  // Dev only: lets a phone on the same Wi-Fi load the dev server's scripts
  // (e.g. http://192.168.31.114:3000). Without it Next blocks them for any
  // origin but localhost, and the page renders without JavaScript — no
  // scroll reveals, no menu. Production builds ignore this.
  allowedDevOrigins: ['192.168.31.*'],
  images: {
    // 90 is for the music player's sleeves, which are large and in focus.
    qualities: [75, 90],
    // Dev only: some ISPs (NAT64/DNS64) resolve the media host to a
    // 64:ff9b:: address, which Next blocks as private, so every photo 400s on
    // localhost. Servers resolve its public IPv4; production keeps the block.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      ...mediaPattern,
    ],
  },
  // The /dev sandbox is a development tool: on the live site its address
  // goes nowhere, so it gets the site's own 404 like any unknown URL.
  async rewrites() {
    return {
      beforeFiles:
        process.env.NODE_ENV === 'production'
          ? [{ source: '/dev/:path*', destination: '/__not-found' }]
          : [],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      {
        source: '/downloads',
        destination: '/music',
        permanent: true,
      },
    ]
  },
}

export default withPayload(config)

