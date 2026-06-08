import { Suspense } from "react";
import { heroImage } from "@/lib/catalog-images";
import { storeThemeService } from "@/server/services/store-theme.service";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { HomeProductRow } from "@/components/home/home-product-row";

function RowSkeleton() {
  return (
    <div className="container mx-auto px-4 py-14">
      <div className="h-8 w-48 animate-pulse bg-secondary mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-secondary" />
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const homepage = await storeThemeService.getHomepage();
  const { hero, quickLinks, featuredSection, productRows } = homepage;

  return (
    <div className="flex flex-col">
      <HeroBanner
        title={hero.title}
        subtitle={hero.subtitle}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        secondaryCtaLabel={hero.secondaryCtaLabel}
        secondaryCtaHref={hero.secondaryCtaHref}
        imageUrl={hero.imageUrl || heroImage()}
        quickLinks={quickLinks}
      />
      <Suspense fallback={<RowSkeleton />}>
        <FeaturedCategories section={featuredSection} />
      </Suspense>
      {productRows
        .filter((row) => row.enabled)
        .map((row) => (
          <Suspense key={row.id} fallback={<RowSkeleton />}>
            <HomeProductRow
              eyebrow={row.eyebrow}
              title={row.title}
              subtitle={row.subtitle}
              href={row.href}
              fetcher={row.fetcher}
              muted={row.muted}
            />
          </Suspense>
        ))}
    </div>
  );
}
