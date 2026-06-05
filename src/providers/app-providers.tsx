"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthSessionProvider } from "@/providers/session-provider";
import { CartSyncProvider } from "@/components/providers/cart-sync-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <AuthSessionProvider>
      <CartSyncProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </CartSyncProvider>
    </AuthSessionProvider>
  );
}
