"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type HeroBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl: string;
};

export function HeroBanner({
  title,
  subtitle,
  ctaLabel = "Shop Now",
  ctaHref = "/collections/new-arrivals",
  imageUrl,
}: HeroBannerProps) {
  return (
    <section className="relative h-[70vh] min-h-[480px] max-h-[800px] w-full overflow-hidden md:h-[85vh]">
      <Image src={imageUrl} alt={title} fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-white"
          >
            <h1 className="font-serif text-4xl leading-tight md:text-6xl lg:text-7xl text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-sm md:text-base text-white/80 max-w-md">{subtitle}</p>
            )}
            <div className="mt-8">
              <Button variant="luxury" className="bg-white text-foreground hover:bg-white/90" asChild>
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
