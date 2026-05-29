import { useState } from "react";
import { CURRENCIES } from "../../constants/currencies";

/**
 * CurrencySelector - searchable dropdown for selecting a currency
 * Includes flag, currency code, and full name
 * Uses a simple input-based search filter (no external library needed)
 */
export default function CurrencySelector({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currencies = Object.values(CURRENCIES);
  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = CURRENCIES[value];

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {label}
        </label>
      )}

      {/* Selected currency display button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 
                   rounded-lg hover:border-blue-400 transition-colors text-left"
      >
        <span className="text-xl">{selected?.flag}</span>
        <span className="font-medium text-gray-900">{selected?.code}</span>
        <span className="text-sm text-gray-500 flex-1">{selected?.name}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                        rounded-xl shadow-xl z-50 max-h-64 overflow-hidden"
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Currency list */}
          <div className="overflow-y-auto max-h-48">
            {filtered.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  onChange(currency.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-blue-50 
                            transition-colors text-left
                            ${value === currency.code ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
              >
                <span className="text-lg">{currency.flag}</span>
                <span className="font-medium w-10">{currency.code}</span>
                <span className="text-gray-500">{currency.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No currencies found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearch("");
          }}
        />
      )}
    </div>
  );
}
