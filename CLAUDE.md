# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check with `tsc -b` then bundle with Vite
- `npm run lint` — ESLint (flat config, ESLint 9+)
- `npm run preview` — Serve production build locally

## Architecture

Client-only React FIRE (Financial Independence, Retire Early) calculator targeting Indian users. No backend, no external UI or charting libraries.

**Stack:** Vite 7 + React 19 + TypeScript 5.9 (strict) + Tailwind CSS v4 (via `@tailwindcss/vite` plugin)

### Data flow

`App.tsx` owns two hooks: `useDarkMode()` for theme state and `useFireCalculator()` for all input state + memoized results. Inputs flow down through `InputSection` → `InputField`, and `fireCalc.ts` runs the projection math on every input change via `useMemo`. Results render through `ResultsSection` → `SummaryCard` + `ProjectionChart` (interactive SVG).

### Theming

Dark mode uses CSS custom properties defined in `index.css`, **not** Tailwind's `dark:` utilities. Light values are set in `@theme`, dark overrides live under a `.dark` selector on `<html>`. Components reference colors via inline `style={{ color: 'var(--color-*)' }}`. This makes dark mode work by toggling a single class, independent of Tailwind variant resolution.

The `useDarkMode` hook tracks OS preference via `matchMedia` listener + a 1s polling fallback (some Linux DEs don't fire the `change` event). Manual override is stored in `localStorage('fire-calc-theme-override')` and auto-clears when the user toggles back to match OS.

### INR formatting

`formatINR()` uses `Intl.NumberFormat('en-IN')` for lakh/crore comma grouping. `formatINRCompact()` produces abbreviated forms: "₹5.25 Cr", "₹12.5 L". These are in `src/utils/format.ts`.

### FIRE calculation

`src/utils/fireCalc.ts` has two phases: accumulation (monthly compounding with yearly savings increment) and decumulation (inflation-adjusted withdrawals). It returns year-by-year projections, FIRE number (SWR method), surplus/deficit, and corpus depletion age.

### Key convention

`useFireCalculator` auto-derives monthly savings as `income − expenses` unless the user has explicitly edited the savings field (tracked by `savingsManuallySet` flag).
