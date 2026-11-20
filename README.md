<div align="center">

<img src="./public/logo.png" alt="MatOnline Calculator Logo" width="128" height="128" />

# MatOnline-Calculator
### Catologist's MAT2 Currency, Voucher & Deal Optimization Engine

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-FF5722?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/aWeirdCat/MatOnline-Calculator/pulls)

**An all-in-one web calculator and decision-support tool for Mission Against Terror 2 (MAT2) players.**  
Calculate optimal gold refill packs, deduct active funds and event vouchers with realistic non-split rules, and evaluate reseller deals in real time.

[Features](#-key-features) • [Quick Start](#-quick-start) • [Game Economy Mechanics](#-game-economy-mechanics) • [Architecture](#-project-structure) • [Contributing](#-contributing)

---

</div>

## 🌟 Key Features

### 💎 1. Target Item Cost Estimation
- **Gems Mode:** Calculates total gold cost based on 550 Gold / Gem with quick presets (`339`, `239`, `578` Gems).
- **Spins Mode:** Calculates exact spin requirements (9 Luck Coins / 270 Gold per spin) with automatic Luck Coin tracking.

### 💰 2. Active Funds & Event Voucher Pooling
- **Starting Gold Deduction:** Factor in modal or pre-existing gold balance.
- **Active Funds (Cheap & Expensive):** Deducts fund purchase cost while crediting voucher return and M-Point yields.
- **Event Reload Topup Rewards:** Add event bonus vouchers into the calculation ledger.
- **Realistic Voucher Mechanics:** Respects game constraints—vouchers *(500, 1k, 2k, 5k, 10k, 20k)* cannot partially pay for single items; remaining fractional balances are tracked as unspent dust.
- **Deficit Protection:** Automatically detects starting gold shortfalls for fund purchases and rolls them into extra top-up requirements.

### 🔄 3. Reseller Deal Analyzer HUD
- **3-Way Bi-directional Reactive Converter:** Convert seamlessly across **Spins $\leftrightarrow$ Luck Coins $\leftrightarrow$ Gold Points**.
- **Retail Store Value Comparison:** Computes official store pricing at baseline `RM 10.80 = 500 Gold` (`RM 0.0216 / Gold`).
- **Target Max Deal Advice:** Evaluates discounted reseller offers against community benchmarks (`RM 650 per 50k Gold` / `RM 0.013 per Gold`).

### 🧮 4. DP-Powered Optimal Pack Solver
- Utilizes dynamic programming (`solveOptimalPacks`) to calculate the exact combination of the **12 official reload packs** needed to cover your target deficit with minimal excess gold and optimal ringgit spending.

### 📱 5. Modern UI & PWA Ready
- **Cyberpunk HUD Aesthetics:** 60/30/10 design system with Midnight Black (`#171717`), Electric Blue (`#3b82f6`), and Sunset Orange (`#f97316`).
- **4-Step Quick Setup Wizard:** Fast step-by-step onboarding with instant markdown copy summary.
- **Bilingual Support:** Instant toggle between English (`EN`) and Bahasa Melayu (`BM`).
- **Progressive Web App (PWA):** Offline service-worker caching and homescreen installability on mobile (iOS Safari / Android Chrome) and desktop.

---

## 🎮 Game Economy Mechanics

### Base Conversion Rates
| Metric | Ratio / Rate |
| :--- | :--- |
| **Official Gold Rate** | `RM 10.80 = 500 Gold` (`RM 0.0216 / Gold`) |
| **Gold per RM 1.00** | `~46.2963 Gold` |
| **Target Reseller Deal Benchmark** | `RM 650 = 50,000 Gold` (`RM 0.0130 / Gold`) |
| **Spin Cost** | `9 Luck Coins = 270 Gold` |
| **Gem Cost** | `550 Gold` |

### Active Funds Comparison
| Fund | Cost | Voucher Yield | M-Points Yield |
| :--- | :--- | :--- | :--- |
| **Active Fund Cheap** | `3,400 Gold` | `17,000 Vouchers` | `26,000 M-Points` |
| **Active Fund Expensive** | `34,400 Gold` | `85,000 Vouchers` | `130,000 M-Points` |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation
```bash
# Clone the repository
git clone https://github.com/aWeirdCat/MatOnline-Calculator.git

# Enter project directory
cd MatOnline-Calculator

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) in your browser.

### Production Build
```bash
npm run build
```
Compiled production-ready assets will be located in the `dist/` directory.

---

## 📁 Project Structure

```text
MatOnline-Calculator/
├── public/
│   ├── favicon-32.png            # Desktop favicon
│   ├── favicon-64.png            # High-res favicon
│   ├── apple-touch-icon.png      # iOS home screen icon
│   ├── manifest.json             # PWA Web App Manifest
│   └── sw.js                     # PWA Service Worker (Cache-first)
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Top navigation bar, language switcher & base rate display
│   │   ├── ResellerDealAnalyzer.jsx # 3-way converter & discount deal analyzer HUD
│   │   ├── TargetItemSection.jsx # Gems and Spins quantity & cost calculators
│   │   ├── BalanceFundsSection.jsx # Starting gold, active funds & voucher deductor
│   │   ├── CalculationLedgerSection.jsx # Breakdown ledger & optimal pack recommendations
│   │   └── SetupWizardModal.jsx  # 4-step modal wizard with summary copier
│   ├── constants/
│   │   ├── gameData.js           # Rates, 12 official packs, active funds, presets
│   │   └── translations.js       # Complete EN & BM i18n dictionary
│   ├── styles/
│   │   ├── global.css            # CSS variables, typography, utility classes
│   │   └── App.css               # App shell layout styling
│   ├── utils/
│   │   └── calculator.js         # Core math & DP solver for official packs
│   ├── App.jsx                   # Central state controller
│   └── main.jsx                  # React DOM entrypoint & PWA registration
├── index.html                    # HTML5 entrypoint with Google Fonts
├── package.json
└── vite.config.js
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/aWeirdCat/MatOnline-Calculator/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
