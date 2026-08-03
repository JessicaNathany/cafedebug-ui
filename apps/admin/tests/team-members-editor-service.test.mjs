import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const srcRoot = new URL("../src/", import.meta.url);
const resolveImport = (specifier, sourceUrl) => {
  if (specifier.startsWith("@/")) {
    const candidate = fileURLToPath(new URL(specifier.slice(2), srcRoot));
    for (const path of [`${candidate}.ts`, `${candidate}.tsx`, `${candidate}.js`, `${candidate}/index.ts`, candidate]) if (existsSync(path)) return pathToFileURL(path).href;
  }
  if (specifier.startsWith(".")) {
    const candidate = fileURLToPath(new URL(specifier, sourceUrl));
    for (const path of [`${candidate}.ts`, `${candidate}.tsx`, `${candidate}.js`, `${candidate}/index.ts`, candidate]) if (existsSync(path)) return pathToFileURL(path).href;
  }
  if (specifier === "next/server") return pathToFileURL(fileURLToPath(new URL("../node_modules/next/server.js", import.meta.url))).href;
  return import.meta.resolve(specifier);
};
const loadTsModule = async (relativePath) => {
  const sourceUrl = new URL(`../src/${relativePath}`, import.meta.url);
  let source = await readFile(sourceUrl, "utf8");
  source = source.replace(/from\s+(["'])([^"']+)(["'])/g, (_match, quote, specifier) => `from ${quote}${resolveImport(specifier, sourceUrl)}${quote}`);
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
};

const record = { id: 4, name: "Jessica", podcastRole: "Host", isActive: true };

test("browser service sends only protected internal editor endpoints and parses canonical records", async () => {
  const service = await loadTsModule("features/team-members/services/team-members.service.ts");
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    calls.push({ input: String(input), init });
    return new Response(JSON.stringify({ ok: true, data: record }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    assert.equal((await service.fetchTeamMemberById(4)).id, 4);
    await service.createTeamMember({ name: "Jessica", podcastRole: "Host", nickname: null, email: null, bio: null, jobTitle: null, gitHubUrl: null, linkedInUrl: null, profilePhotoUrl: null, joinedAt: null, isActive: true });
    await service.updateTeamMember({ id: 4, payload: { name: "Jessica", podcastRole: "Host", nickname: null, email: null, bio: null, jobTitle: null, gitHubUrl: null, linkedInUrl: null, profilePhotoUrl: null, joinedAt: null, isActive: false } });
    assert.deepEqual(calls.map((call) => [call.input, call.init?.method ?? "GET"]), [["/api/admin/team-members/4", "GET"], ["/api/admin/team-members", "POST"], ["/api/admin/team-members/4", "PUT"]]);
    assert.equal(JSON.parse(calls[1].init.body).isActive, true);
  } finally { globalThis.fetch = originalFetch; }
});

test("browser service turns route-safe failures into typed errors without backend URLs", async () => {
  const service = await loadTsModule("features/team-members/services/team-members.service.ts");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: false, error: { status: 403, title: "Forbidden", detail: "No access", traceId: "trace-1" } }), { status: 403, headers: { "content-type": "application/json" } });
  try { await assert.rejects(() => service.fetchTeamMemberById(4), (error) => error.status === 403 && error.traceId === "trace-1"); } finally { globalThis.fetch = originalFetch; }
});
