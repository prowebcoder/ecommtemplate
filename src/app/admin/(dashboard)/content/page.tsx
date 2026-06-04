import { heroImage } from "@/lib/catalog-images";
import { storefrontService } from "@/server/services/storefront.service";
import { HomepageEditor } from "@/components/admin/homepage-editor";

export default async function AdminContentPage() {
  const hero = await storefrontService.getHomeHero();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Store content</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Edit homepage hero and manage pages under Content → Pages.
      </p>
      <HomepageEditor
        initial={{
          title: hero.title ?? "Elevate Your Everyday",
          subtitle: hero.subtitle,
          ctaLabel: hero.ctaLabel,
          ctaHref: hero.ctaHref,
          imageUrl: hero.imageUrl ?? heroImage(),
        }}
      />
    </div>
  );
}
