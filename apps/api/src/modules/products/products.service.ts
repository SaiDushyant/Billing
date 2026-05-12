import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

export class ProductsService {
  static async createCategory(name: string) {
    return prisma.category.create({
      data: {
        name,
      },
    });
  }

  static async createBrand(name: string, categoryId: string) {
    return prisma.brand.create({
      data: {
        name,
        categoryId,
      },
    });
  }

  static async createProduct(
    name: string,
    brandId: string,
    description?: string,
  ) {
    return prisma.product.create({
      data: {
        name,
        brandId,
        description,
      },
    });
  }

  static async createVariant(data: {
    productId: string;
    displayName: string;
    attributes: any;
    costPrice: number;
    sellingPrice: number;
    gstRate: number;
    sku: string;
    barcode: string;
  }) {
    return prisma.productVariant.create({
      data: {
        ...data,
      },
    });
  }

  static async searchVariants(search: string) {
    return prisma.productVariant.findMany({
      where: {
        OR: [
          {
            sku: {
              contains: search,

              mode: Prisma.QueryMode.insensitive,
            },
          },

          {
            barcode: {
              contains: search,
            },
          },

          {
            displayName: {
              contains: search,

              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      },

      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },

      take: 20,
    });
  }

  static async updateVariant(id: string, data: any) {
    return prisma.productVariant.update({
      where: {
        id,
      },

      data,
    });
  }

  static async getVariants(options: {
    search?: string;

    page?: number;

    limit?: number;
  }) {
    const page = options.page || 1;

    const limit = options.limit || 20;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductVariantWhereInput = options.search
      ? {
          OR: [
            {
              displayName: {
                contains: options.search,

                mode: Prisma.QueryMode.insensitive,
              },
            },

            {
              sku: {
                contains: options.search,

                mode: Prisma.QueryMode.insensitive,
              },
            },

            {
              barcode: {
                contains: options.search,
              },
            },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,

        skip,

        take: limit,

        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.productVariant.count({
        where,
      }),
    ]);

    return {
      items,

      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),
    };
  }

  static async importVariants(rows: any[]) {
    const results = [];

    for (const row of rows) {
      try {
        let category = await prisma.category.findFirst({
          where: { name: row.categoryName },
        });

        if (!category) {
          category = await prisma.category.create({
            data: { name: row.categoryName },
          });
        }

        let brand = await prisma.brand.findFirst({
          where: { name: row.brandName },
        });

        if (!brand) {
          brand = await prisma.brand.create({
            data: {
              name: row.brandName,
              categoryId: category.id,
            },
          });
        }

        let product = await prisma.product.findFirst({
          where: { name: row.productName },
        });

        if (!product) {
          product = await prisma.product.create({
            data: {
              name: row.productName,
              brandId: brand.id,
            },
          });
        }

        // DUPLICATE CHECK
        const existingVariant = await prisma.productVariant.findFirst({
          where: {
            OR: [{ sku: row.sku }, { barcode: row.barcode }],
          },
        });

        if (existingVariant) {
          results.push({
            success: false,
            error: "SKU or barcode already exists",
            row,
          });
          continue;
        }

        // CREATE VARIANT (NO currentStock HERE)
        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            displayName: row.displayName,
            sku: row.sku,
            barcode: row.barcode,
            attributes: {},
            costPrice: Number(row.costPrice),
            sellingPrice: Number(row.sellingPrice),
            gstRate: Number(row.gstRate),
          },
        });

        // OPENING STOCK = STOCK MOVEMENT (ONLY SOURCE OF TRUTH)
        const qty = Number(row.quantity || 0);

        if (qty > 0) {
          await prisma.stockMovement.create({
            data: {
              variantId: variant.id,
              type: "PURCHASE",
              quantity: qty,
              notes: "Opening stock import",
            },
          });
        }

        results.push({
          success: true,
          variant,
        });
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          row,
        });
      }
    }

    return results;
  }
}
