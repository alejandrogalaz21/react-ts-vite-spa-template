/** Error thrown for any non-2xx response, carrying the status for callers that branch on it. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Default timeout for every request: a hung API must not leave a spinner forever. */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Thin `fetch` wrapper: JSON in, JSON out, timeout, and an {@link HttpError} on non-2xx. No axios:
 * native fetch covers what a static site needs and adds zero bytes to the bundle.
 *
 * @param url - Absolute URL.
 * @param init - Standard `RequestInit`; `body` objects are serialized as JSON.
 */
export async function requestJson<T>(
  url: string,
  init: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...rest } = init;
  const response = await fetch(url, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: init.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  if (!response.ok)
    throw new HttpError(response.status, `${init.method ?? 'GET'} ${url} failed with ${response.status}`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
