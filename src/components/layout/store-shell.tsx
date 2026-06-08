import { headers } from "next/headers";
import { storefrontService } from "@/server/services/storefront.service";
import { storeThemeService } from "@/server/services/store-theme.service";
import { buildMegaMenuFromCollections } from "@/lib/build-navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPanel = pathname.startsWith("/admin") || pathname.startsWith("/vendor");

  if (isPanel) {
    return <>{children}</>;
  }

  const [collections, footerPages, header, footer] = await Promise.all([
    storefrontService.getCollections(),
    storefrontService.getFooterPages(),
    storeThemeService.getHeader(),
    storeThemeService.getFooter(),
  ]);

  const megaMenu =
    header.navigationMode === "collections" || !header.navigation.length
      ? buildMegaMenuFromCollections(collections)
      : header.navigation;

  const cmsLinks = footerPages.map((p) => ({
    label: p.title,
    href: `/pages/${p.handle}`,
  }));

  return (
    <>
      <SiteHeader header={header} megaMenu={megaMenu} />
      <main className="flex-1">{children}</main>
      <SiteFooter footer={footer} logoText={header.logo.text} cmsLinks={cmsLinks} />
    </>
  );
}
