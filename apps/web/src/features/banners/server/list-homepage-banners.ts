import { z } from "zod";

import { env } from "@/lib/env";

import type { HomepageBanner } from "../types";

const apiBannerSchema = z.object({
  id: z.number().optional(),
  name: z.string().nullish(),
  url: z.string().nullish(),
  order: z.number().nullish(),
  urlImage: z.string().min(1).nullish()
});

const apiBannersPayloadSchema = z.union([
  z.array(apiBannerSchema),
  z.object({ data: z.array(apiBannerSchema) }),
  z.object({ result: z.array(apiBannerSchema) }),
  z.object({ value: z.array(apiBannerSchema) })
]);

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return new URL(normalizedPath, env.WEB_API_BASE_URL).toString();
}

function extractBanners(payload: unknown) {
  const parsed = apiBannersPayloadSchema.parse(payload);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if ("data" in parsed) {
    return parsed.data;
  }

  if ("result" in parsed) {
    return parsed.result;
  }

  return parsed.value;
}

export async function listHomepageBanners(): Promise<readonly HomepageBanner[]> {
  const endpoint = new URL("/api/v1/public/banners/latest", env.WEB_API_BASE_URL);
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
    const image = apiBanner.urlImage?.trim();

    if (!image) {
      throw new Error(`Banner at index ${index} from ${endpoint.toString()} is missing "urlImage".`);
    }

    const headline = apiBanner.name?.trim() || `Destaque ${index + 1}`;
    const bannerLink = apiBanner.url?.trim();

    return {
      id: String(apiBanner.id ?? index + 1),
      tabLabel: `BANNER ${String(index + 1).padStart(2, "0")}`,
      eyebrow: "DESTAQUE",
      headline,
      subtitle: "Saiba mais sobre este destaque no CaféDebug.",
      imageUrl: normalizeUrl(image),
      imagePosition: "center",
      sourcePhotoUrl: normalizeUrl(image),
      primaryCta: null,
      secondaryCta: bannerLink
        ? {
            label: "Saber mais",
            action: "external-link",
            href: normalizeUrl(bannerLink)
          }
        : {
            label: "Saber mais",
            action: "disabled"
          },
      pencilSourceNodes: { dark: "runtime-api", light: "runtime-api" }
    };
  });
}
