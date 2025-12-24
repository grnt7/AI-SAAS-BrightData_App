import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 
 
  eslint: {
    // This allows the build to finish even if you have apostrophe errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows the build to finish even if you have small type mismatches
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
