import type { NextConfig } from "next";

const allowedDevOrigins = process.env.NEXT_DEV_ALLOWED_ORIGINS
  ?.split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cafedebug-uploads.s3.us-east-2.amazonaws.com"
      }
    ]
  },
  ...(allowedDevOrigins ? { allowedDevOrigins } : {})
};

export default nextConfig;
