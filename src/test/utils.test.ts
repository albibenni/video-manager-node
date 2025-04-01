import { Readable } from "stream";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatDate,
  getHostName,
  getPath,
  getPort,
  getProtocol,
  getQuery,
  getUUID,
  parseStream,
  sleep,
} from "../utils/utils";

describe("getHostName", () => {
  it("should extract hostname from a valid URL", () => {
    expect(getHostName("https://example.com/path")).toBe("example.com");
    expect(getHostName("http://sub.example.com:8080")).toBe("sub.example.com");
    expect(getHostName("https://localhost/test")).toBe("localhost");
  });

  it("should throw error for invalid URLs", () => {
    expect(() => getHostName("invalid-url")).toThrow();
    expect(() => getHostName("")).toThrow();
  });
});

describe("getPort", () => {
  it("should extract port number from URLs with explicit ports", () => {
    expect(getPort("http://example.com:8080")).toBe("8080");
    expect(getPort("https://localhost:3000/path")).toBe("3000");
  });

  it("should return empty string for URLs without explicit ports", () => {
    expect(getPort("https://example.com")).toBe("");
    expect(getPort("http://test.com/path")).toBe("");
    expect(getPort("https://localhost/")).toBe("");
  });

  it("should throw error for invalid URLs", () => {
    expect(() => getPort("invalid-url")).toThrow();
    expect(() => getPort("")).toThrow();
  });
});

describe("getProtocol", () => {
  it("should extract protocol from valid URLs", () => {
    expect(getProtocol("https://example.com/path")).toBe("https:");
    expect(getProtocol("http://sub.example.com:8080")).toBe("http:");
    expect(getProtocol("ftp://files.example.com")).toBe("ftp:");
  });

  it("should preserve the trailing colon in the protocol", () => {
    expect(getProtocol("https://localhost/test")).toBe("https:");
    expect(getProtocol("http://test.com:3000")).toBe("http:");
  });

  it("should throw error for invalid URLs", () => {
    expect(() => getProtocol("invalid-url")).toThrow();
    expect(() => getProtocol("")).toThrow();
  });
});

describe("getPath", () => {
  it("should extract pathname from valid URLs", () => {
    expect(getPath("https://example.com/path")).toBe("/path");
    expect(getPath("http://test.com/api/v1/users")).toBe("/api/v1/users");
    expect(getPath("https://localhost:3000/path/to/resource")).toBe(
      "/path/to/resource",
    );
  });

  it("should handle URLs without paths", () => {
    expect(getPath("https://example.com")).toBe("/");
    expect(getPath("http://localhost:3000")).toBe("/");
  });

  it("should handle URLs with trailing slashes", () => {
    expect(getPath("https://example.com/path/")).toBe("/path/");
    expect(getPath("http://test.com/api/v1/")).toBe("/api/v1/");
  });

  it("should throw error for invalid URLs", () => {
    expect(() => getPath("invalid-url")).toThrow();
    expect(() => getPath("")).toThrow();
  });
});

describe("getQuery", () => {
  it("should extract query string from URLs with query parameters", () => {
    expect(getQuery("https://example.com?param=value")).toBe("?param=value");
    expect(getQuery("http://test.com/path?key=123&name=test")).toBe(
      "?key=123&name=test",
    );
    expect(getQuery("https://api.example.com/v1?id=1&sort=desc")).toBe(
      "?id=1&sort=desc",
    );
  });

  it("should return empty string for URLs without query parameters", () => {
    expect(getQuery("https://example.com")).toBe("");
    expect(getQuery("http://test.com/path")).toBe("");
    expect(getQuery("https://localhost:3000/api")).toBe("");
  });

  it("should handle URLs with empty query parameters", () => {
    expect(getQuery("https://example.com?")).toBe("");
    expect(getQuery("http://test.com/path?&")).toBe("?&");
  });

  it("should throw error for invalid URLs", () => {
    expect(() => getQuery("invalid-url")).toThrow();
    expect(() => getQuery("")).toThrow();
  });
});

describe("parseStream", () => {
  it("should convert readable stream to string", async () => {
    const stream = new Readable();
    stream.push("Hello ");
    stream.push("World!");
    stream.push(null);

    const result = await parseStream(stream);
    expect(result).toBe("Hello World!");
  });

  it("should handle empty stream", async () => {
    const stream = new Readable();
    stream.push(null);

    const result = await parseStream(stream);
    expect(result).toBe("");
  });

  it("should handle stream with multiple chunks", async () => {
    const stream = new Readable();
    stream.push("Chunk 1, ");
    stream.push("Chunk 2, ");
    stream.push("Chunk 3");
    stream.push(null);

    const result = await parseStream(stream);
    expect(result).toBe("Chunk 1, Chunk 2, Chunk 3");
  });

  it("should reject on stream error", async () => {
    const stream = new Readable({
      read() {}, // Empty implementation as we only push data manually
    });
    setTimeout(() => {
      stream.emit("error", new Error("Stream error"));
    }, 10);

    try {
      await parseStream(stream);
    } catch (e: any) {
      expect(e.message).toBe("Stream error");
    }
  });
});

describe("sleep", () => {
  it("should delay execution for specified milliseconds", async () => {
    const start = Date.now();
    await sleep(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it("should resolve after minimal delay when called with 0", async () => {
    const start = Date.now();
    await sleep(0);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it("should handle multiple concurrent sleep calls", async () => {
    const start = Date.now();
    await Promise.all([sleep(50), sleep(50), sleep(50)]);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(50);
    expect(elapsed).toBeLessThan(150);
  });
});

describe("formatDate", () => {
  it("should format date correctly", () => {
    const date = new Date("2023-12-25T03:30:00.000Z");
    expect(formatDate(date)).toBe("2023-12-25");
  });

  it("should handle PM times", () => {
    const date = new Date("2025-01-16T18:45:49.513Z");
    expect(formatDate(date)).toBe("2025-01-16");
  });

  it("should handle midnight", () => {
    const date = new Date("2023-12-31T00:01:00.000Z");
    expect(formatDate(date)).toBe("2023-12-31");
  });

  it("should handle close to midnight utc time", () => {
    const date = new Date("2023-12-31T00:11:50.000Z");
    expect(formatDate(date)).toBe("2023-12-31");
  });
});

describe("getUUID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });
  it("should generate a valid UUID string", () => {
    const uuid = getUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("should generate unique UUIDs", async () => {
    const uuids = new Set();
    for (let i = 0; i < 1000; i++) {
      uuids.add(getUUID());
    }
    expect(uuids.size).toBe(1000);
  });

  it("should generate UUID v4", () => {
    const uuid = getUUID();
    expect(uuid.charAt(14)).toBe("4");
    expect(["8", "9", "a", "b"].includes(uuid.charAt(19))).toBeTruthy();
  });

  it("should handle multiple sequential calls", async () => {
    const uuid1 = getUUID();
    const uuid2 = getUUID();
    const uuid3 = getUUID();

    expect(uuid1).not.toBe(uuid2);
    expect(uuid2).not.toBe(uuid3);
    expect(uuid1).not.toBe(uuid3);
  });
});
