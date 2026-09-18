const readinessPath = "/health/ready";
const requestTimeoutMilliseconds = 3_000;

type FetchImplementation = typeof fetch;

const toReadinessUrl = (apiBaseUrl: string): string =>
  `${apiBaseUrl.replace(/\/$/, "")}${readinessPath}`;

export const checkAdminApiReadiness = async ({
  apiBaseUrl,
  fetchImpl = fetch,
}: {
  apiBaseUrl: string;
  fetchImpl?: FetchImplementation;
}): Promise<boolean> => {
  try {
    const readinessResponse = await fetchImpl(toReadinessUrl(apiBaseUrl), {
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });

    return readinessResponse.ok;
  } catch {
    return false;
  }
};
