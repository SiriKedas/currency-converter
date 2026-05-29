import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatestRates } from '../services/exchangeRateApi';
import { cacheRates, getCachedRates } from '../utils/cacheUtils';

export function useExchangeRates(baseCurrency = 'USD') {
  const [state, setState] = useState({
    rates: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
    isStale: false,
  });

  // useRef to track if a forced refresh was requested
  const forceRefreshRef = useRef(false);

  const refresh = useCallback(() => {
    forceRefreshRef.current = true;
    // Trigger re-run of the effect by bumping a counter
    setState(prev => ({ ...prev, isLoading: true }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      const forceRefresh = forceRefreshRef.current;
      forceRefreshRef.current = false;

      // Check cache first (unless forced refresh)
      if (!forceRefresh) {
        const cached = getCachedRates(baseCurrency);
        if (cached && !cancelled) {
          setState({
            rates: cached.data.rates,
            isLoading: false,
            error: null,
            lastUpdated: cached.data.lastUpdate,
            isStale: cached.age > 15 * 60 * 1000,
          });
          return;
        }
      }

      try {
        const data = await fetchLatestRates(baseCurrency);
        if (!cancelled) {
          cacheRates(baseCurrency, data);
          setState({
            rates: data.rates,
            isLoading: false,
            error: null,
            lastUpdated: data.lastUpdate,
            isStale: false,
          });
        }
      } catch (err) {
        if (!cancelled) {
          // Graceful degradation: try stale cache on API failure
          const staleCache = getCachedRates(baseCurrency);
          setState({
            rates: staleCache?.data.rates ?? null,
            isLoading: false,
            error: err.message,
            lastUpdated: staleCache?.data.lastUpdate ?? null,
            isStale: true,
          });
        }
      }
    }

    loadRates();

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, state.isLoading]); // state.isLoading re-triggers when refresh() is called

  return {
    ...state,
    refresh,
  };
}