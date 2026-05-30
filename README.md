# Currency Converter & Exchange Rate Tracker

A real-time currency conversion app built with React — designed to demonstrate
production-grade API integration patterns used in fintech engineering roles.

**Live Demo:** [currency-converter-xi-lovat-50.vercel.app](https://currency-converter-xi-lovat-50.vercel.app)

---

## Overview

This app solves a real problem: getting fast, visual, multi-currency rate
comparisons without digging through bank portals or Google's buried converter.

Three core panels:

- **Converter** — Enter any amount, convert between 160+ currencies instantly.
  Swap source/target with one click. Shows live rate and last-updated timestamp.

- **Multi-Currency Comparison** — See one amount converted to 8 major currencies
  side-by-side. Updates live as you type.

- **Rate History Chart** — Visualize 7, 30, or 90-day trends for any currency
  pair. Highlights the high, low, and percentage change over the period.

---

## Tech Stack

| Layer      | Technology   |
| ---------- | ------------ |
| UI         | React + Vite |
| HTTP       | Axios        |
| Charts     | Recharts     |
| Dates      | date-fns     |
| Styles     | Tailwind CSS |
| Deployment | Vercel       |

---

## Architecture

src/
├── services/ # API calls isolated here — components never call axios directly
├── hooks/ # Data fetching, caching logic, and conversion state
├── components/ # Pure UI — converter, comparison table, history chart
├── utils/ # localStorage cache helpers, rate simulation, formatting
└── constants/ # Currency metadata — codes, symbols, flags, decimal rules

### Key patterns used

**Service Layer** — All HTTP calls live in `services/exchangeRateApi.js`. If the
API changes its endpoint or auth, one file changes — not ten components.

**Response Caching** — Rates are cached in localStorage with a 30-minute TTL.
Cuts API usage by ~95%, stays within the free tier (1,500 req/month), and keeps
the app functional if the API is temporarily unavailable.

**Graceful Degradation** — On API failure, the app falls back to the most recent
cached data and shows a stale-data warning rather than breaking entirely.

**Cross-Rate Calculation** — Rates are USD-based. Any pair is computed as:
`amount × (1 / rates[from]) × rates[to]` — converting through USD as an
intermediary.

---

## FinTech Relevance

Currency conversion is a core function at Razorpay, Wise, Cashfree, and any
platform handling cross-border payments. This project directly demonstrates:

- Consuming and managing real financial API data
- Understanding API rate limits and cost (caching isn't optional in production)
- Handling async states — loading, error, stale data — the way a real app must
- Architectural decisions that scale: service layers, custom hooks, separation
  of concerns

> Rate history uses simulated fluctuations (±0.3%/day on the live rate) since
> historical data requires a paid API tier. This is documented transparently.
