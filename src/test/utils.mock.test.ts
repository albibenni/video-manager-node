import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getUUID, parseImageFromResponse } from "../utils/utils";
describe("mock test uuid", () => {
  beforeAll(() => {
    vi.mock("crypto");
  });
  afterAll(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
    vi.unmock("crypto");
  });
  it("should return mocked UUID when randomUUID is mocked", () => {
    vi.mock("crypto", () => ({
      randomUUID: () => "12345678-1234-4123-8123-123456789012",
    }));
    // vi.mocked(randomUUID).mockReturnValue(
    //   "12345678-1234-4123-8123-123456789012",
    // );

    const uuid = getUUID();
    expect(uuid).toBe("12345678-1234-4123-8123-123456789012");
  });
});

describe("parseImageFromResponse", () => {
  it("should return the array buffer from the response", async () => {
    // Create a mock array buffer
    const mockArrayBuffer = new ArrayBuffer(8);

    // Create a mock Response object
    const mockResponse = {
      arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
    } as unknown as Response;

    // Call the function
    const result = await parseImageFromResponse(mockResponse);

    // Verify the correct result is returned
    expect(result).toBe(mockArrayBuffer);

    // Verify arrayBuffer method was called once
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockResponse.arrayBuffer).toHaveBeenCalledTimes(1);
  });

  it("should pass through any errors from response.arrayBuffer()", async () => {
    // Create a mock Response that throws an error
    const mockError = new Error("Network error");
    const mockResponse = {
      arrayBuffer: vi.fn().mockRejectedValue(mockError),
    } as unknown as Response;

    // Verify the error is passed through
    await expect(parseImageFromResponse(mockResponse)).rejects.toThrow(
      "Network error",
    );
  });

  it("should handle empty array buffer responses", async () => {
    // Create an empty array buffer
    const emptyArrayBuffer = new ArrayBuffer(0);

    // Create a mock Response object
    const mockResponse = {
      arrayBuffer: vi.fn().mockResolvedValue(emptyArrayBuffer),
    } as unknown as Response;

    // Call the function
    const result = await parseImageFromResponse(mockResponse);

    // Verify we get the empty array buffer back
    expect(result).toBe(emptyArrayBuffer);
    expect(result.byteLength).toBe(0);
  });
});
