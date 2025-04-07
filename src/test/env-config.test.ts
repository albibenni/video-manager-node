import { vi, describe, afterAll, beforeEach, it, expect } from "vitest";
import config from "../config/env-config.js";
import dotenv from "dotenv";

describe("file-ingestion", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });
  afterAll(() => {});

  it("env config db", () => {
    expect(process.env.POSTGRES_USER).toBe(config.db.user);
    expect(process.env.POSTGRES_PASSWORD).toBe(config.db.password);
    expect(process.env.POSTGRES_DB).toBe(config.db.database);
    expect(process.env.POSTGRES_HOST).toBe(config.db.host);
    expect(process.env.POSTGRES_PORT).toBe(config.db.port.toString());
    expect(process.env.DB_URL).toBe(config.db.url);
  });

  it("env config minio", () => {
    expect(process.env.MINIO_ROOT_USER).toBe(config.minio.root_user);
    expect(process.env.MINIO_ROOT_PASSWORD).toBe(config.minio.root_password);
    expect(process.env.MINIO_PORT).toBe(config.minio.port.toString());
    expect(process.env.MINIO_ADMIN_PORT).toBe(
      config.minio.admin_port.toString(),
    );
  });

  it("env config aws", () => {
    expect(process.env.AWS_ENDPOINT).toBe(config.aws.endpoint);
    expect(process.env.AWS_S3_BUCKET).toBe(config.aws.bucket);
    //expect(process.env.AWS_REGION).toBe(config.aws.region);
    expect(process.env.AWS_ACCESS_KEY).toBe(config.aws.access_key);
    expect(process.env.AWS_SECRET_ACCESS_KEY).toBe(config.aws.secret_key);
    expect(process.env.AWS_SSL).toBe(config.aws.ssl.toString());
    expect(process.env.AWS_FORCE_STYLE).toBe(
      config.aws.force_path_style.toString(),
    );
  });
});

it("setupEnv should load .env.prod for production environment", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "prod";
  const consoleSpy = vi.spyOn(console, "log");

  // Re-import the module to trigger setupEnv
  vi.resetModules();
  await import("../config/env-config.js");

  expect(consoleSpy).toHaveBeenCalledWith("Environment is 'prod'");

  // Restore original NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;
});

it("setupEnv should load .env.dev for development environment", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "dev";
  const consoleSpy = vi.spyOn(console, "log");

  // Re-import the module to trigger setupEnv
  vi.resetModules();
  await import("../config/env-config.js");

  expect(consoleSpy).toHaveBeenCalledWith("Environment is 'development'");

  // Restore original NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;
});

it("setupEnv should load .env.local for local environment", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "local";
  const consoleSpy = vi.spyOn(console, "log");
  const dotenvSpy = vi.spyOn(dotenv, "config");

  // Re-import the module to trigger setupEnv
  vi.resetModules();
  await import("../config/env-config.js");

  expect(consoleSpy).toHaveBeenCalledWith("Environment is 'local'");
  expect(dotenvSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      path: expect.stringContaining(".env.local"),
    }),
  );

  // Restore original NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;
});

it("setupEnv should load .env for default environment", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "unknown";
  const consoleSpy = vi.spyOn(console, "log");
  const dotenvSpy = vi.spyOn(dotenv, "config");

  // Re-import the module to trigger setupEnv
  vi.resetModules();
  await import("../config/env-config.js");

  expect(consoleSpy).toHaveBeenCalledWith("Environment is 'default'");
  expect(dotenvSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      path: expect.stringContaining(".env.local"),
    }),
  );

  // Restore original NODE_ENV
  process.env.NODE_ENV = originalNodeEnv;
});
