import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { FOOTER_LINKS } from "@/data/navigation";
import { SITE_NAME } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

type FooterLink = { label: string; href: string };

type SiteFooterProps = {
  shopLinks?: FooterLink[];
  cmsLinks?: FooterLink[];
};

export function SiteFooter({ shopLinks, cmsLinks = [] }: SiteFooterProps) {
  const shop = shopLinks?.length ? shopLinks : FOOTER_LINKS.shop;
  const company = cmsLinks.length ? cmsLinks : FOOTER_LINKS.company;

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-serif text-xl tracking-[0.2em] uppercase">
              {SITE_NAME}
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium fashion essentials crafted for comfort, style, and everyday luxury.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">Help</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">support@veloire.com</p>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
