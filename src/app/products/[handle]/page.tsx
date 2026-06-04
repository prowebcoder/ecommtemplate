import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductGrid } from "@/components/product/product-grid";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductViewTracker } from "@/components/product/product-view-tracker";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";
import { productService } from "@/server/services/product.service";
import { AppError } from "@/server/errors/app-error";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { handle } = await params;
    const product = await productService.getByHandle(handle);
    return buildMetadata({
      title: product.title,
      description: product.description,
      path: `/products/${handle}`,
      image: product.featuredImage,
    });
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;

  let product;
  let related;
  try {
    product = await productService.getByHandle(handle);
    related = await productService.getRelated(handle);
  } catch (e) {
    if (e instanceof AppError && e.statusCode === 404) notFound();
    throw e;
  }

  return (
    <>
      <ProductViewTracker handle={handle} />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} title={product.title} />
          <ProductInfo product={product} />
        </div>

        <div className="mt-12 max-w-3xl">
          <ProductTabs product={product} />
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <SectionHeading title="You May Also Like" />
            <div className="mt-8">
              <ProductGrid products={related} columns={4} />
            </div>
          </section>
        )}
        <RecentlyViewed excludeHandle={handle} />
      </div>
    </>
  );
}
