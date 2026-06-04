import { Suspense } from "react";
import { heroImage } from "@/lib/catalog-images";
import { storefrontService } from "@/server/services/storefront.service";
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
  const hero = await storefrontService.getHomeHero();

  return (
    <div className="flex flex-col">
      <HeroBanner
        title={hero.title ?? "Elevate Your Everyday"}
        subtitle={hero.subtitle}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        imageUrl={hero.imageUrl ?? heroImage()}
      />
      <Suspense fallback={<RowSkeleton />}>
        <FeaturedCategories />
      </Suspense>
      <Suspense fallback={<RowSkeleton />}>
        <HomeProductRow
          eyebrow="Just in"
          title="New Arrivals"
          subtitle="Latest pieces from our catalog"
          href="/collections/new-arrivals"
          fetcher="new"
        />
      </Suspense>
      <Suspense fallback={<RowSkeleton />}>
        <HomeProductRow
          eyebrow="Most loved"
          title="Best Sellers"
          subtitle="Top picks from the community"
          href="/collections/best-sellers"
          fetcher="best"
          muted
        />
      </Suspense>
    </div>
  );
}
