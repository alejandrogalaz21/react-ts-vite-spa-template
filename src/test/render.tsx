import type { ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import { createRoutesStub } from 'react-router';

/**
 * Renders a component inside a memory router (at `path`) and a fresh QueryClient, the two
 * contexts most components need. Use plain `render` for components that need neither.
 *
 * @param ui - Element under test.
 * @param path - Initial URL; drives the locale (`/en/...` renders English).
 */
export function renderWithProviders(ui: ReactElement, { path = '/' }: { path?: string } = {}): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Stub = createRoutesStub([{ path: '*', Component: () => ui }]);
  return render(
    <QueryClientProvider client={queryClient}>
      <Stub initialEntries={[path]} />
    </QueryClientProvider>,
  );
}
