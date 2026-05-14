export interface InventoryVariant {
  id: string;

  displayName: string;

  sku: string;

  barcode: string;

  currentStock: number;

  costPrice: string;

  sellingPrice: string;

  gstRate: string;

  createdAt: string;

  updatedAt: string;

  product: {
    id: string;

    name: string;

    brand: {
      id: string;

      name: string;
    };
  };
}

export interface InventoryResponse {
  items: InventoryVariant[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}