// Constants
export const RM_PER_GOLD = 0.0216;

// Reseller Deal Analyzer Rates (from AHK)
export const RESELLER_CONFIG = {
  officialRate: 0.0216,
  targetRate: 650 / 50000, // RM 0.013 per Gold Point (RM 650 per 50k Gold)
  coinsPerSpin: 9,
  goldPerCoin: 30
};

export const FUND_CHEAP = {
  cost: 3400,
  voucher: 17000,
  mPoint: 26000
};

export const FUND_EXPENSIVE = {
  cost: 34400,
  voucher: 85000,
  mPoint: 130000
};

// 12 Official Packs
export const OFFICIAL_PACKS = [
  { tier: 12, gold: 450000, rm: 9720.00, units: 900 },
  { tier: 11, gold: 250000, rm: 5400.00, units: 500 },
  { tier: 10, gold: 150000, rm: 3240.00, units: 300 },
  { tier: 9,  gold: 50000,  rm: 1080.00, units: 100 },
  { tier: 8,  gold: 40000,  rm: 864.00,  units: 80 },
  { tier: 7,  gold: 25000,  rm: 540.00,  units: 50 },
  { tier: 6,  gold: 10000,  rm: 216.00,  units: 20 },
  { tier: 5,  gold: 7500,   rm: 162.00,  units: 15 },
  { tier: 4,  gold: 5000,   rm: 108.00,  units: 10 },
  { tier: 3,  gold: 2500,   rm: 54.00,   units: 5 },
  { tier: 2,  gold: 1500,   rm: 32.40,   units: 3 },
  { tier: 1,  gold: 500,    rm: 10.80,   units: 1 }
];

export const ITEM_PRESETS = {
  gem: [
    { label: '339 Gems', val: 339 },
    { label: '239 Gems', val: 239 },
    { label: '578 Gems', val: 578 }
  ]
};

export const GOLD_PRESETS = [0, 500, 2500, 5000, 10000, 25000, 50000, 150000];
export const RELOAD_PRESETS = [0, 10000, 22500, 50000];

// Official In-Game Voucher Denominations
export const VOUCHER_DENOMINATIONS = [500, 1000, 2000, 5000, 10000, 20000];
