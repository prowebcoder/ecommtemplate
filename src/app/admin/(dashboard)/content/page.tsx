import { storeThemeService } from "@/server/services/store-theme.service";
import { storefrontService } from "@/server/services/storefront.service";
import { StoreContentTabs } from "@/components/admin/store-content-tabs";
import { SizeChartEditor } from "@/components/admin/size-chart-editor";

export default async function AdminContentPage() {
  const [homepage, header, footer, sizeChart] = await Promise.all([
    storeThemeService.getHomepage(),
    storeThemeService.getHeader(),
    storeThemeService.getFooter(),
    storefrontService.getSizeChart(),
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
      <StoreContentTabs homepage={homepage} header={header} footer={footer} />
      <SizeChartEditor initial={sizeChart} />
    </div>
  );
}
