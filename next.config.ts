import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const config: NextConfig = {
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

