import { heroImage } from "@/lib/catalog-images";
import { DEFAULT_SIZE_CHART } from "@/lib/size-chart-defaults";
import { prisma } from "@/server/db/prisma";
import { mapDbProductToCard } from "@/server/mappers/product.mapper";
import type { Product } from "@/types/product";

const storefrontProductWhere = {
  isActive: true,
  approvalStatus: "APPROVED" as const,
  OR: [{ vendorId: null }, { vendor: { status: "ACTIVE" as const } }],
};

export class StorefrontService {
  async getApprovedProducts(limit = 12): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: storefrontProductWhere,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true }, include: { inventory: true } },
        category: { select: { slug: true } },
      },
    });
    return rows.map((p) =>
      mapDbProductToCard({
        ...p,
        description: p.description,
        materials: p.materials,
        careInstructions: p.careInstructions,
        shippingInfo: p.shippingInfo,
        returnPolicy: p.returnPolicy,
        createdAt: p.createdAt,
        variants: p.variants,
      })
    );
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { ...storefrontProductWhere, isNew: true },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true }, include: { inventory: true } },
        category: { select: { slug: true } },
      },
    });
    if (rows.length < limit) {
      const extra = await prisma.product.findMany({
        where: storefrontProductWhere,
        take: limit - rows.length,
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          variants: { where: { isActive: true }, include: { inventory: true } },
          category: { select: { slug: true } },
        },
      });
      rows.push(...extra.filter((e) => !rows.find((r) => r.id === e.id)));
    }
    return rows.map((p) =>
      mapDbProductToCard({
        ...p,
        description: p.description,
        materials: p.materials,
        careInstructions: p.careInstructions,
        shippingInfo: p.shippingInfo,
        returnPolicy: p.returnPolicy,
        createdAt: p.createdAt,
        variants: p.variants,
      })
    );
  }

  async getBestSellers(limit = 8): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { ...storefrontProductWhere, isBestSeller: true },
      take: limit,
      orderBy: { reviewCount: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true }, include: { inventory: true } },
        category: { select: { slug: true } },
      },
    });
    return rows.map((p) =>
      mapDbProductToCard({
        ...p,
        description: p.description,
        materials: p.materials,
        careInstructions: p.careInstructions,
        shippingInfo: p.shippingInfo,
        returnPolicy: p.returnPolicy,
        createdAt: p.createdAt,
        variants: p.variants,
      })
    );
  }

  async getTrending(limit = 8): Promise<Product[]> {
    const rows = await prisma.product.findMany({
      where: { ...storefrontProductWhere, isTrending: true },
      take: limit,
      orderBy: { rating: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true }, include: { inventory: true } },
        category: { select: { slug: true } },
      },
    });
    return rows.map((p) =>
      mapDbProductToCard({
        ...p,
        description: p.description,
        materials: p.materials,
        careInstructions: p.careInstructions,
        shippingInfo: p.shippingInfo,
        returnPolicy: p.returnPolicy,
        createdAt: p.createdAt,
        variants: p.variants,
      })
    );
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    const rows = await prisma.product.findMany({
      where: { id: { in: ids }, ...storefrontProductWhere },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true }, include: { inventory: true } },
        category: { select: { slug: true } },
      },
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((p) =>
        mapDbProductToCard({
          ...p!,
          description: p!.description,
          materials: p!.materials,
          careInstructions: p!.careInstructions,
          shippingInfo: p!.shippingInfo,
          returnPolicy: p!.returnPolicy,
          createdAt: p!.createdAt,
          variants: p!.variants,
        })
      );
  }

  async getCollection(handle: string) {
    return prisma.collection.findFirst({
      where: { handle, isActive: true },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: { take: 1 },
                variants: { take: 1 },
              },
            },
          },
        },
      },
    });
  }

  async getCollections() {
    return prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  }

  async getPublishedPage(handle: string) {
    return prisma.storePage.findFirst({
      where: { handle, isPublished: true },
    });
  }

  async getFooterPages() {
    return prisma.storePage.findMany({
      where: { isPublished: true, showInFooter: true },
      orderBy: { sortOrder: "asc" },
      select: { title: true, handle: true },
    });
  }

  async getSizeChart() {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "storefront.sizeChart" },
    });
    const value = setting?.value as { title?: string; content?: string } | undefined;
    return {
      title: value?.title?.trim() || DEFAULT_SIZE_CHART.title,
      content: value?.content?.trim() || DEFAULT_SIZE_CHART.content,
    };
  }

  async getHomeHero() {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "homepage.hero" },
    });
    return (setting?.value as {
      title?: string;
      subtitle?: string;
      ctaLabel?: string;
      ctaHref?: string;
      imageUrl?: string;
    }) ?? {
      title: "Elevated Essentials",
      subtitle: "Premium fashion for every moment",
      ctaLabel: "Shop Now",
      ctaHref: "/collections/new-arrivals",
      imageUrl: heroImage(),
    };
  }
}

export const storefrontService = new StorefrontService();
