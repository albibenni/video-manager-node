import { vi, describe, afterAll, beforeEach, it, expect } from "vitest";

describe("file-ingestion", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });
  afterAll(() => {});

  it("env postgres", () => {
    const POSTGRES_USER = "benni";
    const POSTGRES_PASSWORD = "password";
    const POSTGRES_DB = "video";
    const POSTGRES_HOST = "localhost";
    const POSTGRES_PORT = "5432";
    const userP = process.env.POSTGRES_USER;
    const passP = process.env.POSTGRES_PASSWORD;
    const dbP = process.env.POSTGRES_DB;
    const hostP = process.env.POSTGRES_HOST;
    const portP = process.env.POSTGRES_PORT;
    expect(userP).toBe(POSTGRES_USER);
    expect(passP).toBe(POSTGRES_PASSWORD);
    expect(dbP).toBe(POSTGRES_DB);
    expect(hostP).toBe(POSTGRES_HOST);
    expect(portP).toBe(POSTGRES_PORT);
  });
  it("env minio", () => {
    const MINIO_ROOT_USER = "admin";
    const MINIO_ROOT_PASSWORD = "password";
    const rootUserP = process.env.MINIO_ROOT_USER;
    const rootPassP = process.env.MINIO_ROOT_PASSWORD;

    expect(rootUserP).toBe(MINIO_ROOT_USER);
    expect(rootPassP).toBe(MINIO_ROOT_PASSWORD);
  });
  it("env aws", () => {
    const AWS_ACCESS_KEY = "localAccessKey";
    const AWS_SECRET_ACCESS_KEY = "localSecretKey";
    const AWS_S3_BUCKET = "my-bucket";
    const AWS_FORCE_STYLE = "true";
    const AWS_SSL = "false";

    const accessKeyP = process.env.AWS_ACCESS_KEY;
    const secretKeyP = process.env.AWS_SECRET_ACCESS_KEY;
    const forcePathStyle = process.env.AWS_FORCE_STYLE;
    const ssl = process.env.AWS_SSL;
    const bucketNameP = process.env.AWS_S3_BUCKET;
    expect(accessKeyP).toBe(AWS_ACCESS_KEY);
    expect(secretKeyP).toBe(AWS_SECRET_ACCESS_KEY);
    expect(bucketNameP).toBe(AWS_S3_BUCKET);
    expect(forcePathStyle).toBe(AWS_FORCE_STYLE);
    expect(ssl).toBe(AWS_SSL);
  });
});
