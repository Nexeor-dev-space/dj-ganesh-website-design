import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
