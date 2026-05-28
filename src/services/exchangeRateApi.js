
import axios from 'axios';

const BASE_URL = 'https://v6.exchangerate-api.com/v6';
const API_KEY  = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

// Create axios instance with default config
// In a real app, you'd add request interceptors here for auth tokens
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds — fail fast rather than hang forever
});

/**
 * Fetch latest exchange rates for a given base currency
 * @param {string} baseCurrency - ISO 4217 code, e.g. "USD", "INR", "EUR"
 * @returns {Promise<{ rates: Object, lastUpdate: string, nextUpdate: string }>}
 */
export async function fetchLatestRates(baseCurrency = 'USD') {
  try {
    const response = await apiClient.get(`/${API_KEY}/latest/${baseCurrency}`);
    
    if (response.data.result !== 'success') {
      throw new Error(`API returned failure: ${response.data['error-type']}`);
    }
    
    return {
      baseCurrency: response.data.base_code,
      rates: response.data.conversion_rates,
      lastUpdate: response.data.time_last_update_utc,
      nextUpdate: response.data.time_next_update_utc,
    };
  } catch (error) {
    // Re-throw with a user-friendly message, preserving the original
    // error as `cause` so the full stack trace is available for debugging
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your .env.local file.', { cause: error });
      }
      if (error.response?.status === 429) {
        throw new Error('API rate limit reached. Using cached data.', { cause: error });
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Check your internet connection.', { cause: error });
      }
    }
    // Not an axios error (e.g. the result !== 'success' throw above) —
    // re-throw as-is so we don't lose the original message
    throw error;
  }
}

/**
 * Convert an amount between currencies
 * Uses the rates from fetchLatestRates to compute cross-rates
 * 
 * @param {number} amount
 * @param {string} from  - source currency code
 * @param {string} to    - target currency code
 * @param {Object} rates - rates object from fetchLatestRates (base = USD)
 */
export function convertCurrency(amount, from, to, rates) {
  if (!rates[from] || !rates[to]) {
    throw new Error(`Currency not found: ${!rates[from] ? from : to}`);
  }
  
  // Cross-rate calculation: amount → USD → target
  // If rates are USD-based: from_to_rate = rates[to] / rates[from]
  const fromToUSD = 1 / rates[from];    // Convert from → USD
  const usdToTarget = rates[to];         // Convert USD → target
  const result = amount * fromToUSD * usdToTarget;
  
  return Math.round(result * 10000) / 10000; // 4 decimal places
}