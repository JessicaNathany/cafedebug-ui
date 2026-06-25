import assert from "node:assert/strict";
import test from "node:test";

import {
  parseBannerActive,
  parseBannerImageUploadResult,
  parseBannerMutationResult,
  parseBannerRecord
} from "../src/features/banners/parsers.ts";
import { resolveBannerEditorPageState } from "../src/features/banners/banner-editor-state.ts";
import {
  toBackendDateTimeValue,
  toBannerEditorDefaults,
  toBannerRequestPayload
} from "../src/features/banners/transformers.ts";

test("toBannerRequestPayload maps draft create payload and omits order", () => {
  const payload = toBannerRequestPayload({
    mode: "new",
    action: "save-draft",
    values: {
      name: "  Spring Launch  ",
      urlImage: "",
      url: "   ",
      startDate: "2026-03-29T18:00",
      endDate: ""
    }
  });

  assert.equal(payload.name, "Spring Launch");
  assert.equal(payload.active, false);
  assert.equal(payload.url, null);
  assert.equal(payload.urlImage, null);
  assert.equal(payload.startDate, toBackendDateTimeValue("2026-03-29T18:00"));
  assert.equal(payload.endDate, null);
  assert.equal(payload.order, undefined);
});

test("toBannerRequestPayload maps publish update payload and preserves order", () => {
  const payload = toBannerRequestPayload({
    mode: "edit",
    action: "publish",
    existingBanner: { order: 7 },
    values: {
      name: "Published banner",
      urlImage: "https://example.com/banner.jpg",
      url: "https://cafedebug.com.br/sponsor",
      startDate: "2026-03-29T18:00",
      endDate: "2026-03-31T09:30"
    }
  });

  assert.equal(payload.active, true);
  assert.equal(payload.order, 7);
  assert.equal(payload.urlImage, "https://example.com/banner.jpg");
  assert.equal(payload.url, "https://cafedebug.com.br/sponsor");
  assert.equal(payload.endDate, toBackendDateTimeValue("2026-03-31T09:30"));
});

test("toBannerEditorDefaults hydrates datetime-local values from normalized detail data", () => {
  const startDate = toBackendDateTimeValue("2026-03-29T18:00");
  const endDate = toBackendDateTimeValue("2026-03-31T09:30");

  const defaults = toBannerEditorDefaults({
    id: 9,
    name: "Homepage sponsor",
    urlImage: "https://example.com/banner.jpg",
    url: "https://example.com",
    startDate,
    endDate,
    active: true,
    order: 4
  });

  assert.equal(defaults.startDate, "2026-03-29T18:00");
  assert.equal(defaults.endDate, "2026-03-31T09:30");
});

test("parseBannerRecord normalizes nullable fields and string active values", () => {
  const banner = parseBannerRecord({
    id: 12,
    name: "  Autumn Campaign  ",
    urlImage: null,
    url: "   ",
    startDate: "2026-03-29T21:00:00.000Z",
    endDate: null,
    active: "true",
    order: 9
  });

  assert.deepEqual(banner, {
    id: 12,
    name: "Autumn Campaign",
    urlImage: "",
    url: "",
    startDate: "2026-03-29T21:00:00.000Z",
    endDate: "",
    active: true,
    order: 9
  });
});

test("parseBannerMutationResult handles create Result and update BannerResponse payloads", () => {
  assert.deepEqual(parseBannerMutationResult({ isSuccess: true }), {});

  assert.deepEqual(
    parseBannerMutationResult({
      id: 15,
      name: "Updated",
      active: "false",
      order: 3
    }),
    {
      id: 15,
      active: false,
      order: 3
    }
  );
});

test("parseBannerImageUploadResult reads the uploaded image URL from route responses", () => {
  assert.deepEqual(
    parseBannerImageUploadResult({
      data: {
        imageUrl: "https://cdn.example.com/banners/hero.jpg"
      }
    }),
    {
      imageUrl: "https://cdn.example.com/banners/hero.jpg"
    }
  );
});

test("parseBannerActive recognizes backend string variants", () => {
  assert.equal(parseBannerActive("published"), true);
  assert.equal(parseBannerActive("draft"), false);
  assert.equal(parseBannerActive(null), false);
});

test("banner editor page state resolver covers key screen states", () => {
  assert.equal(
    resolveBannerEditorPageState({
      isInvalidBannerId: true,
      isLoading: true,
      loadError: {
        status: 400,
        title: "Bad Request",
        detail: "Invalid banner id."
      }
    }),
    "invalid-id"
  );

  assert.equal(
    resolveBannerEditorPageState({
      isInvalidBannerId: false,
      isLoading: true,
      loadError: null
    }),
    "loading"
  );

  assert.equal(
    resolveBannerEditorPageState({
      isInvalidBannerId: false,
      isLoading: false,
      loadError: {
        status: 503,
        title: "Service Unavailable",
        detail: "Unable to load this banner right now."
      }
    }),
    "fetch-error"
  );

  assert.equal(
    resolveBannerEditorPageState({
      isInvalidBannerId: false,
      isLoading: false,
      loadError: null
    }),
    "editor-ready"
  );
});
