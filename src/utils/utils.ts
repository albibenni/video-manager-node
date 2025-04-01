import type { Readable } from "stream";
import moment from "moment";
import { randomUUID } from "crypto";

/**
 * Extracts the hostname from a given URL endpoint.
 * @param endpoint - The full URL string from which to extract the hostname
 * @returns The hostname portion of the URL
 * @throws {TypeError} When the input is not a valid URL
 * @example
 * getHostName('https://www.example.com/path') // returns 'www.example.com'
 */
export function getHostName(endpoint: string): string {
  return new URL(endpoint).hostname;
}

/**
 * Extracts the port number from a given URL endpoint.
 *
 * @param endpoint - The URL string to extract the port from
 * @returns The port number as a string, or an empty string if no port is specified
 *
 * @example
 * ```typescript
 * getPort('http://localhost:3000') // returns '3000'
 * getPort('https://example.com') // returns ''
 * ```
 */
export function getPort(endpoint: string): string {
  return new URL(endpoint).port;
}

/**
 * Extracts the protocol from a given URL endpoint.
 * @param endpoint - The URL string to extract the protocol from
 * @returns The protocol part of the URL including the trailing colon (e.g., "https:", "http:")
 * @throws {TypeError} Will throw if the endpoint is not a valid URL
 * @example
 * getProtocol("https://example.com") // returns "https:"
 * getProtocol("http://localhost:3000") // returns "http:"
 */
export function getProtocol(endpoint: string): string {
  return new URL(endpoint).protocol;
}

/**
 * Extracts the pathname from a URL endpoint string.
 *
 * @param endpoint - The URL endpoint string to parse
 * @returns The pathname portion of the URL
 * @throws {TypeError} If the input is not a valid URL
 *
 * @example
 * ```ts
 * getPath('https://example.com/path') // Returns '/path'
 * getPath('http://localhost:3000/api/v1') // Returns '/api/v1'
 * ```
 */
export function getPath(endpoint: string): string {
  return new URL(endpoint).pathname;
}

/**
 * Extracts the query string from a URL endpoint.
 *
 * @param endpoint - The full URL string from which to extract the query
 * @returns The query string portion of the URL (including the leading '?')
 * @throws {TypeError} Will throw if the input is not a valid URL
 *
 * @example
 * ```ts
 * getQuery('https://example.com?foo=bar'); // Returns '?foo=bar'
 * getQuery('https://example.com'); // Returns ''
 * ```
 */
export function getQuery(endpoint: string): string {
  return new URL(endpoint).search;
}

/**
 * Converts a readable stream to a string by concatenating all chunks.
 * @param stream - The readable stream to parse
 * @returns A promise that resolves with the complete string content of the stream
 * @throws Will reject the promise if a stream error occurs
 *
 * @example
 * const stream = fs.createReadStream('file.txt');
 * const content = await parseStream(stream);
 */
export function parseStream(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const responseDataChunks: any[] = [];
    stream.once("error", (err: Error) => {
      reject(err);
    });
    stream.on("data", (chunk: any) => {
      responseDataChunks.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(responseDataChunks).toString());
    });
  });
}

/**
 * Parses an image from a Response object into an ArrayBuffer. - recommended for node
 *
 * @param response - The Response object containing the image data
 * @returns A Promise that resolves to an ArrayBuffer containing the parsed image data
 */
export function parseImageFromResponse(
  response: Response,
): Promise<ArrayBuffer> {
  return response.arrayBuffer();
}
/**
 * Creates a Promise that resolves after a specified time delay.
 *
 * @param ms - The number of milliseconds to sleep/delay
 * @returns A Promise that resolves after the specified delay
 * @example
 * ```ts
 * // Sleep for 1 second
 * await sleep(1000);
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Formats a Date object into a string using the format "YYYY-MM-dd"
 *
 * @param date - The Date object to be formatted
 * @returns A string representation of the date in the format "YYYY-MM-dd"
 * @example
 * // Returns "2025-01-16"
 * formatDate(new Date('2025-01-16T13:45:49.513Z'))
 */
export function formatDate(date: Date): string {
  return moment(date).utc().format("YYYY-MM-DD");
}

/**
 * Generates a random Universally Unique Identifier (UUID).
 *
 * This function is a wrapper around Node.js randomUUID function which generates
 * a cryptographically secure random UUID (v4) compliant with RFC 4122.
 *
 * @returns A string representation of a UUID v4 in format
 *          'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' where x is a hexadecimal digit
 *
 * @example
 * // Returns something like "550e8400-e29b-41d4-a716-446655440000"
 * const id = getUUID();
 */
export function getUUID(): string {
  return randomUUID();
}
