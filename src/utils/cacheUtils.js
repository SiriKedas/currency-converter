/**
 * cacheUtils.js
 * Simple localStorage caching for exchange rate data.
 * Prevents hitting API on every component mount.
 * 
 * FinTech concept: API response caching is critical in production systems.
 * Exchanges charge per API call. Unnecessary calls cost real money.
 * Caching also provides resilience if the API is temporarily down.
 */

const CACHE_KEY_PREFIX = 'currency_rates_';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Store rates in cache with timestamp
 */
export function cacheRates(baseCurrency, data) {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      currency: baseCurrency,
    };
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${baseCurrency}`, 
      JSON.stringify(cacheEntry)
    );
  } catch (error) {
    // localStorage might be full — fail silently (cache is optional)
    console.warn('Failed to cache rates:', error);
  }
}

/**
 * Get rates from cache if they're fresh enough
 * Returns null if cache is stale or missing
 */
export function getCachedRates(baseCurrency) {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${baseCurrency}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const isStale = Date.now() - timestamp > CACHE_DURATION_MS;
    
    if (isStale) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${baseCurrency}`);
      return null;
    }
    
    return { data, age: Date.now() - timestamp };
  } catch {
    return null;
  }
}

/**
 * Store rate observation for history tracking
 * We record today's rate so we can show historical data over time
 */
export function recordRateObservation(pair, rate) {
  try {
    const key = `rate_history_${pair}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    const today = new Date().toISOString().split('T')[0]; // "2025-01-14"
    
    // Avoid duplicate entries for the same day
    const withoutToday = existing.filter(entry => entry.date !== today);
    const updated = [...withoutToday, { date: today, rate }]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-90); // Keep max 90 days of history
    
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    console.warn('Failed to record rate observation');
  }
}

export function getRateHistory(pair) {
  try {
    return JSON.parse(localStorage.getItem(`rate_history_${pair}`) || '[]');
  } catch {
    return [];
  }
}