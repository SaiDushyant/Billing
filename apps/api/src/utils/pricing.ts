export function calculateSellingPrice(costPrice: number, profitMargin: number) {
  return costPrice + (costPrice * profitMargin) / 100;
}
