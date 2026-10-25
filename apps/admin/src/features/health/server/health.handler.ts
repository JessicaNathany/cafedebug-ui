import { adminRuntimeEnv } from "@/lib/env";
import { checkAdminApiReadiness } from "./readiness-probe";

const noStoreHeaders = {
  "cache-control": "no-store",
};

type HealthDependencies = {
  apiBaseUrl?: string;
  fetchImpl?: typeof fetch;
};

const unavailableResponse = (): Response =>
  Response.json(
    { status: "unavailable" },
    { headers: noStoreHeaders, status: 503 },
  );

export const healthHandler = async ({
  apiBaseUrl = adminRuntimeEnv.apiBaseUrl,
  fetchImpl = fetch,
}: HealthDependencies = {}): Promise<Response> => {
  if (!apiBaseUrl) {
    return unavailableResponse();
  }

  const isReady = await checkAdminApiReadiness({ apiBaseUrl, fetchImpl });

  if (!isReady) {
    return unavailableResponse();
  }

  return Response.json({ status: "ok" }, { headers: noStoreHeaders });
};
