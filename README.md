# FIRE Calculator

A client-only FIRE (Financial Independence, Retire Early) calculator built for Indian users. Provides year-by-year corpus projections with INR formatting (lakh/crore), dark mode with OS preference detection, and an interactive SVG chart.

**This app was vibe-coded entirely with Claude Code using only requirement specifications and some orchestration and serves as a simple test of capabilities of the Claude Opus 4.6 model.**

## Live Demo

[https://firecalc.onrender.com](https://firecalc.onrender.com)

## Features

- **Indian-specific**: ₹ currency with lakh/crore grouping and compact formatting (₹1.5 Cr, ₹10 L)
- **Comprehensive inputs**: age, income, expenses, savings increment, existing wealth, pre/post-retirement returns, inflation, safe withdrawal rate
- **Auto-derived savings**: monthly savings = income − expenses, unless manually overridden
- **Two-phase projection**: accumulation (monthly compounding) and decumulation (inflation-adjusted withdrawals)
- **Interactive chart**: SVG area chart with hover details, retirement boundary marker, and depletion indicator
- **Dark mode**: follows OS preference (with polling fallback for Linux DEs), manual toggle persists to localStorage

## Tech Stack

React 19, TypeScript, Vite 7, Tailwind CSS v4 — no external UI or charting libraries.

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # serve production build
```
