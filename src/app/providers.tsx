'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ApiError } from '@/lib/api/errors';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        // A 4xx answer will not change on retry; network and 5xx errors get two more tries.
        retry: (failures, error) =>
          !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failures < 2,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  // A new client per server render keeps users apart; the browser keeps one for the whole visit.
  if (typeof window === 'undefined') return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
