import { storeThemeService } from "@/server/services/store-theme.service";
import { storefrontService } from "@/server/services/storefront.service";
import { StoreContentTabs } from "@/components/admin/store-content-tabs";
import { SizeChartEditor } from "@/components/admin/size-chart-editor";

export default async function AdminContentPage() {
  const [homepage, header, footer, sizeChart, collections, categories] =
    await Promise.all([
      storeThemeService.getHomepage(),
      storeThemeService.getHeader(),
      storeThemeService.getFooter(),
      storefrontService.getSizeChart(),
      storefrontService.getCollections(),
      storefrontService.getCategories(),
    ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl mb-2">Storefront</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Customize the homepage, header navigation, footer links, images, and trust
          bar. CMS pages (About, Privacy, etc.) are still managed under{" "}
          <span className="font-medium">Pages</span>.
        </p>
      </div>
      <StoreContentTabs
        homepage={homepage}
        header={header}
        footer={footer}
        collections={collections.map((c) => ({ handle: c.handle, title: c.title }))}
        categories={categories.map((c) => ({ handle: c.slug, title: c.name }))}
      />
      <SizeChartEditor initial={sizeChart} />
    </div>
  );
}
