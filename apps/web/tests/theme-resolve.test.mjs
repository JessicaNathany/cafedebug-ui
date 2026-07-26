import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

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

test("the client theme provider preserves the server-resolved preference", () => {
  const layoutSource = readSource("src/app/layout.tsx");
  const providersSource = readSource("src/app/providers.tsx");
  const themeProviderSource = readSource("src/components/theme-provider.tsx");

  assert.match(layoutSource, /<Providers initialTheme=\{theme\}>/);
  assert.match(providersSource, /initialTheme: ThemePref/);
  assert.match(providersSource, /<ThemeProvider initialTheme=\{initialTheme\}>/);
  assert.match(themeProviderSource, /initialTheme: ThemePref/);
  assert.match(themeProviderSource, /defaultTheme=\{initialTheme\}/);
});
