"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";

export function useInfiniteProducts(params: Record<string, string | string[]> = {}) {
  return useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchProducts({
        ...params,
        page: String(pageParam),
        limit: params.limit ?? "12",
      });
      return {
        products: result.items,
        total: result.total,
        hasMore: pageParam * Number(params.limit ?? 12) < result.total,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}
