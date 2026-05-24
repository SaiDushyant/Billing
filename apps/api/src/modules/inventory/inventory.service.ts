import { Prisma, StockMovementType } from "@prisma/client";

import { prisma } from "../../config/prisma";

import { calculateSellingPrice } from "../../utils/pricing";

export class InventoryService {
  // =========================
  // STOCK CALCULATION ENGINE
  // =========================
  private static calculateStock(
    movements: {
      quantity: number;
    }[],
  ) {
    return movements.reduce((total, movement) => total + movement.quantity, 0);
  }

  // =========================
  // CREATE STOCK MOVEMENT
  // =========================
  static async createMovement(data: {
    variantId: string;

    type: StockMovementType;

    quantity: number;

    notes?: string;

    referenceId?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: {
          id: data.variantId,
        },

        select: {
          currentStock: true,
        },
      });

      if (!variant) {
        throw new Error("Variant not found");
      }

      const newStock = variant.currentStock + data.quantity;

      if (newStock < 0) {
        throw new Error(
          `Insufficient stock. Available: ${variant.currentStock}`,
        );
      }

      const movement = await tx.stockMovement.create({
        data: {
          variantId: data.variantId,

          type: data.type,

          // SIGNED QUANTITY
          quantity: data.quantity,

          notes: data.notes,

          referenceId: data.referenceId,
        },
      });

      await tx.productVariant.update({
        where: {
          id: data.variantId,
        },

        data: {
          currentStock: {
            increment: data.quantity,
          },
        },
      });

      return {
        movement,

        currentStock: newStock,
      };
    });
  }

  // =========================
  // GET CURRENT STOCK
  // =========================
  static async getCurrentStock(variantId: string) {
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },

      select: {
        currentStock: true,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    return variant.currentStock;
  }

  // =========================
  // VALIDATE STOCK
  // =========================
  static async validateStock(variantId: string, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },

      select: {
        currentStock: true,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    if (variant.currentStock < quantity) {
      throw new Error(`Insufficient stock. Available: ${variant.currentStock}`);
    }

    return true;
  }

  // =========================
  // PURCHASE ENTRY
  // =========================
  static async createPurchaseEntry(data: {
    supplierId: string;

    invoiceNumber: string;

    items: {
      variantId: string;

      quantity: number;

      unitCost: number;
    }[];
  }) {
    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      for (const item of data.items) {
        totalAmount += item.quantity * item.unitCost;
      }

      const purchase = await tx.purchase.create({
        data: {
          supplierId: data.supplierId,

          invoiceNumber: data.invoiceNumber,

          totalAmount: new Prisma.Decimal(totalAmount),
        },
      });

      for (const item of data.items) {
        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,

            variantId: item.variantId,

            quantity: item.quantity,

            unitCost: new Prisma.Decimal(item.unitCost),
          },
        });

        // PURCHASE = POSITIVE
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,

            type: "PURCHASE",

            quantity: item.quantity,

            referenceId: purchase.id,

            notes: `Purchase Invoice ${data.invoiceNumber}`,
          },
        });

        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },

          data: {
            currentStock: {
              increment: item.quantity,
            },
          },
        });
      }

      return purchase;
    });
  }

  // =========================
  // INVENTORY OVERVIEW
  // =========================
  static async getInventoryOverview({
    page,
    limit,
    search,
    category,
    brand,
    stockStatus,
  }: {
    page: number;

    limit: number;

    search?: string;

    category?: string;

    brand?: string;

    stockStatus?: string;
  }) {
    const andConditions: Prisma.ProductVariantWhereInput[] = [];

    const where: Prisma.ProductVariantWhereInput = {
      AND: andConditions,
    };

    if (search) {
      andConditions.push({
        OR: [
          {
            displayName: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            sku: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            barcode: {
              contains: search,

              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (category) {
      andConditions.push({
        product: {
          brand: {
            category: {
              name: category,
            },
          },
        },
      });
    }

    if (brand) {
      andConditions.push({
        product: {
          brand: {
            name: brand,
          },
        },
      });
    }

    if (stockStatus === "LOW_STOCK") {
      andConditions.push({
        currentStock: {
          gt: 0,

          lte: 5,
        },
      });
    }

    if (stockStatus === "OUT_OF_STOCK") {
      andConditions.push({
        currentStock: {
          lte: 0,
        },
      });
    }

    if (stockStatus === "IN_STOCK") {
      andConditions.push({
        currentStock: {
          gt: 5,
        },
      });
    }

    const total = await prisma.productVariant.count({
      where,
    });

    const variants = await prisma.productVariant.findMany({
      where,

      include: {
        product: {
          include: {
            brand: {
              include: {
                category: true,
              },
            },
          },
        },
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });

    const items = variants.map((variant) => {
      const sellingPrice = calculateSellingPrice(
        Number(variant.costPrice),
        Number(variant.profitMargin),
      );

      return {
        id: variant.id,

        displayName: variant.displayName,

        sku: variant.sku,

        barcode: variant.barcode,

        costPrice: Number(variant.costPrice),

        mrp: Number(variant.mrp),

        profitMargin: Number(variant.profitMargin),

        sellingPrice,

        gstRate: Number(variant.gstRate),

        currentStock: variant.currentStock,

        lowStock: variant.currentStock < 5,

        inventoryValue: sellingPrice * variant.currentStock,

        product: variant.product,
      };
    });

    const totalProducts = await prisma.productVariant.count();

    const lowStock = await prisma.productVariant.count({
      where: {
        currentStock: {
          gt: 0,

          lte: 5,
        },
      },
    });

    const outOfStock = await prisma.productVariant.count({
      where: {
        currentStock: {
          lte: 0,
        },
      },
    });

    const inventoryValue = items.reduce(
      (sum, item) => sum + item.inventoryValue,
      0,
    );

    return {
      items,

      total,

      totalPages: Math.ceil(total / limit),

      stats: {
        totalProducts,

        lowStock,

        outOfStock,

        inventoryValue,
      },
    };
  }

  // =========================
  // STOCK RECONCILIATION
  // =========================
  static async reconcileStock(variantId: string) {
    const movements = await prisma.stockMovement.findMany({
      where: {
        variantId,
      },

      select: {
        quantity: true,
      },
    });

    const actualStock = this.calculateStock(movements);

    await prisma.productVariant.update({
      where: {
        id: variantId,
      },

      data: {
        currentStock: actualStock,
      },
    });

    return {
      variantId,

      actualStock,
    };
  }

  static async getCategories() {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,

        name: true,
      },
    });

    return categories;
  }

  static async getBrands() {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,

        name: true,
      },
    });

    return brands;
  }
}
