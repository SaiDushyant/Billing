import { Prisma, StockMovementType } from "@prisma/client";
import { prisma } from "../../config/prisma";

export class InventoryService {
  // =========================
  // STOCK CALCULATION ENGINE
  // =========================
  private static calculateStock(movements: any[]) {
    let stock = 0;

    for (const movement of movements) {
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

    return stock;
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
      const movements = await tx.stockMovement.findMany({
        where: { variantId: data.variantId },
      });

      const currentStock = this.calculateStock(movements);

      let stockChange = 0;

      switch (data.type) {
        case "PURCHASE":
        case "RETURN":
        case "ADJUSTMENT":
          stockChange = data.quantity;
          break;

        case "SALE":
        case "DAMAGED":
          stockChange = -data.quantity;
          break;
      }

      const newStock = currentStock + stockChange;

      if (newStock < 0) {
        throw new Error(`Insufficient stock. Available: ${currentStock}`);
      }

      const movement = await tx.stockMovement.create({
        data: {
          variantId: data.variantId,
          type: data.type,
          quantity: data.quantity,
          notes: data.notes,
          referenceId: data.referenceId,
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
    const movements = await prisma.stockMovement.findMany({
      where: { variantId },
    });

    return this.calculateStock(movements);
  }

  // =========================
  // VALIDATE STOCK
  // =========================
  static async validateStock(variantId: string, quantity: number) {
    const movements = await prisma.stockMovement.findMany({
      where: { variantId },
    });

    const stock = this.calculateStock(movements);

    if (stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${stock}`);
    }

    return true;
  }

  // =========================
  // PURCHASE ENTRY (ERP STYLE)
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

        // ONLY LEDGER ENTRY (NO STOCK FIELD UPDATE)
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,
            type: "PURCHASE",
            quantity: item.quantity,
            referenceId: purchase.id,
            notes: `Purchase Invoice ${data.invoiceNumber}`,
          },
        });
      }

      return purchase;
    });
  }

  // =========================
  // INVENTORY OVERVIEW
  // =========================
  static async getInventoryOverview() {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          include: { brand: true },
        },
      },
    });

    return await Promise.all(
      variants.map(async (variant) => {
        const movements = await prisma.stockMovement.findMany({
          where: { variantId: variant.id },
        });

        const stock = this.calculateStock(movements);

        return {
          id: variant.id,
          displayName: variant.displayName,
          sku: variant.sku,
          barcode: variant.barcode,
          sellingPrice: variant.sellingPrice,
          currentStock: stock,
          lowStock: stock < 5,
          product: variant.product,
        };
      }),
    );
  }
}
