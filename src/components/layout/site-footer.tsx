import Link from "next/link";
import { Instagram } from "lucide-react";
import { FOOTER_LINKS } from "@/data/navigation";
import { SITE_NAME } from "@/lib/constants";
import { FooterNewsletter } from "./footer-newsletter";
import { FooterTrustBar } from "./footer-trust-bar";

type FooterLink = { label: string; href: string };

type SiteFooterProps = {
  shopLinks?: FooterLink[];
  cmsLinks?: FooterLink[];
};

export function SiteFooter({ shopLinks, cmsLinks = [] }: SiteFooterProps) {
  const shop = shopLinks?.length ? shopLinks : FOOTER_LINKS.shop;
  const company = cmsLinks.length ? cmsLinks : FOOTER_LINKS.company;
  const helpLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Shipping & delivery", href: "/pages/shipping" },
    { label: "Returns & exchanges", href: "/contact" },
    { label: "Track your order", href: "/account/orders" },
  ];

  return (
    <footer className="mt-auto border-t bg-secondary/30">
      <FooterTrustBar />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="font-serif text-2xl tracking-[0.15em] uppercase">
              {SITE_NAME}
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Modern essentials for men, women, and kids — curated quality, thoughtful design,
              and a seamless shopping experience.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn title="Shop" links={shop.slice(0, 6)} />
            <FooterColumn title="Help" links={helpLinks} />
            <FooterColumn title="Company" links={company.slice(0, 5)} />
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-border/80">
          <FooterNewsletter />
        </div>
      </div>

      <div className="border-t border-border/80 bg-background">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <Link href="/pages/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/pages/shipping" className="hover:text-foreground">
              Shipping
            </Link>
            <Link href="/pages/about" className="hover:text-foreground">
              About
            </Link>
            <a href="mailto:support@veloire.com" className="hover:text-foreground">
              support@veloire.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
