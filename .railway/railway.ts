import { defineRailway, github, project, service } from "railway/iac";

export const partial = "ui";

const frontendDefaults = {
  healthcheck: "/api/health",
  healthcheckTimeout: 120,
  replicas: { ams: 1 },
  deploy: {
    drainingSeconds: 30,
    overlapSeconds: 20,
    restartPolicyType: "ON_FAILURE" as const,
    sleepApplication: false,
  },
};

export default defineRailway(() => {
  const web = service("web", {
    ...frontendDefaults,
    source: github("JessicaNathany/cafedebug-ui", {
      branch: "main",
      checkSuites: true,
    }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "infra/docker/web/Dockerfile",
      watchPatterns: [
        "/apps/web/**",
        "/packages/web-design-tokens/**",
        "/packages/tsconfig/**",
        "/packages/eslint-config/**",
        "/package.json",
        "/pnpm-lock.yaml",
        "/pnpm-workspace.yaml",
        "/turbo.json",
        "/infra/docker/web/Dockerfile",
        "/.dockerignore",
      ],
    },
    networking: { privateNetworkEndpoint: "web" },
    env: {
      NEXT_PUBLIC_SITE_URL: "https://${{RAILWAY_PUBLIC_DOMAIN}}",
      WEB_API_BASE_URL: "https://cafedebug-backendapi-production.up.railway.app",
    },
  });
  const admin = service("admin", {
    ...frontendDefaults,
    source: github("JessicaNathany/cafedebug-ui", {
      branch: "main",
      checkSuites: true,
    }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "infra/docker/admin/Dockerfile",
      watchPatterns: [
        "/apps/admin/**",
        "/packages/admin-design-tokens/**",
        "/packages/api-client/**",
        "/packages/tsconfig/**",
        "/packages/eslint-config/**",
        "/package.json",
        "/pnpm-lock.yaml",
        "/pnpm-workspace.yaml",
        "/turbo.json",
        "/infra/docker/admin/Dockerfile",
        "/.dockerignore",
      ],
    },
    networking: { privateNetworkEndpoint: "admin" },
    env: {
      ADMIN_API_BASE_URL:
        "http://${{cafedebug-backend.api.RAILWAY_PRIVATE_DOMAIN}}:8080",
      ADMIN_COOKIE_SAMESITE: "Lax",
      ADMIN_COOKIE_SECURE: "true",
    },
  });

  return project("cafedebug-backend.api-railway", {
    resources: [web, admin],
  });
});
