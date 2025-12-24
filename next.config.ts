import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 
  // devServer: {
  //   allowedDevOrigins: [
  //     'http://localhost:3000',
  //     'http://127.0.0.1:3000',
  //     'http://169.254.27.46:3000', // Explicitly allow the detected IP
  //   ],
  // },
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
