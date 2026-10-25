import { healthHandler } from "@/features/health/server/health.handler";

export const dynamic = "force-dynamic";

export function GET(): Response {
  return healthHandler();
}
