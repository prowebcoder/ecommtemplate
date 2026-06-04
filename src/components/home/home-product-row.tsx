import { storefrontService } from "@/server/services/storefront.service";
import { ProductGrid } from "@/components/product/product-grid";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

type HomeProductRowProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href: string;
  fetcher: "new" | "best";
  muted?: boolean;
};

export async function HomeProductRow({
  eyebrow,
  title,
  subtitle,
  href,
  fetcher,
  muted,
}: HomeProductRowProps) {
  const products =
    fetcher === "new"
      ? await storefrontService.getNewArrivals(8)
      : await storefrontService.getBestSellers(8);

  if (!products.length) return null;

  return (
    <section
      className={cn(
        "py-14 md:py-20",
        muted && "bg-secondary/40 border-y border-border/60"
      )}
    >
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            href={href}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="mt-8 md:mt-10">
          <ProductGrid products={products} />
        </ScrollReveal>
      </div>
    </section>
  );
}
