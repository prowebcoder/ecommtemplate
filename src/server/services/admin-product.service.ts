import { prisma } from "@/server/db/prisma";
import { AppError } from "@/server/errors/app-error";
import type { CreateProductInput } from "@/server/validation/admin-product.schema";
import type { Prisma, ProductApprovalStatus } from "@prisma/client";

export class AdminProductService {
  async list(params: {
    page?: number;
    limit?: number;
    approvalStatus?: ProductApprovalStatus;
    vendorId?: string;
    search?: string;
  }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);
    const where: Prisma.ProductWhereInput = {};
    if (params.approvalStatus) where.approvalStatus = params.approvalStatus;
    if (params.vendorId) where.vendorId = params.vendorId;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { handle: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          vendor: { select: { id: true, shopName: true, slug: true } },
          category: { select: { name: true } },
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          variants: { take: 1, include: { inventory: true } },
          _count: { select: { variants: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { include: { inventory: true } },
      },
    });
    if (!product) throw new AppError("Product not found", 404);
    return product;
  }

  async create(input: CreateProductInput, reviewerId?: string) {
    const exists = await prisma.product.findUnique({ where: { handle: input.handle } });
    if (exists) throw new AppError("Handle already exists", 409);

    const status = input.approvalStatus ?? "APPROVED";
    const isActive = input.isActive ?? status === "APPROVED";

    return prisma.product.create({
      data: {
        title: input.title,
        handle: input.handle,
        description: input.description,
        brand: input.brand,
        categoryId: input.categoryId,
        vendorId: input.vendorId,
        materials: input.materials,
        approvalStatus: status,
        isActive,
        isFeatured: input.isFeatured ?? false,
        reviewedAt: status === "APPROVED" ? new Date() : undefined,
        reviewedById: status === "APPROVED" ? reviewerId : undefined,
        images: {
          create: input.imageUrls.map((url, i) => ({ url, sortOrder: i })),
        },
        variants: {
          create: input.variants.map((v) => ({
            sku: v.sku,
            barcode: v.barcode,
            colorName: v.colorName,
            colorHex: v.colorHex,
            colorSlug: v.colorSlug,
            sizeLabel: v.sizeLabel,
            sizeValue: v.sizeValue,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            inventory: { create: { quantity: v.quantity } },
          })),
        },
      },
      include: { variants: true, images: true, vendor: true },
    });
  }

  async approve(id: string, reviewerId: string) {
    return prisma.product.update({
      where: { id },
      data: {
        approvalStatus: "APPROVED",
        isActive: true,
        rejectionReason: null,
        reviewedAt: new Date(),
        reviewedById: reviewerId,
      },
    });
  }

  async reject(id: string, reviewerId: string, reason: string) {
    return prisma.product.update({
      where: { id },
      data: {
        approvalStatus: "REJECTED",
        isActive: false,
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedById: reviewerId,
      },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  async updateFull(id: string, input: CreateProductInput, reviewerId?: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError("Product not found", 404);

    if (input.handle !== existing.handle) {
      const clash = await prisma.product.findUnique({ where: { handle: input.handle } });
      if (clash) throw new AppError("Handle already exists", 409);
    }

    const status = input.approvalStatus ?? existing.approvalStatus;
    const isActive = input.isActive ?? (status === "APPROVED");

    return prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
        data: {
          title: input.title,
          handle: input.handle,
          description: input.description,
          brand: input.brand,
          categoryId: input.categoryId || null,
          vendorId: input.vendorId || null,
          materials: input.materials,
          approvalStatus: status,
          isActive,
          isFeatured: input.isFeatured ?? existing.isFeatured,
          reviewedAt: status === "APPROVED" ? new Date() : existing.reviewedAt,
          reviewedById: status === "APPROVED" ? reviewerId ?? existing.reviewedById : existing.reviewedById,
          images: {
            create: input.imageUrls.map((url, i) => ({ url, sortOrder: i })),
          },
          variants: {
            create: input.variants.map((v) => ({
              sku: v.sku,
              barcode: v.barcode,
              colorName: v.colorName,
              colorHex: v.colorHex,
              colorSlug: v.colorSlug,
              sizeLabel: v.sizeLabel,
              sizeValue: v.sizeValue,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              inventory: { create: { quantity: v.quantity } },
            })),
          },
        },
        include: {
          images: true,
          variants: { include: { inventory: true } },
          vendor: true,
          category: true,
        },
      });
    });
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}

export const adminProductService = new AdminProductService();
