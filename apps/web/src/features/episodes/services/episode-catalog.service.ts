import { normalizeEpisodeSearchText } from "../episode-list-query";
import { getMockEpisodeDetailContent } from "../mock/episode-details.mock";
import { mockEpisodes } from "../mock/episodes.mock";
import { episodeCollectionSchema, episodeDetailSchema, episodeListQuerySchema, episodeListResultSchema } from "../schemas";
import { getEpisodeCategoryLabel } from "../types";
import type { Episode, EpisodeDetail, EpisodeListActiveQuery, EpisodeListQuery, EpisodeListResult, EpisodeSort } from "../types";

export const EPISODE_LIST_PAGE_SIZE = 6 as const;

export type EpisodeCatalog = {
  list(query: EpisodeListQuery): Promise<EpisodeListResult>;
  listAll(): Promise<Episode[]>;
  getDetailBySlug(slug: string): Promise<EpisodeDetail | null>;
  getBySlug(slug: string): Promise<Episode | null>;
};

export type MockEpisodeCatalogOptions = {
  fixtures?: readonly unknown[];
};

function orderEpisodes(episodes: Episode[], sort: EpisodeSort = "recentes"): Episode[] {
  return [...episodes].sort((left, right) => {
    const publishedAtDifference = left.publishedAt.localeCompare(right.publishedAt);
    const numberDifference = left.number - right.number;
    const comparison = publishedAtDifference !== 0 ? publishedAtDifference : numberDifference;
    return sort === "antigos" ? comparison : -comparison;
  });
}

function matchesSearch(episode: Episode, query: string): boolean {
  const normalizedQuery = normalizeEpisodeSearchText(query);
  const fields = [
    episode.title,
    episode.summary,
    episode.guestName,
    episode.category,
    episode.categoryKey,
    getEpisodeCategoryLabel(episode.categoryKey)
  ];

  return fields.some((field) => normalizeEpisodeSearchText(field).includes(normalizedQuery));
}

export function createMockEpisodeCatalog(options: MockEpisodeCatalogOptions = {}): EpisodeCatalog {
  const fixtureSource = options.fixtures ?? mockEpisodes;

  async function listAll(): Promise<Episode[]> {
    return orderEpisodes(episodeCollectionSchema.parse(fixtureSource));
  }

  return {
    async list(query: EpisodeListQuery): Promise<EpisodeListResult> {
      const parsedQuery = episodeListQuerySchema.parse(query);
      const episodes = orderEpisodes(await listAll(), parsedQuery.sort);
      const filteredEpisodes = episodes.filter((episode) => {
        const matchesCategory = parsedQuery.category === undefined || episode.categoryKey === parsedQuery.category;
        const matchesQuery = parsedQuery.q === undefined || matchesSearch(episode, parsedQuery.q);
        return matchesCategory && matchesQuery;
      });
      const totalItems = filteredEpisodes.length;
      const totalPages = Math.ceil(totalItems / EPISODE_LIST_PAGE_SIZE);
      const start = (parsedQuery.page - 1) * EPISODE_LIST_PAGE_SIZE;
      const activeQuery: EpisodeListActiveQuery = {};
      if (parsedQuery.q !== undefined) {
        activeQuery.q = parsedQuery.q;
      }
      if (parsedQuery.category !== undefined) {
        activeQuery.category = parsedQuery.category;
      }
      if (parsedQuery.sort !== undefined) {
        activeQuery.sort = parsedQuery.sort;
      }
      const result: EpisodeListResult = {
        items: filteredEpisodes.slice(start, start + EPISODE_LIST_PAGE_SIZE),
        totalItems,
        totalPages,
        page: parsedQuery.page,
        pageSize: EPISODE_LIST_PAGE_SIZE,
        activeQuery
      };

      return episodeListResultSchema.parse(result) as EpisodeListResult;
    },
    listAll,
    async getBySlug(slug: string): Promise<Episode | null> {
      const episodes = await listAll();
      return episodes.find((episode) => episode.slug === slug) ?? null;
    },
    async getDetailBySlug(slug: string): Promise<EpisodeDetail | null> {
      const episode = await this.getBySlug(slug);

      if (!episode) {
        return null;
      }

      return episodeDetailSchema.parse({
        content: getMockEpisodeDetailContent(episode),
        episode
      }) as EpisodeDetail;
    }
  };
}

export const mockEpisodeCatalog = createMockEpisodeCatalog();
