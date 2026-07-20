import assert from "node:assert/strict";
import test from "node:test";

const resolveThemePref = (value) => {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return "dark";
};

const resolveInitialThemeClass = (theme) => (theme === "light" ? "" : "dark");

test("resolve theme from cookie value", () => {
  assert.equal(resolveThemePref("light"), "light");
  assert.equal(resolveThemePref("dark"), "dark");
  assert.equal(resolveThemePref("system"), "system");
  assert.equal(resolveThemePref(undefined), "dark");
  assert.equal(resolveThemePref("invalid"), "dark");
});

test("resolve initial class from theme", () => {
  assert.equal(resolveInitialThemeClass("light"), "");
  assert.equal(resolveInitialThemeClass("dark"), "dark");
  assert.equal(resolveInitialThemeClass("system"), "dark");
});
