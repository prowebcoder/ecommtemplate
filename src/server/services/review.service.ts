import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/errors/app-error";
import { mapDbReview } from "@/server/mappers/review.mapper";

const reviewInclude = {
  user: { select: { firstName: true, lastName: true, image: true } },
} as const;

export type UpsertReviewInput = {
  rating: number;
  title?: string;
  body: string;
};

export class ReviewService {
  async syncProductRating(productId: string) {
    const agg = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });
  }

  private async requireActiveProduct(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true },
    });
    if (!product?.isActive) throw new AppError("Product not found", 404);
    return product;
  }

  private async requireActiveProductByHandle(handle: string) {
    const product = await prisma.product.findFirst({
      where: { handle, isActive: true, approvalStatus: "APPROVED" },
      select: { id: true },
    });
    if (!product) throw new AppError("Product not found", 404);
    return product;
  }

  async listForProductHandle(handle: string, userId?: string) {
    const product = await this.requireActiveProductByHandle(handle);
    return this.listForProduct(product.id, userId);
  }

  async listForProduct(productId: string, userId?: string) {
    await this.requireActiveProduct(productId);

    const [reviews, userReview] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        orderBy: { createdAt: "desc" },
        include: reviewInclude,
      }),
      userId
        ? prisma.review.findUnique({
            where: { productId_userId: { productId, userId } },
            include: reviewInclude,
          })
        : Promise.resolve(null),
    ]);

    return {
      reviews: reviews.map(mapDbReview),
      userReview: userReview ? mapDbReview(userReview) : null,
    };
  }

  async upsertByHandle(handle: string, userId: string, input: UpsertReviewInput) {
    const product = await this.requireActiveProductByHandle(handle);
    return this.upsert(product.id, userId, input);
  }

  async upsert(productId: string, userId: string, input: UpsertReviewInput) {
    await this.requireActiveProduct(productId);

    const review = await prisma.review.upsert({
      where: { productId_userId: { productId, userId } },
      create: {
        productId,
        userId,
        rating: input.rating,
        title: input.title?.trim() || null,
        body: input.body.trim(),
        isApproved: true,
      },
      update: {
        rating: input.rating,
        title: input.title?.trim() || null,
        body: input.body.trim(),
      },
      include: reviewInclude,
    });

    await this.syncProductRating(productId);
    return mapDbReview(review);
  }

  async getFeatured(limit = 4) {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true, rating: { gte: 4 } },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        ...reviewInclude,
        product: { select: { title: true, handle: true } },
      },
    });

    return reviews.map(mapDbReview);
  }
}

export const reviewService = new ReviewService();
