import { prisma } from "../../config/prisma";

export class AnalyticsService {
  static async getDashboardAnalytics() {
    const documents = await prisma.document.findMany({
      where: {
        type: {
          in: ["INVOICE", "BILL"],
        },

        status: "COMPLETED",
      },

      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    let totalRevenue = 0;

    let totalGST = 0;

    let totalSales = documents.length;

    const productSalesMap = new Map<
      string,
      {
        name: string;
        quantity: number;
        revenue: number;
      }
    >();

    for (const document of documents) {
      totalRevenue += Number(document.grandTotal);

      totalGST += Number(document.gstTotal);

      for (const item of document.items) {
        const existing = productSalesMap.get(item.variantId);

        if (existing) {
          existing.quantity += item.quantity;

          existing.revenue += Number(item.lineTotal);
        } else {
          productSalesMap.set(item.variantId, {
            name: item.variant.displayName,

            quantity: item.quantity,

            revenue: Number(item.lineTotal),
          });
        }
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalRevenue,

      totalGST,

      totalSales,

      topProducts,
    };
  }

  static async getInventoryAnalytics() {
    const variants = await prisma.productVariant.findMany({
      include: {
        stockMovements: true,
      },
    });

    const inventory = variants.map((variant) => {
      let stock = 0;

      for (const movement of variant.stockMovements) {
        switch (movement.type) {
          case "PURCHASE":
          case "RETURN":
            stock += movement.quantity;
            break;

          case "SALE":
          case "DAMAGED":
            stock -= movement.quantity;
            break;

          case "ADJUSTMENT":
            stock += movement.quantity;
            break;
        }
      }

      return {
        id: variant.id,

        displayName: variant.displayName,

        stock,
      };
    });

    const lowStock = inventory.filter((item) => item.stock < 5);

    const outOfStock = inventory.filter((item) => item.stock <= 0);

    return {
      totalProducts: inventory.length,

      lowStock,

      outOfStock,
    };
  }
}
