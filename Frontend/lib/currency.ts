export const DEFAULT_BUDGET_INR = 166500; // ₹166,500 (equivalent to $2000)

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};