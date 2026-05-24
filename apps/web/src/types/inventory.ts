export interface InventoryVariant {
  id: string;

  displayName: string;

  sku: string;

  barcode: string;

  currentStock: number;

  costPrice: string;

  mrp: string;

  profitMargin: string;

  // Computed from backend
  sellingPrice: number;

  gstRate: string;

  createdAt: string;

  updatedAt: string;

  product: {
    id: string;

    name: string;

    brand: {
      category: any;
      id: string;

      name: string;
    };
  };
}

export interface InventoryResponse {
  items: InventoryVariant[];

  total: number;

  totalPages: number;

  stats: {
    totalProducts: number;

    lowStock: number;

    outOfStock: number;

    inventoryValue: number;
  };
}
