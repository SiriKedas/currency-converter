import { useExchangeRates } from "../../hooks/useExchangeRates";
import { useConversion } from "../../hooks/useConversion";
import CurrencySelector from "./CurrencySelector";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import { formatAmount } from "../../constants/currencies";
import { format } from "date-fns";

export default function CurrencyConverter() {
  const { rates, isLoading, error, lastUpdated, isStale, refresh } =
    useExchangeRates("USD");
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    convertedAmount,
    exchangeRate,
    swapCurrencies
  } = useConversion(rates);

  if (isLoading)
    return <LoadingSpinner message="Fetching latest exchange rates..." />;
  if (error && !rates)
    return <ErrorMessage message={error} onRetry={refresh} />;

  return (
    <div className="space-y-6">
      {/* Stale data warning */}
      {isStale && (
        <div
          className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center 
                        justify-between text-sm"
        >
          <span className="text-amber-700">
            Showing cached rates. Rates may be outdated.
          </span>
          <button
            onClick={refresh}
            className="text-amber-800 font-medium underline"
          >
            Refresh
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Currency Converter
        </h2>

        <div className="space-y-4">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-3 text-xl font-semibold border border-gray-200 
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount..."
            />
          </div>

          {/* From currency */}
          <CurrencySelector
            value={fromCurrency}
            onChange={setFromCurrency}
            label="From"
          />

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="w-10 h-10 bg-gray-100 hover:bg-blue-50 rounded-full flex items-center 
                         justify-center text-gray-500 hover:text-blue-600 transition-colors
                         border border-gray-200 hover:border-blue-300"
              title="Swap currencies"
            >
              ⇅
            </button>
          </div>

          {/* To currency */}
          <CurrencySelector
            value={toCurrency}
            onChange={setToCurrency}
            label="To"
          />
        </div>

        {/* Result display */}
        {convertedAmount !== null && (
          <div
            className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 
                          rounded-xl border border-blue-100"
          >
            <p className="text-sm text-blue-600 mb-1">
              {formatAmount(amount, fromCurrency)} equals
            </p>
            <p className="text-4xl font-bold text-blue-900">
              {formatAmount(convertedAmount, toCurrency)}
            </p>
            {exchangeRate && (
              <p className="text-sm text-blue-600 mt-2">
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
            )}
          </div>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Rates updated: {format(new Date(lastUpdated), "dd MMM yyyy, HH:mm")}{" "}
            UTC
          </p>
        )}
      </div>
    </div>
  );
}
