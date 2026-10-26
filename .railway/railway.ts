import {
  defineRailway,
  github,
  mysql,
  preserve,
  project,
  service,
  volume,
} from "railway/iac";

export default defineRailway(() => {
  const cafedebugdb = mysql("cafedebugdb", { region: "ams" });
  cafedebugdb.deploy = {
    startCommand:
      "docker-entrypoint.sh mysqld --innodb-use-native-aio=0 --disable-log-bin --performance_schema=0 --innodb-buffer-pool-size=1G",
  };
  cafedebugdb.networking = {
    privateNetworkEndpoint: "mysql-1647",
    tcpProxies: { "3306": {} },
  };
  const mysqlVolumeUzLX = volume("mysql-volume-uzLX", {
    alerts: { usage: { "100": {}, "80": {}, "95": {} } },
    allowOnlineResize: true,
    region: "ams",
    sizeMB: 500,
  });
  const mysqlVolumeR7X = volume("mysql-volume-r-7X", {
    alerts: { usage: { "100": {}, "80": {}, "95": {} } },
    allowOnlineResize: true,
    region: "ams",
    sizeMB: 500,
  });
  const cafedebugBackendApi = service("cafedebug-backend.api", {
    source: github("JessicaNathany/cafedebug-backend.api", {
      checkSuites: true,
    }),
    healthcheck: "/health/ready",
    healthcheckTimeout: 300,
    replicas: { ams: 1 },
    networking: { privateNetworkEndpoint: "cafedebug-backendapi" },
    env: {
      ASPNETCORE_ENVIRONMENT: preserve(),
      ConnectionStrings__CafedebugConnectionStringMySQL: preserve(),
      HealthChecksUI__EvaluationTimeInSeconds: preserve(),
      HealthChecksUI__HealthChecks__0__Name: preserve(),
      HealthChecksUI__HealthChecks__0__Uri: preserve(),
      HealthChecksUI__HealthChecks__0__WithEnvironmentName: preserve(),
      HealthChecksUI__MinimumSecondsBetweenFailureNotifications: preserve(),
      JwtSettings__Audience: preserve(),
      JwtSettings__Issuer: preserve(),
      JwtSettings__RefreshTokenValidForMinutes: preserve(),
      JwtSettings__SigningKey: preserve(),
      JwtSettings__ValidForMinutes: preserve(),
      Logging__Console__LogLevel__Default: preserve(),
      Logging__LogLevel__Default: preserve(),
      "Logging__LogLevel__Microsoft.AspNetCore": preserve(),
      PORT: preserve(),
      SMTP_FROM_EMAIL: preserve(),
      SMTP_PASSWORD: preserve(),
      SMTP_PORT: preserve(),
      SMTP_SERVER: preserve(),
      SMTP_USERNAME: preserve(),
      Serilog__Enrich__0: preserve(),
      Serilog__Enrich__1: preserve(),
      Serilog__Enrich__2: preserve(),
      Serilog__Enrich__3: preserve(),
      Serilog__MinimumLevel__Default: preserve(),
      Serilog__MinimumLevel__Override__HealthChecks: preserve(),
      Serilog__MinimumLevel__Override__Microsoft: preserve(),
      "Serilog__MinimumLevel__Override__Microsoft.AspNetCore.Authentication":
        preserve(),
      "Serilog__MinimumLevel__Override__Microsoft.AspNetCore.Diagnostics.HealthChecks":
        preserve(),
      "Serilog__MinimumLevel__Override__Microsoft.EntityFrameworkCore.Database.Command":
        preserve(),
      "Serilog__MinimumLevel__Override__Microsoft.Hosting.Lifetime": preserve(),
      Serilog__MinimumLevel__Override__System: preserve(),
      Serilog__Properties__Application: preserve(),
      Serilog__Using__0: preserve(),
      Serilog__WriteTo__0__Args__outputTemplate: preserve(),
      Serilog__WriteTo__0__Name: preserve(),
      Storage__AWS__S3__BaseUrl: preserve(),
      Storage__AWS__S3__Bucket: preserve(),
      Storage__AWS__S3__ForcePathStyle: preserve(),
      Storage__AWS__S3__Region: preserve(),
      Storage__AWS__S3__ServiceUrl: preserve(),
      Storage__AWS__S3__UseHttp: preserve(),
    },
  });
  const web = service("web", {
    source: github("JessicaNathany/cafedebug-ui", { checkSuites: true }),
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
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
    replicas: { ams: 1 },
    networking: { privateNetworkEndpoint: "web" },
    deploy: {
      drainingSeconds: 30,
      overlapSeconds: 20,
      restartPolicyType: "ON_FAILURE",
      sleepApplication: false,
    },
    env: {
      NEXT_PUBLIC_SITE_URL: "https://${{RAILWAY_PUBLIC_DOMAIN}}",
    },
  });
  const admin = service("admin", {
    source: github("JessicaNathany/cafedebug-ui", { checkSuites: true }),
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
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
    replicas: { ams: 1 },
    networking: { privateNetworkEndpoint: "admin" },
    deploy: {
      drainingSeconds: 30,
      overlapSeconds: 20,
      restartPolicyType: "ON_FAILURE",
      sleepApplication: false,
    },
    env: {
      ADMIN_API_BASE_URL:
        "http://${{cafedebug-backendapi.RAILWAY_PRIVATE_DOMAIN}}:8080",
      ADMIN_COOKIE_SAMESITE: "Lax",
      ADMIN_COOKIE_SECURE: "true",
    },
  });

  return project("cafedebug-backend.api-railway", {
    resources: [
      cafedebugdb,
      cafedebugBackendApi,
      web,
      admin,
      mysqlVolumeUzLX,
      mysqlVolumeR7X,
    ],
  });
});
