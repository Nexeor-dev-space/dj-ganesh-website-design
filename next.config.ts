import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The staging container has limited RAM; the default Turbopack build was
  // OOM-killed (exit 137). Build with webpack + its low-memory mode instead.
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
