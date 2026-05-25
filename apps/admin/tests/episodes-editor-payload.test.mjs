import assert from "node:assert/strict";
import test from "node:test";

import { toEpisodeRequestPayload } from "../src/features/episodes/transformers.ts";

test("toEpisodeRequestPayload maps publish action to published status and publishedAt", () => {
  const payload = toEpisodeRequestPayload({
    action: "publish",
    values: {
      title: "  Episode 42  ",
      shortDescription: "  Summary  ",
      description: "  Long body  ",
      url: "https://example.com/episode.mp3",
      imageUrl: "https://example.com/cover.jpg",
      tags: "react, architecture, react",
      publishedAt: "",
      number: "42",
      categoryId: "7"
    }
  });

  assert.equal(payload.title, "Episode 42");
  assert.equal(payload.status, "published");
  assert.deepEqual(payload.tags, ["react", "architecture"]);
  assert.equal(payload.number, 42);
  assert.equal(payload.categoryId, 7);
  assert.match(payload.publishedAt ?? "", /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  assert.equal(payload.publishedAt?.endsWith("Z"), false);
});

test("toEpisodeRequestPayload normalizes publish datetime to seconds precision", () => {
  const payload = toEpisodeRequestPayload({
    action: "publish",
    values: {
      title: "Episode publish",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "2017-10-07T00:00",
      number: "",
      categoryId: ""
    }
  });

  assert.equal(payload.publishedAt, "2017-10-07T00:00:00");
  assert.equal(payload.status, "published");
});

test("toEpisodeRequestPayload preserves explicit seconds for publish datetime", () => {
  const payload = toEpisodeRequestPayload({
    action: "publish",
    values: {
      title: "Episode publish",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "2020-02-07T05:30:01",
      number: "",
      categoryId: ""
    }
  });

  assert.equal(payload.publishedAt, "2020-02-07T05:30:01");
});

test("toEpisodeRequestPayload strips timezone suffix while preserving clock components", () => {
  const payload = toEpisodeRequestPayload({
    action: "publish",
    values: {
      title: "Episode publish",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "2020-02-07T05:30:01Z",
      number: "",
      categoryId: ""
    }
  });

  assert.equal(payload.publishedAt, "2020-02-07T05:30:01");
});

test("toEpisodeRequestPayload maps draft action to status draft and includes publishedAt", () => {
  const payload = toEpisodeRequestPayload({
    action: "save-draft",
    values: {
      title: "Episode draft",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "2026-03-29T18:00",
      number: "",
      categoryId: ""
    }
  });

  assert.equal(payload.status, "draft");
  assert.equal(payload.publishedAt, "2026-03-29T18:00:00");
  assert.equal(payload.number, undefined);
  assert.equal(payload.categoryId, undefined);
  assert.equal(payload.tags, undefined);
});

test("toEpisodeRequestPayload maps archive action to status archived and includes publishedAt", () => {
  const payload = toEpisodeRequestPayload({
    action: "archive",
    values: {
      title: "Episode archive",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "2027-01-01T08:30",
      number: "",
      categoryId: ""
    }
  });

  assert.equal(payload.status, "archived");
  assert.equal(payload.publishedAt, "2027-01-01T08:30:00");
});

test("toEpisodeRequestPayload always includes publishedAt when datetime is empty", () => {
  const payload = toEpisodeRequestPayload({
    action: "save-draft",
    values: {
      title: "Episode draft",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "",
      number: "",
      categoryId: ""
    }
  });

  assert.equal(payload.status, "draft");
  assert.match(payload.publishedAt ?? "", /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  assert.equal(payload.publishedAt?.endsWith("Z"), false);
});
