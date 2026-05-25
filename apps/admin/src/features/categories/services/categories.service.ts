"use client";

import { fetchProtectedAdminRoute } from "@/lib/api/protected-route-fetch.js";

import type { CategoryRecord } from "../types/category.types";

type AdminRouteError = {
  status: number;
  title: string;
  detail: string;
  traceId?: string;
};

type ApiEnvelope<TData> =
  | {
      ok: true;
      data: TData;
      traceId?: string;
    }
  | {
      ok: false;
      error: AdminRouteError;
    };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseJson = async <TData>(response: Response): Promise<TData | undefined> => {
  try {
    return (await response.json()) as TData;
  } catch {
    return undefined;
  }
};

const toRouteError = (
  payload: unknown,
  fallbackStatus: number
): AdminRouteError => {
  if (isRecord(payload) && isRecord(payload.error)) {
    const error = payload.error;

    return {
      status:
        typeof error.status === "number" ? error.status : fallbackStatus,
      title:
        typeof error.title === "string" && error.title.trim().length > 0
          ? error.title
          : "Request Failed",
      detail:
        typeof error.detail === "string" && error.detail.trim().length > 0
          ? error.detail
          : "Request failed.",
      ...(typeof error.traceId === "string" && error.traceId.trim().length > 0
        ? { traceId: error.traceId }
        : {})
    };
  }

  return {
    status: fallbackStatus,
    title: "Request Failed",
    detail: "Unable to complete the request."
  };
};

const fetchCategoriesApi = async <TData>(
  input: string | URL,
  init?: RequestInit
): Promise<ApiEnvelope<TData>> => {
  const response = await fetchProtectedAdminRoute(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await parseJson<unknown>(response);

  if (!response.ok) {
    return {
      ok: false,
      error: toRouteError(payload, response.status)
    };
  }

  const envelope = payload as
    | {
        data?: TData;
        traceId?: string;
      }
    | undefined;

  return {
    ok: true,
    data: (envelope?.data as TData) ?? ({} as TData),
    ...(typeof envelope?.traceId === "string" ? { traceId: envelope.traceId } : {})
  };
};

const parseCategoryList = (source: unknown): CategoryRecord[] => {
  const payload = isRecord(source) ? source : {};
  const itemsSource = payload.items;

  if (!Array.isArray(itemsSource)) {
    return [];
  }

  const categories: CategoryRecord[] = [];

  for (const entry of itemsSource) {
    if (!isRecord(entry)) continue;

    const id = entry.id;
    const name = entry.name;

    if (typeof id !== "number" || !Number.isInteger(id)) continue;
    if (typeof name !== "string" || name.trim().length === 0) continue;

    categories.push({ id, name });
  }

  return categories;
};

export const categoriesQueryKeys = Object.freeze({
  all: ["categories"] as const
});

export const fetchCategoriesList = async (): Promise<CategoryRecord[]> => {
  const response = await fetchCategoriesApi<unknown>(
    "/api/admin/categories?page=1&pageSize=100"
  );

  if (!response.ok) {
    throw response.error;
  }

  return parseCategoryList(response.data);
};
