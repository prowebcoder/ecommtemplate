"use client";

import { motion } from "framer-motion";

type AnnouncementBarProps = {
  items: { id: string; text: string }[];
};

export function AnnouncementBar({ items }: AnnouncementBarProps) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden bg-primary text-primary-foreground">
      <motion.div
        className="flex whitespace-nowrap py-2.5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {loop.map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className="mx-8 text-xs font-medium tracking-widest uppercase"
          >
            {item.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
