import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 
  devServer: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://169.254.27.46:3000', // Explicitly allow the detected IP
    ],
  },
};

export default nextConfig;
