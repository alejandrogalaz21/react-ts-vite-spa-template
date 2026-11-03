import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

/** Base URL used by tests that exercise real HTTP code paths. */
export const TEST_API_URL = 'https://api.test';

/** Default handlers: the happy path of every endpoint. Tests override them with `server.use()`. */
export const handlers = [http.post(`${TEST_API_URL}/contact`, () => new HttpResponse(null, { status: 204 }))];

export const server = setupServer(...handlers);
