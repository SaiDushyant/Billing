import { prisma } from "../../config/prisma";

export class AnalyticsService {
  static async getDashboardAnalytics(filters: {
    startDate?: string;

    endDate?: string;

    top?: number;
  }) {
    const whereClause: any = {
      type: {
        in: ["INVOICE", "BILL"],
      },

      status: "COMPLETED",
    };

    if (filters.startDate && filters.endDate) {
      whereClause.createdAt = {
        gte: new Date(filters.startDate),

        lte: new Date(filters.endDate),
      };
    }

    const documents = await prisma.document.findMany({
      where: whereClause,

      include: {
        items: {
          include: {
            variant: true,
          },
        },

        payments: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    let totalRevenue = 0;

    let totalGST = 0;

    let totalSales = documents.length;

    let totalProductsSold = 0;

    const productSalesMap = new Map<
      string,
      {
        name: string;
        quantity: number;
        revenue: number;
      }
    >();

    const customerMap = new Map<
      string,
      {
        name: string;
        orders: number;
        amount: number;
      }
    >();

    const placeMap = new Map<
      string,
      {
        place: string;
        orders: number;
        amount: number;
      }
    >();

    for (const document of documents) {
      totalRevenue += Number(document.grandTotal);

      totalGST += Number(document.gstTotal);

      for (const item of document.items) {
        totalProductsSold += item.quantity;

        // TOP PRODUCTS
        const existingProduct = productSalesMap.get(item.variantId);

        if (existingProduct) {
          existingProduct.quantity += item.quantity;

          existingProduct.revenue += Number(item.lineTotal);
        } else {
          productSalesMap.set(item.variantId, {
            name: item.variant.displayName,

            quantity: item.quantity,

            revenue: Number(item.lineTotal),
          });
        }
      }

      // TOP CUSTOMERS
      const customerName = document.customerName || "Walk-in Customer";

      const existingCustomer = customerMap.get(customerName);

      if (existingCustomer) {
        existingCustomer.orders += 1;

        existingCustomer.amount += Number(document.grandTotal);
      } else {
        customerMap.set(customerName, {
          name: customerName,

          orders: 1,

          amount: Number(document.grandTotal),
        });
      }

      // TOP PLACES
      const place = document.customerAddress || "Unknown";

      const existingPlace = placeMap.get(place);

      if (existingPlace) {
        existingPlace.orders += 1;

        existingPlace.amount += Number(document.grandTotal);
      } else {
        placeMap.set(place, {
          place,

          orders: 1,

          amount: Number(document.grandTotal),
        });
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, filters.top || 5);

    const topCustomers = Array.from(customerMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    const topPlaces = Array.from(placeMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    const recentSales = documents.slice(0, 10).map((document) => ({
      id: document.id,

      date: document.createdAt.toISOString(),

      customer: document.customerName || "Walk-in Customer",

      place: document.customerAddress || "Unknown",

      products: document.items
        .map((item) => item.variant.displayName)
        .join(", "),

      totalItems: document.items.reduce((acc, item) => acc + item.quantity, 0),

      totalAmount: Number(document.grandTotal),

      paymentMode: document.payments[0]?.method || "N/A",

      status: document.status,
    }));

    return {
      totalRevenue,

      totalGST,

      totalSales,

      totalProductsSold,

      topProducts,

      topCustomers,

      topPlaces,

      recentSales,
    };
  }

  static async getInventoryAnalytics() {
    const variants = await prisma.productVariant.findMany({
      include: {
        stockMovements: true,

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

      const inventoryValue = stock * Number(variant.costPrice);

      return {
        id: variant.id,

        displayName: variant.displayName,

        stock,

        inventoryValue,

        brand: variant.product.brand.name,

        category: variant.product.brand.category.name,
      };
    });

    const lowStock = inventory.filter(
      (item) => item.stock > 0 && item.stock < 5,
    );

    const outOfStock = inventory.filter((item) => item.stock <= 0);

    const totalInventoryValue = inventory.reduce(
      (sum, item) => sum + item.inventoryValue,
      0,
    );

    return {
      totalProducts: inventory.length,

      lowStockCount: lowStock.length,

      outOfStockCount: outOfStock.length,

      totalInventoryValue,

      lowStock,

      outOfStock,
    };
  }
}
