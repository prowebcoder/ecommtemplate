import { headers } from "next/headers";
import { storefrontService } from "@/server/services/storefront.service";
import { buildMegaMenuFromCollections } from "@/lib/build-navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPanel = pathname.startsWith("/admin") || pathname.startsWith("/vendor");

  if (isPanel) {
    return <>{children}</>;
  }

  const [collections, footerPages] = await Promise.all([
    storefrontService.getCollections(),
    storefrontService.getFooterPages(),
  ]);

  const megaMenu = buildMegaMenuFromCollections(collections);
  const shopLinks = collections.map((c) => ({
    label: c.title,
    href: `/collections/${c.handle}`,
  }));

  return (
    <>
      <SiteHeader megaMenu={megaMenu} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        shopLinks={shopLinks}
        cmsLinks={footerPages.map((p) => ({
          label: p.title,
          href: `/pages/${p.handle}`,
        }))}
      />
    </>
  );
}
