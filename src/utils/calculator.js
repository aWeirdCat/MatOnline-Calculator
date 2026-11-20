import { RM_PER_GOLD, FUND_CHEAP, FUND_EXPENSIVE, OFFICIAL_PACKS } from '../constants/gameData';

export function formatNumber(num) {
  return Number(num).toLocaleString('en-US');
}

export function formatRM(num) {
  return 'RM ' + Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Dynamic Programming Solver for Official Refill Packs
 */
export function solveOptimalPacks(goldNeeded) {
  if (goldNeeded <= 0) {
    return { packs: [], totalPacksGold: 0, totalPacksRM: 0, excessGold: 0 };
  }

  const unitsNeeded = Math.ceil(goldNeeded / 500);
  const packUnits = [900, 500, 300, 100, 80, 50, 20, 15, 10, 5, 3, 1];
  const maxUnits = unitsNeeded + 900;

  const dp = new Array(maxUnits + 1).fill(Infinity);
  const parent = new Array(maxUnits + 1).fill(-1);
  const chosenUnit = new Array(maxUnits + 1).fill(-1);

  dp[0] = 0;

  for (let i = 0; i < maxUnits; i++) {
    if (dp[i] === Infinity) continue;
    for (const p of packUnits) {
      const next = i + p;
      if (next <= maxUnits) {
        if (dp[i] + 1 < dp[next]) {
          dp[next] = dp[i] + 1;
          parent[next] = i;
          chosenUnit[next] = p;
        }
      }
    }
  }

  let bestUnits = unitsNeeded;
  let minPacks = Infinity;

  for (let c = unitsNeeded; c <= maxUnits; c++) {
    if (dp[c] < minPacks) {
      minPacks = dp[c];
      bestUnits = c;
      if (minPacks === 1) break;
    }
  }

  const counts = {};
  let curr = bestUnits;
  while (curr > 0 && parent[curr] !== -1) {
    const u = chosenUnit[curr];
    counts[u] = (counts[u] || 0) + 1;
    curr = parent[curr];
  }

  const resultPacks = [];
  let totalPacksGold = 0;
  let totalPacksRM = 0;

  OFFICIAL_PACKS.forEach((p) => {
    if (counts[p.units]) {
      const count = counts[p.units];
      resultPacks.push({
        tier: p.tier,
        goldPerPack: p.gold,
        rmPerPack: p.rm,
        count: count,
        subtotalGold: p.gold * count,
        subtotalRM: p.rm * count
      });
      totalPacksGold += p.gold * count;
      totalPacksRM += p.rm * count;
    }
  });

  return {
    packs: resultPacks,
    totalPacksGold,
    totalPacksRM,
    excessGold: totalPacksGold - goldNeeded
  };
}

/**
 * Calculates complete pricing ledger, balances, and savings
 */
export function calculateAll({
  mode = 'gem',
  lcRate = 30,
  targetQty,
  modalGold,
  useCheapFund,
  useExpFund,
  useReloadEvent,
  reloadVoucher
}) {
  let unitPrice = 550;
  let unitLabel = 'Gem';
  if (mode === 'spin') {
    unitPrice = 9 * lcRate;
    unitLabel = 'Spin';
  } else if (mode === 'luckcoin') {
    unitPrice = lcRate;
    unitLabel = 'Luck Coin';
  }

  // 1. Full Target Cost
  const fullGoldCost = targetQty * unitPrice;
  const fullRMCost = fullGoldCost * RM_PER_GOLD;

  // 2. Fund Deduction & Balance
  const fundCheapCost = useCheapFund ? FUND_CHEAP.cost : 0;
  const fundExpCost = useExpFund ? FUND_EXPENSIVE.cost : 0;
  const totalFundCost = fundCheapCost + fundExpCost;

  const earnedMPoints =
    (useCheapFund ? FUND_CHEAP.mPoint : 0) +
    (useExpFund ? FUND_EXPENSIVE.mPoint : 0);

  const balanceAfterFund = modalGold - totalFundCost;
  const usableGold = balanceAfterFund >= 0 ? balanceAfterFund : 0;
  const fundShortfall = balanceAfterFund < 0 ? Math.abs(balanceAfterFund) : 0;

  // 3. Voucher Coverage (Standard combined pooling)
  const cheapVoucherYield = useCheapFund ? FUND_CHEAP.voucher : 0;
  const expVoucherYield = useExpFund ? FUND_EXPENSIVE.voucher : 0;
  const eventVoucherYield = useReloadEvent ? reloadVoucher : 0;
  const totalVoucherYield = cheapVoucherYield + expVoucherYield + eventVoucherYield;

  const maxVoucherItems = Math.floor(totalVoucherYield / unitPrice);
  const coveredItems = Math.min(targetQty, maxVoucherItems);
  const usedVoucher = coveredItems * unitPrice;
  const dustVoucher = totalVoucherYield - usedVoucher;

  // 4. Remaining Items Needed & Extra Top-Up
  const remainingItems = targetQty - coveredItems;
  const remainingItemsGold = remainingItems * unitPrice;
  const netItemDeficit = Math.max(0, remainingItemsGold - usableGold);

  const extraGoldNeeded = fundShortfall + netItemDeficit;
  const extraRMNeeded = extraGoldNeeded * RM_PER_GOLD;

  // 5. Official Packs
  const packSolution = solveOptimalPacks(extraGoldNeeded);

  // 6. Actual Spend & Net Savings
  const actualTotalRM = (modalGold + extraGoldNeeded) * RM_PER_GOLD;
  const netSavingsRM = fullRMCost - actualTotalRM;

  return {
    unitPrice,
    unitLabel,
    fullGoldCost,
    fullRMCost,
    totalFundCost,
    earnedMPoints,
    balanceAfterFund,
    usableGold,
    fundShortfall,
    totalVoucherYield,
    coveredItems,
    dustVoucher,
    remainingItems,
    remainingItemsGold,
    netItemDeficit,
    extraGoldNeeded,
    extraRMNeeded,
    packSolution,
    actualTotalRM,
    netSavingsRM
  };
}
