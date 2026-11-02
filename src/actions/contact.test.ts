import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { HttpError } from '~/lib/http';
import { server, TEST_API_URL } from '~/test/msw-server';

import { sendContactMessage } from './contact';

const message = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Lorem ipsum dolor sit amet, consectetur.',
};

describe('sendContactMessage', () => {
  it('POSTs the message as JSON to {apiUrl}/contact', async () => {
    let received: unknown;
    server.use(
      http.post(`${TEST_API_URL}/contact`, async ({ request }) => {
        received = await request.json();
        return new HttpResponse(null, { status: 204 });
      }),
    );
    await sendContactMessage(message, TEST_API_URL);
    expect(received).toEqual(message);
  });

  it('throws HttpError when the API fails', async () => {
    server.use(http.post(`${TEST_API_URL}/contact`, () => new HttpResponse(null, { status: 500 })));
    await expect(sendContactMessage(message, TEST_API_URL)).rejects.toBeInstanceOf(HttpError);
  });

  it('simulates success without an API URL', async () => {
    await expect(sendContactMessage(message, '')).resolves.toBeUndefined();
  });
});
