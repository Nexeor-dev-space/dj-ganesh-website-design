import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
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

