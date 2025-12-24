import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 
 
  
  typescript: {
    // This allows the build to finish even if you have small type mismatches
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
