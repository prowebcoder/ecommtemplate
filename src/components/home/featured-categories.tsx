import Image from "next/image";
import Link from "next/link";
import { storefrontService } from "@/server/services/storefront.service";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export async function FeaturedCategories() {
  const collections = await storefrontService.getCollections();
  const featured = collections.filter((c) => c.image).slice(0, 4);
  if (!featured.length) return null;

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <ScrollReveal>
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">Shop by Collection</h2>
      </ScrollReveal>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {featured.map((col, i) => (
          <ScrollReveal key={col.id} delay={i * 0.08}>
            <Link
              href={`/collections/${col.handle}`}
              className="group relative aspect-[3/4] overflow-hidden bg-secondary"
            >
              {col.image && (
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white font-medium text-sm md:text-base">{col.title}</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
