import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { storefrontService } from "@/server/services/storefront.service";
import { CollectionListing } from "@/components/collection/collection-listing";
import { buildMetadata } from "@/lib/seo";
import { collectionJsonLd } from "@/lib/structured-data";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const collection = await storefrontService.getCollection(handle);
  if (!collection) return {};
  return buildMetadata({
    title: collection.title,
    description: collection.description ?? undefined,
    path: `/collections/${handle}`,
    image: collection.image ?? undefined,
  });
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await storefrontService.getCollection(handle);
  if (!collection) notFound();

  const jsonLd = collectionJsonLd({
    id: collection.id,
    title: collection.title,
    description: collection.description ?? "",
    handle: collection.handle,
    image: collection.image ?? "",
    productCount: collection.products.length,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {collection.image && (
        <div className="relative h-48 md:h-64 overflow-hidden bg-secondary">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="container mx-auto px-4 pb-8 text-white">
              <h1 className="font-serif text-3xl md:text-4xl">{collection.title}</h1>
              {collection.description && (
                <p className="mt-2 text-sm text-white/80 max-w-lg">{collection.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      {!collection.image && (
        <div className="container mx-auto px-4 pt-12">
          <h1 className="font-serif text-3xl md:text-4xl">{collection.title}</h1>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<div className="animate-pulse h-96 bg-secondary" />}>
          <CollectionListing collectionHandle={handle} />
        </Suspense>
      </div>
    </>
  );
}
