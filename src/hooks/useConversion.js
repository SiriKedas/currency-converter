import { useState, useMemo } from 'react';
import { convertCurrency } from '../services/exchangeRateApi';
import { DEFAULT_FROM, DEFAULT_TO } from '../constants/currencies';

export function useConversion(rates) {
  const [amount, setAmount]         = useState(1);
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM);
  const [toCurrency, setToCurrency]   = useState(DEFAULT_TO);

  const convertedAmount = useMemo(() => {
    if (!rates || !amount) return null;
    try {
      return convertCurrency(amount, fromCurrency, toCurrency, rates);
    } catch {
      return null;
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const exchangeRate = useMemo(() => {
    if (!rates) return null;
    try {
      return convertCurrency(1, fromCurrency, toCurrency, rates);
    } catch {
      return null;
    }
  }, [fromCurrency, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return {
    amount, setAmount,
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    convertedAmount,
    exchangeRate,
    swapCurrencies,
  };
}