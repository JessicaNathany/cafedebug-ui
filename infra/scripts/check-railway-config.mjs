import assert from "node:assert/strict";
import { createRailwayContext, project } from "railway/iac";
import config, { partial } from "../../.railway/railway.ts";

assert.equal(partial, "ui");
const definition = await config(createRailwayContext({ environment: "production" }), project);
assert.equal(definition.name, "cafedebug-backend.api-railway");
assert.deepEqual(definition.resources.map((resource) => resource.address).sort(), ["service.admin", "service.web"]);
for (const resource of definition.resources) {
  assert.equal(resource.type, "service");
  assert.equal(resource.source.repo, "JessicaNathany/cafedebug-ui");
  assert.equal(resource.source.branch, "main");
  assert.equal(resource.source.checkSuites, true);
  assert.equal(resource.build.dockerfilePath, `infra/docker/${resource.name}/Dockerfile`);
  assert.equal(resource.deploy.healthcheckPath, "/api/health");
  assert.equal(resource.deploy.healthcheckTimeout, 120);
  assert.deepEqual(resource.deploy.multiRegionConfig, { ams: { numReplicas: 1 } });
  assert.equal(resource.deploy.restartPolicyType, "ON_FAILURE");
  assert.equal(resource.deploy.sleepApplication, false);
  assert.equal(resource.deploy.overlapSeconds, 20);
  assert.equal(resource.deploy.drainingSeconds, 30);
  assert.equal(resource.volumeMounts, undefined);
}
const web = definition.resources.find((resource) => resource.name === "web");
const admin = definition.resources.find((resource) => resource.name === "admin");
assert.deepEqual(Object.keys(web.variables), ["NEXT_PUBLIC_SITE_URL"]);
assert.equal(web.variables.NEXT_PUBLIC_SITE_URL.value, "https://${{RAILWAY_PUBLIC_DOMAIN}}");
assert.deepEqual(Object.keys(admin.variables).sort(), ["ADMIN_API_BASE_URL", "ADMIN_COOKIE_SAMESITE", "ADMIN_COOKIE_SECURE"]);
assert.equal(admin.variables.ADMIN_API_BASE_URL.value, "http://${{cafedebug-backendapi.RAILWAY_PRIVATE_DOMAIN}}:8080");
assert.equal(admin.variables.ADMIN_COOKIE_SECURE.value, "true");
assert.equal(admin.variables.ADMIN_COOKIE_SAMESITE.value, "Lax");
console.log("Railway ui partial: exactly web/admin; frontend deployment contracts verified.");
