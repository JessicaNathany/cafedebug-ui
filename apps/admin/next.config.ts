import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@cafedebug/design-tokens", "@cafedebug/api-client"],
  outputFileTracingRoot: path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  )
};

export default withSentryConfig(nextConfig, {
  silent: true
});
