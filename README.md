# Currency Converter & Exchange Rate Tracker

A real-time currency converter with multi-currency comparison and rate history visualization — built with React, Axios, and ExchangeRate-API.

**Live Demo:** [your-vercel-url-here]

---

## Features

- **Live Conversion** — Convert between 160+ currencies with real-time exchange rates
- **Multi-Currency Table** — See one amount converted to 8+ currencies simultaneously
- **Rate History Chart** — Visualize 7-day, 30-day, or 90-day rate trends
- **Smart Caching** — Rates cached for 30 minutes to minimize API calls
- **Offline Resilience** — Falls back to stale cache if the API is unavailable
- **Searchable Selector** — Find any currency by code or name instantly

---

## Tech Stack

| Layer  | Technology   | Why                                                    |
| ------ | ------------ | ------------------------------------------------------ |
| UI     | React + Vite | Fast dev server, modern tooling                        |
| HTTP   | Axios        | Auto-throws on non-2xx, better interceptors than fetch |
| Charts | Recharts     | Composable, React-native charting                      |
| Dates  | date-fns     | Tree-shakeable, clean date formatting                  |
| Styles | Tailwind CSS | Utility-first, consistent design                       |

---

## Architecture

### Service Layer Pattern

All API calls are isolated in `src/services/exchangeRateApi.js`. Components never call `fetch` or `axios` directly. This means if the API changes its endpoint or auth format, only one file needs updating.
src/
├── services/ # All external API calls (one file per API)
├── hooks/ # Data fetching + business logic
├── components/ # Pure UI, receives data as props
├── utils/ # Caching, formatting, simulation helpers
└── constants/ # Currency metadata, defaults

### Caching Strategy

Component mounts
↓
Check localStorage cache
↓ fresh (< 30 min) ↓ stale or missing
Use cached data Fetch from API
↓
Store in cache
↓
Update UI

Caching reduces API calls by ~95% during normal use. Free tier limit is 1,500 requests/month — with 30-minute caching, 24/7 usage consumes ~1,440 requests/month maximum.

### Cross-Rate Calculation

All rates are returned relative to a base currency (USD). To convert between any two non-USD currencies:
result = amount × (1 / rates[from]) × rates[to]
↑ convert from → USD ↑ convert USD → target

Example: ₹10,000 → EUR
10000 × (1 / 84.5) × 0.92 = €108.87

---

## Rate History

> **Note:** ExchangeRate-API's free tier does not include historical data. The rate history chart uses **simulated data** — realistic daily fluctuations (±0.3%) applied to the current live rate. This is clearly a demo feature and is documented here for transparency.

For real historical data, the app records each day's observed rate in `localStorage`. After 30+ days of use, the chart will display real observed rates instead of simulated ones.

---

## Setup

### Prerequisites

- Node.js 18+
- A free API key from [exchangerate-api.com](https://www.exchangerate-api.com) (no credit card required)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/currency-converter.git
cd currency-converter
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
VITE_EXCHANGE_RATE_API_KEY=your_actual_key_here

**Never commit `.env.local`.** It is gitignored by default.

### Run locally

```bash
npm run dev
```

---

## API Security Note

The API key is stored in `.env.local` and accessed via `import.meta.env.VITE_EXCHANGE_RATE_API_KEY`. In a Vite app, environment variables prefixed with `VITE_` are embedded in the client bundle at build time — meaning they are technically visible in the browser.

For a production fintech app, the correct pattern is:

- Keep the API key on a backend server (Node/Express, serverless function)
- Frontend calls your backend, backend calls the exchange rate API
- The key never reaches the client

This project uses the direct approach as it's a portfolio demo with a free-tier key.

---

## Deployment (Vercel)

1. Push to GitHub (done)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo
3. In **Environment Variables**, add:
   - Key: `VITE_EXCHANGE_RATE_API_KEY`
   - Value: your actual API key
4. Click **Deploy**

---

## What This Demonstrates

- **REST API integration** — Consuming a real financial data API
- **Async handling** — Loading, error, and success states properly managed
- **Caching** — Understanding API rate limits and cost; implementing localStorage TTL cache
- **Service layer** — Architectural pattern for maintainable API abstraction
- **Graceful degradation** — App stays functional if the API goes down
