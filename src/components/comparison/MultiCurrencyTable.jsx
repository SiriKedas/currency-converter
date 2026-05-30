import { useMemo } from "react";
import {
  DEFAULT_COMPARISON_CURRENCIES,
  CURRENCIES,
  formatAmount
} from "../../constants/currencies";
import { convertCurrency } from "../../services/exchangeRateApi";

export default function MultiCurrencyTable({ amount, fromCurrency, rates }) {
  const conversions = useMemo(() => {
    if (!rates) return [];

    return DEFAULT_COMPARISON_CURRENCIES.filter((code) => code !== fromCurrency)
      .map((code) => {
        try {
          const converted = convertCurrency(amount, fromCurrency, code, rates);
          return {
            ...CURRENCIES[code],
            converted,
            rate: convertCurrency(1, fromCurrency, code, rates)
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }, [amount, fromCurrency, rates]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">
          {formatAmount(amount, fromCurrency)} in other currencies
        </h3>
      </div>

      <div className="divide-y divide-gray-50">
        {conversions.map((currency) => (
          <div
            key={currency.code}
            className="flex items-center justify-between px-5 py-3.5 
                          hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currency.flag}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {currency.code}
                </p>
                <p className="text-xs text-gray-500">{currency.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatAmount(currency.converted, currency.code)}
              </p>
              <p className="text-xs text-gray-400">
                1 {fromCurrency} = {currency.rate} {currency.code}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
