import assert from "node:assert/strict";
import test from "node:test";

import {
  formatHtmlSourceForDisplay,
  isHtmlContentEmpty,
  syncEditorFromHtmlSource
} from "../src/features/episodes/services/episode-show-notes-serialization.ts";

test("isHtmlContentEmpty handles whitespace and tiptap empty paragraph", () => {
  assert.equal(isHtmlContentEmpty(""), true);
  assert.equal(isHtmlContentEmpty("   "), true);
  assert.equal(isHtmlContentEmpty("<p></p>"), true);
  assert.equal(isHtmlContentEmpty("<p>Hello</p>"), false);
});

test("syncEditorFromHtmlSource applies source HTML with canonicalization-friendly setContent call", () => {
  const calls = [];
  let canonical = "<p></p>";

  const editor = {
    commands: {
      setContent(nextHtml, emitUpdate) {
        calls.push([nextHtml, emitUpdate]);
        canonical = nextHtml.trim().length === 0 ? "<p></p>" : `<p>${nextHtml.trim()}</p>`;
      }
    },
    getHTML() {
      return canonical;
    }
  };

  const canonicalHtml = syncEditorFromHtmlSource(editor, "  <strong>Hello</strong>  ");

  assert.deepEqual(calls, [["  <strong>Hello</strong>  ", { emitUpdate: false }]]);
  assert.equal(canonicalHtml, "<p><strong>Hello</strong></p>");
});

test("formatHtmlSourceForDisplay pretty prints html source", async () => {
  const formatted = await formatHtmlSourceForDisplay("<p>Hello <strong>World</strong></p><ul><li>A</li></ul>");

  assert.equal(typeof formatted, "string");
  assert.ok(formatted.includes("\n"));
  assert.ok(formatted.includes("<strong>World</strong>"));
});
