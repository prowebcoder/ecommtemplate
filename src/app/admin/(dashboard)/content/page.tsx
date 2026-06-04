import { heroImage } from "@/lib/catalog-images";
import { storefrontService } from "@/server/services/storefront.service";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { SizeChartEditor } from "@/components/admin/size-chart-editor";

export default async function AdminContentPage() {
  const [hero, sizeChart] = await Promise.all([
    storefrontService.getHomeHero(),
    storefrontService.getSizeChart(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl mb-2">Store content</h1>
        <p className="text-sm text-muted-foreground">
          Edit homepage hero, the global size chart, and CMS pages under Content → Pages.
        </p>
      </div>
      <HomepageEditor
        initial={{
          title: hero.title ?? "Elevate Your Everyday",
          subtitle: hero.subtitle,
          ctaLabel: hero.ctaLabel,
          ctaHref: hero.ctaHref,
          imageUrl: hero.imageUrl ?? heroImage(),
        }}
      />
      <SizeChartEditor initial={sizeChart} />
    </div>
  );
}
