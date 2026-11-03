import { QueryClient } from '@tanstack/react-query';

/**
 * Query client defaults for a mostly-static site: build-time content comes from route loaders, so
 * React Query handles client-side server state (mutations, live data). One retry, no refetch on
 * window focus.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  });
}
