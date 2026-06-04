"use client";

import { motion } from "framer-motion";
import { CUSTOMER_REVIEWS } from "@/data/reviews";
import { RatingStars } from "@/components/shared/rating-stars";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SectionHeading } from "@/components/shared/section-heading";

export function CustomerReviews() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <ScrollReveal>
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Trusted by thousands across India"
          align="center"
        />
      </ScrollReveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CUSTOMER_REVIEWS.map((review, i) => (
          <ScrollReveal key={review.id} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="border p-6 h-full flex flex-col"
            >
              <RatingStars rating={review.rating} />
              <p className="mt-4 text-sm leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-medium">{review.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {review.product}
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
