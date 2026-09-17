const noStoreHeaders = {
  "cache-control": "no-store",
};

export const healthHandler = (): Response =>
  Response.json({ status: "ok" }, { headers: noStoreHeaders });
