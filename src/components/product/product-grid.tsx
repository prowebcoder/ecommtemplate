import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function ProductGrid({
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 md:gap-6", colClass[columns], className)}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 4}
        />
      ))}
    </div>
  );
}
