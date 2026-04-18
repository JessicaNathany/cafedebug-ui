import { NextResponse } from "next/server";

import { appendSetCookieHeaders } from "@/lib/auth/next-response-cookies";

export const createImagesErrorResponse = ({
  status,
  title,
  detail,
  traceId,
  setCookieHeaders
}: {
  status: number;
  title: string;
  detail: string;
  traceId?: string;
  setCookieHeaders: string[];
}) => {
  const response = NextResponse.json(
    {
      ok: false,
      error: {
        status,
        title,
        detail,
        ...(traceId ? { traceId } : {})
      }
    },
    { status }
  );

  appendSetCookieHeaders(response, setCookieHeaders);

  return response;
};
