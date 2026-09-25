// Global International Currency & Number Formatters

export const formatCurrency = (amount: number, symbol: string = '$'): string => {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const formatPercentage = (percent: number): string => {
  return `${percent.toFixed(1)}%`;
};
