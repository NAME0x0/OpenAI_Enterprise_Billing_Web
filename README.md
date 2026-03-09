# OpenAI Enterprise Billing Dashboard

A dark-themed enterprise billing management dashboard for monitoring OpenAI API spending, usage, quotas, and sustainability metrics across an organization.

Built with Next.js 15, TypeScript, Tailwind CSS 4, Recharts, and Radix UI. Deployed as a static site to GitHub Pages.

## Features

- **Dashboard** with KPI cards, spend-over-time charts, cost-by-department breakdowns, usage-by-model distribution, and quota utilization bars
- **Usage explorer** with multi-dimensional filtering (department, model, date range) and CSV export
- **Model catalog** showing current OpenAI model pricing per 1M tokens, context windows, and deployment status (GPT-5.4, GPT-5.2, o3, o4-mini, etc.)
- **Department and project tracking** with budget vs. spend progress bars and utilization percentages
- **API key management** displaying key ownership, status lifecycle, and last-used timestamps
- **Alert system** with auto-generated quota warnings, severity tiers, and inline acknowledgment
- **Audit trail** logging every settings change, alert acknowledgment, and system action
- **Reports page** with one-click CSV export for all data collections
- **Settings** for quota thresholds, alert email, currency (USD/EUR/GBP), and role-based preferences
- **Sustainability metrics** estimating energy consumption, CO2 emissions, PUE ratio, and renewable energy share
- **Collapsible sidebar** with keyboard shortcut (`Ctrl+B`), mobile drawer, animated Lucide icons, and tooltip labels
- **Accessibility** including skip-to-content link, focus-visible rings, `aria` labels, `prefers-reduced-motion` support, and 44px mobile touch targets

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, static export) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4, CSS custom properties |
| Charts | Recharts 2.x |
| Primitives | Radix UI (Select, Dialog, Progress, Tooltip, Tabs, etc.) |
| Icons | Lucide React (stroke-draw animation on hover) |
| Font | Geist (loaded via `next/font/google`) |
| State | React Context with localStorage persistence and versioned schema |
| Deployment | GitHub Pages via static export |

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Install and run

```bash
git clone https://github.com/<your-username>/OpenAI_Enterprise_Billing_Web.git
cd OpenAI_Enterprise_Billing_Web
npm install
npm run dev
```

Open [http://localhost:3000/OpenAI_Enterprise_Billing_Web/](http://localhost:3000/OpenAI_Enterprise_Billing_Web/) in your browser.

> The `basePath` is `/OpenAI_Enterprise_Billing_Web` in both dev and production. All routes and data fetches include this prefix.

### Build for production

```bash
npm run build
```

This generates a fully static site in the `out/` directory, ready to deploy anywhere.

## Project structure

```
src/
  app/
    page.tsx              # Dashboard (home)
    usage/page.tsx        # Usage records with filters
    models/page.tsx       # Model catalog and pricing
    departments/page.tsx  # Department budgets
    projects/page.tsx     # Project tracking
    api-keys/page.tsx     # API key management
    alerts/page.tsx       # Alert center
    reports/page.tsx      # CSV exports
    audit/page.tsx        # Audit trail
    settings/page.tsx     # App configuration
    error.tsx             # Error boundary
    not-found.tsx         # 404 page
    globals.css           # Design system tokens and utilities
    layout.tsx            # Root layout with Geist font
    client-layout.tsx     # Sidebar + main content shell
  components/
    dashboard/            # KPI cards, chart wrappers
    layout/               # Sidebar, PageIntro
    shared/               # EmptyState, LoadingSkeleton, StatusBadge
    tables/               # Generic DataTable
    ui/                   # Button, Select, Progress, Label (Radix-based)
  context/
    data-context.tsx      # DataProvider with localStorage caching
  hooks/
    use-filters.ts        # Multi-field usage filtering
    use-prefers-reduced-motion.ts
  lib/
    types.ts              # 9 domain interfaces
    constants.ts          # Chart colors, energy factors, storage key
    formatters.ts         # Currency, number, date, percent formatting
    csv-export.ts         # Client-side CSV download
    energy.ts             # Sustainability metric computation
    cn.ts                 # Tailwind class merge utility
public/
  data/                   # 8 static JSON files (departments, usage, models, etc.)
```

## Data architecture

All data is loaded client-side from static JSON files under `public/data/`. On first load, the `DataProvider` fetches all 8 JSON files in parallel, merges them into an `AppData` object, and persists to `localStorage` with a `dataVersion` key. Subsequent visits load from cache unless the version changes.

### Domain models

| Interface | Fields | Purpose |
|-----------|--------|---------|
| `Department` | id, name, budget, spent, headcount, costCenter | Organizational units with budgets |
| `UsageRecord` | id, departmentId, model, tokens, cost, date, project, user | Granular API consumption logs |
| `Model` | id, name, provider, costPer1kInput/Output, contextWindow, status | Model catalog and pricing |
| `ApiKey` | id, name, key (masked), departmentId, status, permissions | Credential lifecycle |
| `Alert` | id, type, severity, title, message, acknowledged | Quota/anomaly/security notifications |
| `Project` | id, name, departmentId, budget, spent, status | Initiative-level tracking |
| `AuditEntry` | id, action, actor, target, timestamp, category | Immutable activity log |
| `AppSettings` | quotaThreshold, alertEmail, currency, role, dataVersion | Workspace configuration |

### Sample data

The included dataset covers September 2025 through February 2026 with:
- 10 models (GPT-5.4, GPT-5.2, GPT-5-mini, GPT-5-nano, GPT-4.1, GPT-4.1-mini, o4-mini, o3, text-embedding-3-large, GPT-4o deprecated)
- 98 usage records with mathematically consistent costs
- 6 departments, 14 projects, 12 API keys, 10 alerts, 20 audit entries
- Department `spent` values that exactly match the sum of their usage record costs

## Design system

The UI uses a dark-only theme with CSS custom properties defined in `globals.css`:

- **Backgrounds**: `#0a0a0a` (primary) through `#1a1a1f` (elevated)
- **Accent**: Desaturated indigo `#7c85d6` (single accent, not AI-gradient)
- **Shadows**: Cool-tinted (dark navy, not pure black)
- **Surfaces**: `.card-surface` (static), `.card-interactive` (hover lift), `.glass-surface` (backdrop blur + inner shadow)
- **Typography**: Geist with `tabular-nums` on all numeric displays, `text-wrap: balance` on headings
- **Noise overlay**: Fixed SVG feTurbulence pattern at 2.5% opacity for texture
- **Animations**: `slideUp` and `fadeIn` with staggered delays, respecting `prefers-reduced-motion`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build static export to `out/` |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run ESLint |

## Deployment

This project uses Next.js static export, producing a self-contained `out/` directory that can be hosted anywhere.

```bash
npm run build
```

The build is configured for GitHub Pages out of the box:

- `output: "export"` generates static HTML/CSS/JS
- `basePath: "/OpenAI_Enterprise_Billing_Web"` matches the repository name
- `trailingSlash: true` ensures clean URLs on static hosts

Upload the contents of `out/` to GitHub Pages, Netlify, Vercel, S3, or any static file server.

## License

MIT
