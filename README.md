# KICKSMATE — Omnichannel Sneaker Vault & Footwear Retail OS

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Standard](https://img.shields.io/badge/Currency-USD_($)-emerald?style=flat-square)](https://kicksmate.com)
[![Size Run](https://img.shields.io/badge/Sizing-EUR_38--44_Matrix-indigo?style=flat-square)](https://kicksmate.com)

**KICKSMATE** is an enterprise-grade omnichannel boutique retail management system and high-speed in-store POS terminal engineered specifically for luxury sneaker vaults, consignment boutiques, and modern streetwear retailers.

Designed according to international retail standards (USD currency standard, EUR 38–44 footwear matrix, wholesale cost COGS accounting, and thermal receipt hardware protocols).

---

## ✨ Key Enterprise Capabilities

### 1. 🛍️ Boutique POS Terminal & Thermal Hardware Engine
- **Tactile Fast-Checkout**: Purpose-built for rapid in-store customer throughput with instant size selection.
- **Hardware Barcode Gun Simulator**: Simulates high-speed USB laser barcode scanning directly into the cart drawer.
- **Omnichannel Payment Rail**: Native checkout flow for **Cash** (with cash tendered & change due calculator), **Apple Pay / Contactless NFC**, **Credit Card**, and **Stripe Terminal**.
- **Printable Thermal Receipts**: Standards-compliant **58mm and 80mm** ESC/POS layout rendering with customizable legal policy, QR barcode, and store branding.

### 2. 👟 Footwear Size-Run Matrix & Real-Time Heatmap
- **EUR 38–44 Density Matrix**: Visual heatmap cells instantly distinguish **Depleted/Broken Runs (`-`)**, **Low Stock Alerts**, **Healthy Stock**, and **Deep Vault Inventory**.
- **7-Segment Size Health Indicator**: Audio-meter-style visual indicator revealing size-run completeness (e.g. `6/7 sizes available`).
- **Shoe Box Barcode Label Tag Printer**: Printable industrial box tag generator with authentic regional conversions (**EUR**, **US MENS**, **UK**, **LENGTH CM**), retail price tag, and Code 128 barcode SVG.
- **Quick Stock Adjuster & Catalog Onboarding**: Modal workflows for adjusting individual size quantities with audit difference tracking.

### 3. 📈 Financial Margin & COGS Profitability Engine
- **True Retail Accounting**: Separates **Gross Revenue**, **Cost of Goods Sold (COGS / Wholesale Cost)**, and **Realized Gross Profit**.
- **Brand Profitability Matrix**: Live comparative breakdown of revenue, COGS, gross profit, and margin % across major brands (**Nike, Air Jordan, New Balance, adidas**).
- **Capital Tied-Up Risk Analysis**: Identifies slow-moving high-capital inventory models to optimize warehouse liquidity.
- **Audited CSV Export**: One-click real sales and financial report export formatted in USD.

### 4. 👥 VIP Collectors CRM & Loyalty Engine
- **Collector Tier System**: Dynamic segmentation (**Sneakerhead VIP**, **Gold Vault**, **Silver Collector**, **Bronze Member**).
- **Lifetime Value (LTV) Diagnostics**: Tracks cumulative customer spend, total historical orders, and preferred EUR sneaker size.
- **Direct VIP Outreach**: Instant WhatsApp communication trigger with contextual customer purchase history and staff audit notes.

### 5. ⚡ PWA & Offline POS Resiliency
- **Zero Downtime Local Queue**: If network connectivity drops, the POS terminal seamlessly shifts to offline mode, allowing transactions and receipt printing locally.
- **Cloud Auto-Sync**: Automatically batches and syncs pending offline transactions to the cloud vault upon reconnection.
- **Installable PWA**: Tablet and iPad register friendly layout with service worker caching.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.3.5 (App Router with Turbopack) |
| **UI Library** | React 19.2 (Server & Client Components) |
| **Styling** | Tailwind CSS v4 + Geist Font System |
| **Icons** | Lucide React |
| **Type Safety** | TypeScript 5 (Strict Mode, Zero `any`) |
| **Storage & Sync** | LocalStorage schema v2.0 with hydration guards & Service Worker PWA |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, yarn, or pnpm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/your-org/dashboard-admin.git
cd dashboard-admin

# Install dependencies
npm install

# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification

```bash
# Type check verification
npx tsc --noEmit

# Production bundle compilation
npm run build

# Start production server
npm run start
```

---

## 🏛️ Application Roles & Operators
- **Admin & Head of Retail**: Zeno (`ZN`)
- **Store Location**: KICKSMATE SoHo Flagship Store (New York, NY)
- **Active Terminal**: Terminal 1 (Online & Cloud-Synced)

---

## 📄 License
Proprietary & Confidential — Engineered for Global Omnichannel Footwear Retailers.
