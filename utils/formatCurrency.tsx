export const formatAmount = (value: string | number = 0, currency = "CAD") => {
  const numericValue = Number(value);
  return isNaN(numericValue)
    ? `${currency} 0.00`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(numericValue);
};
