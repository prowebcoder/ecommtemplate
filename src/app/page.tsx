import { Suspense } from "react";
import { heroImage } from "@/lib/catalog-images";
import { storefrontService } from "@/server/services/storefront.service";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { TrendingCollection } from "@/components/home/trending-collection";
import { BestSellers } from "@/components/home/best-sellers";
import { PromoBanner } from "@/components/home/promo-banner";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { NewsletterSection } from "@/components/home/newsletter-section";

function SectionSkeleton() {
  return <div className="container mx-auto px-4 py-16 h-64 animate-pulse bg-secondary/50" />;
}

export default async function HomePage() {
  const hero = await storefrontService.getHomeHero();

  return (
    <>
      <HeroBanner
        title={hero.title ?? "Elevate Your Everyday"}
        subtitle={hero.subtitle}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        imageUrl={hero.imageUrl ?? heroImage()}
      />
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedCategories />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <TrendingCollection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <BestSellers />
      </Suspense>
      <PromoBanner />
      <CustomerReviews />
      <InstagramFeed />
      <NewsletterSection />
    </>
  );
}
