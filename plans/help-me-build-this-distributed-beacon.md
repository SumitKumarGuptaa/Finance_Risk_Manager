# RiskGuard AI — Frontend Dashboard Plan

## Context

The user wants to build the frontend for RiskGuard AI: an end-to-end financial fraud detection and risk investigation platform. The overview document describes 6 major modules and 6 dashboard pages. Since this is a Figma Make project (React + Vite + Tailwind v4), we build the complete frontend UI with mock/synthetic data — no backend required. The app is currently a blank `App.tsx`.

## Aesthetic Stance

**Data-dense** (Bloomberg Terminal meets fintech command center).
- Dark canvas: near-black navy `#080C18`
- Electric amber `#F5A623` primary accent (high-risk alerts)
- Electric green `#00E676` for safe/approved states
- Red `#FF3B5C` for fraud/blocked
- Yellow `#FFD600` for medium-risk/hold
- Fonts: **JetBrains Mono** (display, labels, data) + **Outfit** (body/nav copy)

## Pages & Routes (react-router Data Mode)

| Path | Component | Description |
|---|---|---|
| `/` | Dashboard | Stats tiles, recent high-risk transactions table |
| `/transactions` | Transactions | Full filterable/searchable transaction list |
| `/transactions/:id` | TransactionDetail | Detail + risk factors + AI investigation + policy |
| `/analytics` | Analytics | Risk distribution charts (Recharts) |
| `/policies` | Policies | RAG knowledge base: policy cards + search |

Root layout: collapsible sidebar with logo, nav links, system status bar.

## Files to Create / Modify

### Install (new deps)
- `react-router` — multi-page routing
- `recharts` — analytics charts

### New files
```
src/App.tsx              — RouterProvider entry (replace existing blank)
src/routes.tsx           — createBrowserRouter with Root + child routes
src/layouts/Root.tsx     — sidebar nav + <Outlet />
src/data/mockData.ts     — all synthetic transactions, customers, investigations, policies
src/pages/Dashboard.tsx
src/pages/Transactions.tsx
src/pages/TransactionDetail.tsx
src/pages/Analytics.tsx
src/pages/Policies.tsx
src/components/RiskBadge.tsx   — reusable HIGH/MEDIUM/LOW badge
src/components/StatCard.tsx    — reusable stat tile
```

### Modified files
```
src/index.css   — add Google Fonts @import for JetBrains Mono + Outfit; add CSS tokens
```

## Mock Data Shape (`src/data/mockData.ts`)

```ts
// ~20 transactions with full fields:
// id, customerId, amount, timestamp, merchant, location, device, riskScore, riskLevel,
// fraudProbability, riskFactors[], aiInvestigation{}, relevantPolicy, recommendation

// 5 customers with history (usual location, avg amount, device list)
// 7 policy documents with title, category, excerpt, fullText
```

## Key Component Patterns

**Dashboard**: grid of 4 stat tiles (Total Transactions, High Risk, Detection Rate, Avg Risk Score) + recent alerts table with click-through to detail.

**TransactionDetail**: two-column layout — left: transaction metadata + risk score gauge + SHAP-style factor bars; right: AI Investigation panel (step-by-step agent output with typewriter feel) + Relevant Policy card + Recommendation badge (APPROVE / VERIFY / HOLD / BLOCK).

**Analytics**: risk distribution donut, risk score histogram, transaction volume over time — all via Recharts with dark theme.

**Policies**: card grid of policy documents, search filter, expandable full text.

## CSS Tokens (in `src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600&display=swap');
@import 'tailwindcss';

@theme inline {
  --color-background: #080C18;
  --color-foreground: #E8EAF0;
  --color-card: #0F1629;
  --color-border: #1E2A45;
  --color-primary: #F5A623;
  --color-risk-high: #FF3B5C;
  --color-risk-medium: #FFD600;
  --color-risk-low: #00E676;
  --font-display: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;
}
```

## Verification

1. Run `pnpm install react-router recharts` (install step)
2. Navigate all 5 routes in the preview panel — no blank screens
3. Click a HIGH risk transaction → TransactionDetail shows risk factors, AI investigation text, policy, and recommendation
4. Analytics page renders charts
5. Policies page search filter works
6. No TypeScript build errors
