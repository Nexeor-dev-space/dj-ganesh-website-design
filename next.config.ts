import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Release stills, the artwork the client's own cards used. Narrowed
        // to YouTube's thumbnail host and its `/vi/` path so this cannot
        // become a general-purpose image proxy.
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        // The downloads archive folded into `/music`: same four tracks, same
        // filter and search, one page. Permanent, so anything already linking
        // here follows once and updates.
        source: "/downloads",
        destination: "/music",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
