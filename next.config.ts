import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const config: NextConfig = {
  images: {
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

