export function getStockBadgeClass(quantity: number, max: number): string {
  if (max === 0) return "bg-gray-100 text-gray-600";

  const percentage = (quantity / max) * 100;

  if (percentage >= 66.67) return "bg-green-100 text-green-700";
  if (percentage >= 33.34) return "bg-green-100 text-green-700";
  return "bg-green-100 text-green-700";
}
