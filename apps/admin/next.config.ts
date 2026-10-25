import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: [
    "@cafedebug/admin-design-tokens",
    "@cafedebug/api-client",
  ],
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
};

export default withSentryConfig(nextConfig, {
  silent: true,
});
