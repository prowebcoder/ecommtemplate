"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import { useSearchStore } from "@/stores/search-store";
import { useEffect } from "react";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const addToHistory = useSearchStore((s) => s.addToHistory);

  useEffect(() => {
    if (query.length >= 2) addToHistory(query);
  }, [query, addToHistory]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-results", query],
    queryFn: () => fetchProducts({ search: query, limit: "24" }),
    enabled: query.length >= 1,
  });

  if (!query) {
    return (
      <p className="text-muted-foreground">Enter a search term to find products.</p>
    );
  }

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-secondary" />;
  }

  const products = data?.items ?? [];

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">
        {data?.total ?? 0} results for &quot;{query}&quot;
      </p>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}
