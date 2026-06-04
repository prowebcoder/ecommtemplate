"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/shared/rating-stars";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { VariantSelector } from "./variant-selector";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ProductInfoProps = {
  product: Product;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.slug ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");

  const variant = product.variants.find((v) => v.color.slug === selectedColor);
  const sizes = variant?.sizes ?? [];
  const sku = variant?.sku ?? product.handle.toUpperCase();
  const colorObj = product.colors.find((c) => c.slug === selectedColor);

  const handleAddToCart = (redirect?: boolean) => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    addItem({
      product,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      colorHex: colorObj?.hex ?? "#000",
    });
    if (redirect) router.push("/checkout");
  };

  const stockStatus = !product.inStock
    ? { label: "Out of Stock", className: "text-destructive" }
    : product.stockCount <= LOW_STOCK_THRESHOLD
      ? { label: `Only ${product.stockCount} left`, className: "text-amber-600" }
      : { label: "In Stock", className: "text-green-700" };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/collections/${product.category}`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          {product.brand}
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight">
            {product.title}
          </h1>
          <WishlistButton productId={product.id} size="md" className="relative shrink-0" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} showCount />
        </div>
      </div>

      <PriceDisplay
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        size="lg"
        showBadge
      />

      <p className={cn("text-sm font-medium", stockStatus.className)}>
        {stockStatus.label}
      </p>

      <VariantSelector
        colors={product.colors}
        sizes={sizes}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onColorChange={(slug) => {
          setSelectedColor(slug);
          setSelectedSize("");
        }}
        onSizeChange={setSelectedSize}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="luxury"
          size="lg"
          className="flex-1"
          disabled={!product.inStock}
          onClick={() => handleAddToCart()}
        >
          Add to Bag
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={!product.inStock}
          onClick={() => handleAddToCart(true)}
        >
          Buy Now
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">SKU: {sku}</p>
    </div>
  );
}
