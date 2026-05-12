export interface ProductVariant {
  id: string;

  displayName: string;

  sku: string;

  barcode: string;

  sellingPrice: string;

  gstRate: string;

  product: {
    name: string;

    brand: {
      name: string;
    };
  };
}
