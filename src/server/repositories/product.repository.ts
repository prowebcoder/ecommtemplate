import { Prisma } from "@prisma/client";
import { DEFAULT_PRICE_MAX } from "@/lib/product-list-params";
import { prisma } from "@/server/db/prisma";

const storefrontVisibility: Prisma.ProductWhereInput = {
  isActive: true,
  approvalStatus: "APPROVED",
  OR: [{ vendorId: null }, { vendor: { status: "ACTIVE" } }],
};

export type ProductListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlugs?: string[];
  collectionHandle?: string;
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sort?: string;
};

function buildVariantFilter(query: ProductListQuery): Prisma.ProductVariantWhereInput | undefined {
  const hasColors = (query.colors?.length ?? 0) > 0;
  const hasSizes = (query.sizes?.length ?? 0) > 0;
  const hasPrice =
    query.priceMin !== undefined || query.priceMax !== undefined;

  if (!hasColors && !hasSizes && !hasPrice && !query.inStock) {
    return undefined;
  }

  return {
    isActive: true,
    ...(hasColors ? { colorSlug: { in: query.colors } } : {}),
    ...(hasSizes
      ? {
          OR: [
            { sizeValue: { in: query.sizes } },
            { sizeLabel: { in: query.sizes } },
          ],
        }
      : {}),
    ...(hasPrice
      ? {
          price: {
            ...(query.priceMin !== undefined ? { gte: query.priceMin } : {}),
            ...(query.priceMax !== undefined ? { lte: query.priceMax } : {}),
          },
        }
      : {}),
    ...(query.inStock ? { inventory: { quantity: { gt: 0 } } } : {}),
  };
}

export class ProductRepository {
  private baseWhere(query: ProductListQuery): Prisma.ProductWhereInput {
    const and: Prisma.ProductWhereInput[] = [storefrontVisibility];

    if (query.search) {
      and.push({
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          { brand: { contains: query.search, mode: "insensitive" } },
          { handle: { contains: query.search, mode: "insensitive" } },
        ],
      });
    }

    if (query.categoryId) {
      and.push({ categoryId: query.categoryId });
    }
    if (query.categorySlugs?.length) {
      and.push({ category: { slug: { in: query.categorySlugs } } });
    }
    if (query.brands?.length) {
      and.push({ brand: { in: query.brands } });
    }
    if (query.collectionHandle) {
      and.push({
        collections: { some: { collection: { handle: query.collectionHandle } } },
      });
    }

    const variantFilter = buildVariantFilter(query);
    if (variantFilter) {
      and.push({ variants: { some: variantFilter } });
    }

    return and.length === 1 ? and[0] : { AND: and };
  }

  async findMany(query: ProductListQuery) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 12, 100);
    const skip = (page - 1) * limit;
    const where = this.baseWhere(query);

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }];
    switch (query.sort) {
      case "newest":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        break;
      case "best-selling":
        orderBy = [{ isBestSeller: "desc" }, { createdAt: "desc" }];
        break;
      case "rating":
        orderBy = [{ rating: "desc" }];
        break;
      default:
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          variants: {
            where: { isActive: true },
            include: { inventory: true },
          },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getFacets(collectionHandle?: string) {
    const where = this.baseWhere({ collectionHandle });

    const products = await prisma.product.findMany({
      where,
      select: {
        brand: true,
        variants: {
          where: { isActive: true },
          select: {
            colorSlug: true,
            colorName: true,
            colorHex: true,
            sizeLabel: true,
            sizeValue: true,
            price: true,
          },
        },
      },
    });

    const brandSet = new Set<string>();
    const colorMap = new Map<string, { slug: string; name: string; hex: string }>();
    const sizeSet = new Set<string>();
    let priceMin = Infinity;
    let priceMax = 0;

    for (const product of products) {
      if (product.brand) brandSet.add(product.brand);
      for (const v of product.variants) {
        if (v.colorSlug) {
          colorMap.set(v.colorSlug, {
            slug: v.colorSlug,
            name: v.colorName,
            hex: v.colorHex ?? "#888888",
          });
        }
        if (v.sizeLabel) sizeSet.add(v.sizeLabel);
        if (v.sizeValue) sizeSet.add(v.sizeValue);
        const price = Number(v.price);
        if (price < priceMin) priceMin = price;
        if (price > priceMax) priceMax = price;
      }
    }

    const sortSizes = (a: string, b: string) => {
      const order = ["XS", "S", "M", "L", "XL", "XXL", "OS"];
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    };

    return {
      brands: [...brandSet].sort(),
      colors: [...colorMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
      sizes: [...sizeSet].sort(sortSizes),
      priceMin: priceMin === Infinity ? 0 : Math.floor(priceMin),
      priceMax: priceMax === 0 ? DEFAULT_PRICE_MAX : Math.ceil(priceMax),
    };
  }

  async findByHandle(handle: string) {
    return prisma.product.findFirst({
      where: {
        handle,
        ...storefrontVisibility,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          include: { inventory: true },
          orderBy: [{ colorSlug: "asc" }, { sizeValue: "asc" }],
        },
        category: true,
        reviews: {
          where: { isApproved: true },
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { firstName: true, lastName: true, image: true } },
          },
        },
      },
    });
  }

  async findRelated(productId: string, categoryId: string | null, limit = 4) {
    return prisma.product.findMany({
      where: {
        ...storefrontVisibility,
        id: { not: productId },
        ...(categoryId ? { categoryId } : {}),
      },
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true }, take: 1, include: { inventory: true } },
      },
    });
  }
}

export const productRepository = new ProductRepository();
