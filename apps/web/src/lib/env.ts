import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000")
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
});
