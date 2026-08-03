import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const sentryMockUrl = `data:text/javascript;base64,${Buffer.from("export const addBreadcrumb=()=>{}; export const captureException=()=>{}; export const withScope=(callback)=>callback({setLevel(){},setTag(){},setContext(){}});").toString("base64")}`;
const extensions = [".ts", ".tsx", ".js", "/index.ts", "/index.js", ""];

const resolveLocalFile = (specifier, importer) => {
  const base = specifier.startsWith("@/")
    ? join(sourceRoot, specifier.slice(2))
    : join(dirname(importer), specifier);
  return extensions.map((extension) => `${base}${extension}`).find(existsSync);
};

const loadHandlerModule = async (relativePath) => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "team-members-editor-"));
  const outputBySource = new Map();

  const compile = async (sourcePath) => {
    const cached = outputBySource.get(sourcePath);
    if (cached) return cached;
    const outputPath = join(temporaryDirectory, `${createHash("sha1").update(sourcePath).digest("hex")}-${basename(sourcePath)}.mjs`);
    outputBySource.set(sourcePath, outputPath);
    let source = await readFile(sourcePath, "utf8");
    const imports = [...source.matchAll(/from\s+(["'])([^"']+)(["'])/g)];
    for (const match of imports.reverse()) {
      const specifier = match[2];
      const localPath = specifier.startsWith("@/") || specifier.startsWith(".")
        ? resolveLocalFile(specifier, sourcePath)
        : undefined;
      const resolved = localPath
        ? pathToFileURL(await compile(localPath)).href
        : specifier === "@sentry/nextjs"
          ? sentryMockUrl
          : specifier === "next/server"
          ? pathToFileURL(fileURLToPath(new URL("../node_modules/next/server.js", import.meta.url))).href
          : import.meta.resolve(specifier);
      source = `${source.slice(0, match.index)}from ${match[1]}${resolved}${match[3]}${source.slice(match.index + match[0].length)}`;
    }
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    await writeFile(outputPath, output);
    return outputPath;
  };

  const loadedModule = await import(pathToFileURL(await compile(join(sourceRoot, relativePath))).href);
  return { module: loadedModule, dispose: () => rm(temporaryDirectory, { recursive: true, force: true }) };
};

const success = (status, data = { id: 4, name: "Jessica", podcastRole: "Host" }) => ({ data, status, headers: new Headers(), setCookieHeaders: ["rotated=value; Path=/"], traceId: "trace-success" });
const failure = (status) => ({ error: { status, title: "Backend failure", detail: "Request was rejected." }, status, headers: new Headers(), setCookieHeaders: ["rotated=value; Path=/"], traceId: "trace-failure" });

test("create/detail/update handlers execute injected adapters with success envelopes", async () => {
  const [create, detail, update] = await Promise.all([loadHandlerModule("features/team-members/server/team-members-create.handler.ts"), loadHandlerModule("features/team-members/server/team-members-detail.handler.ts"), loadHandlerModule("features/team-members/server/team-members-update.handler.ts")]);
  try {
    const createCalls = [];
    const created = await create.module.teamMembersCreateHandler(new Request("http://test/api/admin/team-members", { method: "POST", headers: { cookie: "session=1", "content-type": "application/json" }, body: JSON.stringify({ name: "Jessica", podcastRole: "Host" }) }), { createTeamMemberInBackend: async (input) => { createCalls.push(input); return success(201); } });
    assert.equal(created.status, 201); assert.equal((await created.json()).ok, true); assert.equal(createCalls.length, 1); assert.match(created.headers.get("set-cookie") ?? "", /rotated=value/);
    const detailed = await detail.module.teamMembersDetailHandler(new Request("http://test/api/admin/team-members/4"), { params: Promise.resolve({ id: "4" }) }, { getTeamMemberFromBackend: async (input) => { assert.equal(input.id, 4); return success(200); } });
    assert.equal(detailed.status, 200);
    const updated = await update.module.teamMembersUpdateHandler(new Request("http://test/api/admin/team-members/4", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Jessica", podcastRole: "Host" }) }), { params: Promise.resolve({ id: "4" }) }, { updateTeamMemberInBackend: async (input) => { assert.equal(input.id, 4); return success(200); } });
    assert.equal(updated.status, 200);
  } finally { await Promise.all([create.dispose(), detail.dispose(), update.dispose()]); }
});

test("detail/update block malformed IDs and forward normalized backend errors", async () => {
  const [detail, update] = await Promise.all([loadHandlerModule("features/team-members/server/team-members-detail.handler.ts"), loadHandlerModule("features/team-members/server/team-members-update.handler.ts")]);
  try {
    let calls = 0;
    const invalid = await detail.module.teamMembersDetailHandler(new Request("http://test/api/admin/team-members/nope"), { params: Promise.resolve({ id: "nope" }) }, { getTeamMemberFromBackend: async () => { calls += 1; return success(200); } });
    assert.equal(invalid.status, 400); assert.equal(calls, 0);
    for (const status of [400, 401, 403, 404]) {
      const response = await update.module.teamMembersUpdateHandler(new Request("http://test/api/admin/team-members/4", { method: "PUT", body: "{}" }), { params: Promise.resolve({ id: "4" }) }, { updateTeamMemberInBackend: async () => failure(status) });
      const payload = await response.json(); assert.equal(response.status, status); assert.equal(payload.error.traceId, "trace-failure"); if (status === 401) assert.match(response.headers.get("set-cookie") ?? "", /cafedebug_admin_session/); else assert.match(response.headers.get("set-cookie") ?? "", /rotated=value/);
    }
  } finally { await Promise.all([detail.dispose(), update.dispose()]); }
});

test("unexpected adapter failure becomes a route-safe 503", async () => {
  const create = await loadHandlerModule("features/team-members/server/team-members-create.handler.ts");
  try {
    const response = await create.module.teamMembersCreateHandler(new Request("http://test/api/admin/team-members", { method: "POST", body: "{}" }), { createTeamMemberInBackend: async () => { throw new Error("transport unavailable"); } });
    assert.equal(response.status, 503); assert.equal((await response.json()).error.status, 503);
  } finally { await create.dispose(); }
});
