import { healthHandler } from "@/features/health/server/health.handler";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return healthHandler();
}
