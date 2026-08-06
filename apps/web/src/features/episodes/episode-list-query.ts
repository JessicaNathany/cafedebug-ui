import { episodeListQuerySchema } from "./schemas";
import { isEpisodeCategoryKey, isEpisodeSort } from "./types";
import type {
  EpisodeCategoryKey,
  EpisodeListActiveQuery,
  EpisodeListQuery,
  EpisodeListUrlInput,
  EpisodeSort
} from "./types";

export type EpisodeListSearchParams = Record<string, string | string[] | undefined>;

export type EpisodeListQueryParseResult =
  | {
      status: "valid";
      query: EpisodeListQuery;
      requiresRedirect: boolean;
    }
  | {
      status: "not-found";
      reason: "unknown-category" | "unknown-sort" | "invalid-page";
    };

type NormalizedSearchParam = {
  value: string | undefined;
  requiresRedirect: boolean;
};

function normalizeSearchParam(value: string | string[] | undefined): NormalizedSearchParam {
  if (Array.isArray(value)) {
    return {
      value: value[0],
      requiresRedirect: true
    };
  }

  return {
    value,
    requiresRedirect: false
  };
}

export function normalizeEpisodeSearchText(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
}

export function normalizeEpisodeSearchQuery(value: string): string | undefined {
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length > 0 && normalized.length <= 100 ? normalized : undefined;
}

function toEpisodeListQuery(value: { q?: string | undefined; category?: EpisodeCategoryKey | undefined; sort?: EpisodeSort | undefined; page: number }): EpisodeListQuery {
  const query: EpisodeListQuery = { page: value.page };

  if (value.q !== undefined) {
    query.q = value.q;
  }

  if (value.category !== undefined) {
    query.category = value.category;
  }

  if (value.sort !== undefined) {
    query.sort = value.sort;
  }

  return query;
}

export function parseEpisodeListQuery(searchParams: EpisodeListSearchParams): EpisodeListQueryParseResult {
  const rawQuery = normalizeSearchParam(searchParams.q);
  const rawCategory = normalizeSearchParam(searchParams.categoria);
  const rawSort = normalizeSearchParam(searchParams.ordenar);
  const rawPage = normalizeSearchParam(searchParams.pagina);

  let requiresRedirect = rawQuery.requiresRedirect || rawCategory.requiresRedirect || rawSort.requiresRedirect || rawPage.requiresRedirect;
  const activeQuery: EpisodeListActiveQuery = {};

  if (rawQuery.value !== undefined) {
    const normalizedQuery = normalizeEpisodeSearchQuery(rawQuery.value);
    if (normalizedQuery === undefined) {
      requiresRedirect = true;
    } else {
      activeQuery.q = normalizedQuery;
      requiresRedirect ||= normalizedQuery !== rawQuery.value;
    }
  }

  if (rawCategory.value !== undefined) {
    const normalizedCategory = rawCategory.value.trim().toLocaleLowerCase("pt-BR");
    if (normalizedCategory.length === 0) {
      requiresRedirect = true;
    } else if (!isEpisodeCategoryKey(normalizedCategory)) {
      return { status: "not-found", reason: "unknown-category" };
    } else {
      activeQuery.category = normalizedCategory;
      requiresRedirect ||= normalizedCategory !== rawCategory.value;
    }
  }

  if (rawSort.value !== undefined) {
    const normalizedSort = rawSort.value.trim().toLocaleLowerCase("pt-BR");
    if (normalizedSort.length === 0 || normalizedSort === "recentes") {
      requiresRedirect = true;
    } else if (!isEpisodeSort(normalizedSort)) {
      return { status: "not-found", reason: "unknown-sort" };
    } else {
      activeQuery.sort = normalizedSort;
      requiresRedirect ||= normalizedSort !== rawSort.value;
    }
  }

  let page = 1;
  if (rawPage.value !== undefined) {
    const normalizedPage = rawPage.value.trim();
    if (normalizedPage.length === 0) {
      requiresRedirect = true;
    } else if (!/^\d+$/.test(normalizedPage)) {
      return { status: "not-found", reason: "invalid-page" };
    } else {
      page = Number(normalizedPage);
      if (!Number.isSafeInteger(page) || page < 1) {
        return { status: "not-found", reason: "invalid-page" };
      }

      requiresRedirect ||= normalizedPage !== rawPage.value || String(page) !== normalizedPage || page === 1;
    }
  }

  const parsedQuery = episodeListQuerySchema.parse({ ...activeQuery, page });
  return {
    status: "valid",
    query: toEpisodeListQuery(parsedQuery),
    requiresRedirect
  };
}

export function buildEpisodesUrl(query: EpisodeListUrlInput = {}): string {
  const normalizedQuery = query.q === undefined ? undefined : normalizeEpisodeSearchQuery(query.q);
  const normalizedCategory = query.category;
  const normalizedSort = query.sort;
  const page = query.page ?? 1;
  const parsedQuery = episodeListQuerySchema.parse({
    ...(normalizedQuery === undefined ? {} : { q: normalizedQuery }),
    ...(normalizedCategory === undefined ? {} : { category: normalizedCategory }),
    ...(normalizedSort === undefined ? {} : { sort: normalizedSort }),
    page
  });
  const searchParams = new URLSearchParams();

  if (parsedQuery.q !== undefined) {
    searchParams.set("q", parsedQuery.q);
  }

  if (parsedQuery.category !== undefined) {
    searchParams.set("categoria", parsedQuery.category as EpisodeCategoryKey);
  }

  if (parsedQuery.sort !== undefined) {
    searchParams.set("ordenar", parsedQuery.sort);
  }

  if (parsedQuery.page > 1) {
    searchParams.set("pagina", String(parsedQuery.page));
  }

  const serializedQuery = searchParams.toString();
  return serializedQuery.length > 0 ? `/episodes?${serializedQuery}` : "/episodes";
}
