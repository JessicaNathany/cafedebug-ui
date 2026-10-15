import type { NextConfig } from "next";

const allowedDevOrigins = process.env.NEXT_DEV_ALLOWED_ORIGINS
  ?.split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
  ...(allowedDevOrigins ? { allowedDevOrigins } : {})
};

export default nextConfig;
