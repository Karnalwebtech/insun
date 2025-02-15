// currencyUtils.js
export const formatCurrency = (
    amount: number,
    currency: string = "INR",
    locale: string = "en-IN"
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };