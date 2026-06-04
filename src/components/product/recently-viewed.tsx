"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductGrid } from "./product-grid";
import { SectionHeading } from "@/components/shared/section-heading";

type RecentlyViewedProps = {
  excludeHandle?: string;
};

export function RecentlyViewed({ excludeHandle }: RecentlyViewedProps) {
  const { handles } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = handles.filter((h) => h !== excludeHandle);
    if (!ids.length) {
      setProducts([]);
      return;
    }
    fetchProducts({ search: "", limit: "8" })
      .then(() => {
        return Promise.all(
          ids.slice(0, 4).map((handle) =>
            fetch(`/api/products/${handle}`).then((r) => r.json())
          )
        );
      })
      .then((results) => {
        const items = results
          .map((r) => r.product as Product | undefined)
          .filter(Boolean) as Product[];
        setProducts(items);
      })
      .catch(() => setProducts([]));
  }, [handles, excludeHandle]);

  if (!products.length) return null;

  return (
    <section className="mt-16 md:mt-24">
      <SectionHeading title="Recently Viewed" />
      <div className="mt-8">
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}
