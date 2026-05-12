export function calculateGSTAmount(amount: number, gstRate: number) {
  return (amount * gstRate) / 100;
}
