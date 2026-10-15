import { z } from "zod";

const defaultHomepageSource = process.env.NODE_ENV === "development" ? "api" : "mock";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  WEB_API_BASE_URL: z.url().default("http://localhost:5105"),
  WEB_HOMEPAGE_BANNERS_SOURCE: z.enum(["mock", "api"]).default("mock")
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  WEB_API_BASE_URL: process.env.WEB_API_BASE_URL,
  WEB_HOMEPAGE_BANNERS_SOURCE: process.env.WEB_HOMEPAGE_BANNERS_SOURCE ?? defaultHomepageSource
});
