import { z } from "zod";

import { env } from "@/lib/env";

import { homepageBanners as mockHomepageBanners } from "../mock/homepage-banners.mock";
import type { HomepageBanner } from "../types";

const latestBannerSchema = z.object({
  id: z.number().optional(),
  name: z.string().nullish(),
  url: z.string().nullish(),
  order: z.number().nullish(),
  urlImage: z.string().min(1).nullish()
});

const latestBannersPayloadSchema = z.union([
  z.array(latestBannerSchema),
  z.object({ data: z.array(latestBannerSchema) }),
  z.object({ result: z.array(latestBannerSchema) })
]);

function normalizeImageUrl(urlImage: string): string {
  if (/^https?:\/\//i.test(urlImage)) {
    return urlImage;
  }

  const normalizedPath = urlImage.startsWith("/") ? urlImage : `/${urlImage}`;
  return new URL(normalizedPath, env.WEB_API_BASE_URL).toString();
}

function extractBanners(payload: unknown) {
  const parsed = latestBannersPayloadSchema.parse(payload);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if ("data" in parsed) {
    return parsed.data;
  }

  return parsed.result;
}

export async function listHomepageBanners(): Promise<readonly HomepageBanner[]> {
  if (env.WEB_HOMEPAGE_BANNERS_SOURCE !== "api") {
    return mockHomepageBanners;
  }

  const defaultBanner = mockHomepageBanners[0];
  if (!defaultBanner) {
    throw new Error("Homepage banner fallback fixtures are not configured.");
  }

  const endpoint = new URL("/api/v1/public/banners/latest", env.WEB_API_BASE_URL);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Failed to load homepage banners from ${endpoint.toString()} (status ${response.status}).`);
    }

    const apiBanners = extractBanners(await response.json())
      .slice()
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

    if (apiBanners.length === 0) {
      throw new Error(`No active homepage banners returned by ${endpoint.toString()}.`);
    }

    return apiBanners.map((apiBanner, index) => {
      const banner = mockHomepageBanners[index % mockHomepageBanners.length] ?? defaultBanner;
      const urlImage = apiBanner?.urlImage;

      if (!urlImage) {
        throw new Error(`Banner at index ${index} from ${endpoint.toString()} is missing "urlImage".`);
      }

      const imageUrl = normalizeImageUrl(urlImage);
      const headline = apiBanner.name?.trim() || banner.headline;
      const subtitle = apiBanner.url?.trim() || banner.subtitle;

      return {
        ...banner,
        id: String(apiBanner.id ?? banner.id),
        tabLabel: `BANNER ${String(index + 1).padStart(2, "0")}`,
        headline,
        subtitle,
        imageUrl,
        sourcePhotoUrl: imageUrl
      };
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[homepage-banners] Falling back to mock banners because API request failed.", error);
      return mockHomepageBanners;
    }

    throw error;
  }
}
