"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const navigate = (dir: number) => {
    setActiveIndex((prev) => (prev + dir + images.length) % images.length);
  };

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[80px_1fr]">
        <div className="hidden lg:flex flex-col gap-2 order-2 lg:order-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden border-2 transition-colors",
                activeIndex === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>

        <div className="relative order-1 lg:order-2">
          <div
            className="relative aspect-[3/4] overflow-hidden bg-secondary cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onClick={() => setZoomOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`${title} - image ${activeIndex + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500",
                    isZoomed && "scale-125"
                  )}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                setZoomOpen(true);
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto lg:hidden scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative h-16 w-14 shrink-0 overflow-hidden border-2",
                  activeIndex === i ? "border-primary" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={images[activeIndex]}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
              onClick={() => navigate(1)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute right-4 top-4 text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
