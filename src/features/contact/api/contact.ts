import { env } from '#shared/config/env';
import { requestJson } from '#shared/lib/http';

import type { ContactMessage } from '../types';

/** Delay of the simulated send, so the "sending" state is visible in demos. */
const SIMULATED_DELAY_MS = 600;

/**
 * Sends the contact form. With `VITE_API_URL` set it POSTs to `{VITE_API_URL}/contact`; without
 * it the send is simulated, which keeps the template usable with no backend.
 *
 * @throws HttpError When the API answers with a non-2xx status.
 */
export async function sendContactMessage(message: ContactMessage, apiUrl = env.VITE_API_URL): Promise<void> {
  if (!apiUrl) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    return;
  }
  await requestJson<void>(`${apiUrl}/contact`, { method: 'POST', body: message });
}
