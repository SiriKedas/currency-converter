import CurrencyConverter from "./components/converter/CurrencyConverter";
import MultiCurrencyTable from "./components/comparison/MultiCurrencyTable";
import RateHistoryChart from "./components/history/RateHistoryChart";
import { useExchangeRates } from "./hooks/useExchangeRates";
import { useConversion } from "./hooks/useConversion";
import { useState } from "react";

export default function App() {
  // eslint-disable-next-line no-unused-vars
  const { rates, isLoading, error, lastUpdated, isStale, refresh } =
    useExchangeRates("USD");
  // eslint-disable-next-line no-unused-vars
  const { amount, fromCurrency, toCurrency, exchangeRate, ...rest } =
    useConversion(rates);
  const [activeTab, setActiveTab] = useState("converter");

  const tabs = [
    { id: "converter", label: "💱 Converter" },
    { id: "compare", label: "📊 Compare" },
    { id: "history", label: "📈 History" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Currency Converter
          </h1>
          <p className="text-gray-500 mt-1">Real-time exchange rates</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {activeTab === "converter" && <CurrencyConverter />}

        {activeTab === "compare" && rates && (
          <MultiCurrencyTable
            amount={amount}
            fromCurrency={fromCurrency}
            rates={rates}
          />
        )}

        {activeTab === "history" && exchangeRate && (
          <RateHistoryChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            currentRate={exchangeRate}
          />
        )}
      </div>
    </div>
  );
}
