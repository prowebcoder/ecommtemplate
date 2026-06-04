import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  BadgeCheck,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type TrustItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: Truck,
    title: "Free shipping",
    desc: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    desc: "30-day hassle-free returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    desc: "SSL-encrypted payments",
  },
  {
    icon: Package,
    title: "Fast dispatch",
    desc: "Ships within 24–48 hours",
  },
  {
    icon: BadgeCheck,
    title: "Verified sellers",
    desc: "Quality-checked marketplace",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    desc: "Help when you need it",
  },
];

export function FooterTrustBar() {
  return (
    <div className="border-b border-border/80 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-muted-foreground mb-8">
          Why shop with us
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {TRUST_ITEMS.map((item) => (
            <TrustCard key={item.title} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function TrustCard({ item }: { item: TrustItem }) {
  const Icon = item.icon;
  return (
    <li
      className={cn(
        "group relative flex flex-col items-center text-center rounded-sm border border-border/70 bg-card/80 px-3 py-5 sm:px-4 sm:py-6",
        "shadow-sm shadow-black/[0.02] transition-all duration-300",
        "hover:border-foreground/15 hover:shadow-md hover:shadow-black/[0.04]"
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-11 w-11 items-center justify-center rounded-full",
          "bg-foreground text-background transition-transform duration-300 group-hover:scale-105"
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      </div>
      <p className="text-sm font-medium tracking-tight">{item.title}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground max-w-[11rem]">
        {item.desc}
      </p>
    </li>
  );
}
