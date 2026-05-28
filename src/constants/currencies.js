/**
 * Major world currencies with metadata for UI display
 * Includes: ISO code, symbol, full name, flag emoji, decimal places
 */
export const CURRENCIES = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    decimals: 2
  },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", decimals: 2 },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    decimals: 2
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    decimals: 2
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    flag: "🇯🇵",
    decimals: 0
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "🇦🇺",
    decimals: 2
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    decimals: 2
  },
  CHF: {
    code: "CHF",
    symbol: "Fr",
    name: "Swiss Franc",
    flag: "🇨🇭",
    decimals: 2
  },
  CNY: {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    flag: "🇨🇳",
    decimals: 2
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    flag: "🇸🇬",
    decimals: 2
  },
  AED: {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    flag: "🇦🇪",
    decimals: 2
  },
  MYR: {
    code: "MYR",
    symbol: "RM",
    name: "Malaysian Ringgit",
    flag: "🇲🇾",
    decimals: 2
  },
  THB: {
    code: "THB",
    symbol: "฿",
    name: "Thai Baht",
    flag: "🇹🇭",
    decimals: 2
  },
  HKD: {
    code: "HKD",
    symbol: "HK$",
    name: "Hong Kong Dollar",
    flag: "🇭🇰",
    decimals: 2
  }
};

// Popular pairs for quick comparison
export const DEFAULT_COMPARISON_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SGD",
  "AUD",
  "CAD",
  "JPY"
];

export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "INR";

export function formatAmount(amount, currencyCode) {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount}`;

  return `${currency.symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals
  })}`;
}
