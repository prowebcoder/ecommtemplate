"use client";

import { cn } from "@/lib/utils";
import type { ProductColor, ProductSize } from "@/types/product";

type VariantSelectorProps = {
  colors: ProductColor[];
  sizes: ProductSize[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (slug: string) => void;
  onSizeChange: (size: string) => void;
};

export function VariantSelector({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3">
          Color — {colors.find((c) => c.slug === selectedColor)?.name}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.slug}
              type="button"
              onClick={() => onColorChange(color.slug)}
              className={cn(
                "h-10 w-10 rounded-full border-2 transition-all",
                selectedColor === color.slug
                  ? "border-primary scale-110 ring-2 ring-offset-2 ring-primary/30"
                  : "border-muted hover:border-primary"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.value}
              type="button"
              disabled={!size.inStock}
              onClick={() => onSizeChange(size.value)}
              className={cn(
                "min-w-[3rem] border px-3 py-2.5 text-sm transition-colors",
                selectedSize === size.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-primary",
                !size.inStock && "opacity-40 cursor-not-allowed line-through"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
