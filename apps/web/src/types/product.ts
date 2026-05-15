export interface ProductVariant {
  id: string;

  displayName: string;

  sku: string;

  barcode: string;

  costPrice: string;

  mrp: string;

  profitMargin: string;

  // Computed dynamically
  sellingPrice: number;

  gstRate: string;

  product: {
    name: string;

    brand: {
      name: string;
    };
  };
}
