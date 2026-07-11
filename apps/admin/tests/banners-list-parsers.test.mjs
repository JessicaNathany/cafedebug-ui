import assert from "node:assert/strict";
import test from "node:test";

import { parseBannersPageData } from "../src/features/banners/parsers.ts";

test("parseBannersPageData normalizes a paged banner collection from unknown backend shape", () => {
  const page = parseBannersPageData(
    {
      data: {
        items: [
          {
            id: 11,
            name: "  Homepage Hero  ",
            active: "published",
            order: 2,
            startDate: "2026-06-01T00:00:00Z",
            endDate: null,
            updateDate: "2026-06-02T00:00:00Z"
          },
          {
            name: "",
            active: "draft",
            order: null,
            startDate: null,
            endDate: null
          }
        ],
        page: 2,
        pageSize: 5,
        totalCount: 9,
        pageCount: 2,
        hasPrevious: true,
        hasNext: false
      }
    },
    {
      page: 1,
      pageSize: 5,
      sortBy: "order",
      descending: false
    }
  );

  assert.equal(page.page, 2);
  assert.equal(page.pageSize, 5);
  assert.equal(page.totalCount, 9);
  assert.equal(page.pageCount, 2);
  assert.equal(page.hasPrevious, true);
  assert.equal(page.hasNext, false);
  assert.deepEqual(page.items, [
    {
      id: 11,
      name: "Homepage Hero",
      urlImage: "",
      url: "",
      startDate: "2026-06-01T00:00:00Z",
      endDate: "",
      updateDate: "2026-06-02T00:00:00Z",
      active: true,
      order: 2
    },
    {
      id: null,
      name: "Banner",
      urlImage: "",
      url: "",
      startDate: "",
      endDate: "",
      updateDate: "",
      active: false,
      order: null
    }
  ]);
});
