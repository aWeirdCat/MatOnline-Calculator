import React from 'react';
import { formatNumber, formatRM } from '../utils/calculator';
import { RESELLER_CONFIG } from '../constants/gameData';
import './CalculationLedgerSection.css';

export default function CalculationLedgerSection({
  targetQty,
  unitLabel,
  unitPrice,
  fullGoldCost,
  fullRMCost,
  modalGold,
  totalFundCost,
  balanceAfterFund,
  fundShortfall,
  totalVoucherYield,
  coveredItems,
  dustVoucher,
  remainingItems,
  remainingItemsGold,
  usableGold,
  netItemDeficit,
  extraGoldNeeded,
  extraRMNeeded,
  actualTotalRM,
  netSavingsRM,
  onCopySummary,
  t
}) {
  // Reseller price for extra gold
  const resellerPrice = extraGoldNeeded * RESELLER_CONFIG.targetRate;

  return (
    <section className="card-section">
      <div className="section-header border-b">
        <h2 className="section-title">
          <span className="indicator indicator-blue"></span> {t.ledgerTitle}
        </h2>
      </div>

      {/* Line-by-Line Ledger Rows */}
      <div className="ledger-rows-list mono">
        {/* Row 1: Full Target Cost */}
        <div className="ledger-row">
          <span className="ledger-label">{t.row1Label}</span>
          <div className="ledger-value">
            <span className="desc-text font-tabular">
              {formatNumber(targetQty)} {unitLabel}s @ {unitPrice}G
            </span>
            <span className="gold-highlight font-tabular">{formatNumber(fullGoldCost)} Gold</span>
            <span className="rm-sub font-tabular">({formatRM(fullRMCost)})</span>
          </div>
        </div>

        {/* Row 2: Deduct Fund Cost */}
        <div className="ledger-row">
          <span className="ledger-label">{t.row2Label}</span>
          <div className="ledger-value">
            <span className="desc-text font-tabular">
              Start {formatNumber(modalGold)} - Funds {formatNumber(totalFundCost)} =
            </span>
            {balanceAfterFund >= 0 ? (
              <span className="gold-success font-tabular">
                {formatNumber(usableGold)} {t.goldUsable}
              </span>
            ) : (
              <span className="gold-shortfall font-tabular">
                {t.shortfallLabel} {formatNumber(fundShortfall)} Gold
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Covered by Vouchers */}
        <div className="ledger-row">
          <div>
            <span className="ledger-label">{t.row3Label}</span>
            <span className="voucher-total-sub font-tabular">
              ({formatNumber(totalVoucherYield)} {t.vouchersTotal})
            </span>
          </div>
          <div className="ledger-value">
            <span className="gold-success font-tabular">
              {formatNumber(coveredItems)} {unitLabel}s
            </span>
            <span className="desc-text ml-1">{t.itemsCovered}</span>
            <span className="dust-sub font-tabular">({t.dustLabel} {formatNumber(dustVoucher)})</span>
          </div>
        </div>

        {/* Row 4: Remaining Items Needed */}
        <div className="ledger-row">
          <span className="ledger-label">{t.row4Label}</span>
          <div className="ledger-value">
            <span className="desc-text font-tabular">
              {formatNumber(remainingItems)} {unitLabel}s
            </span>
            <span className="gold-needed font-tabular">
              = {formatNumber(remainingItemsGold)} {t.goldNeededLabel}
            </span>
          </div>
        </div>

        {/* Row 5: Deduct Usable Balance */}
        <div className="ledger-row">
          <span className="ledger-label">{t.row5Label}</span>
          <div className="ledger-value">
            <span className="desc-text font-tabular">
              Remaining {formatNumber(remainingItemsGold)} - Usable {formatNumber(usableGold)} =
            </span>
            <span className="gold-highlight font-tabular">
              {formatNumber(netItemDeficit)} Gold
            </span>
          </div>
        </div>
      </div>

      {/* Extra Top-Up Highlight Box */}
      <div className="extra-topup-box">
        <div className="extra-topup-grid">
          {/* Col 1: Gold Amount Required */}
          <div className="extra-gold-block">
            <div className="extra-title">{t.extraTopUpTitle}</div>
            <div className="extra-gold-line">
              <span className="extra-gold-num mono font-tabular">
                {formatNumber(extraGoldNeeded)}
              </span>
              <span className="extra-gold-unit mono">{t.goldPointsUnit}</span>
            </div>
          </div>

          {/* Col 2: Official Store Price */}
          <div className="price-compare-col">
            <div className="price-badge-label mono text-muted">{t.officialStoreRate}</div>
            <div className="official-price mono font-tabular">
              {formatRM(extraRMNeeded)}
            </div>
            <div className="price-sub-rate mono">{t.officialStoreSub}</div>
          </div>

          {/* Col 3: Reseller Price */}
          <div className="price-compare-col reseller-col">
            <div className="price-badge-label mono text-reseller">{t.resellerRateTitle}</div>
            <div className="reseller-price mono font-tabular">
              {formatRM(resellerPrice)}
            </div>
            <div className="price-sub-rate mono text-reseller-rate">
              {t.resellerSaveSub} {formatRM(Math.max(0, extraRMNeeded - resellerPrice))} {t.vsOfficial}
            </div>
          </div>
        </div>
      </div>

      {/* Spend & Net Savings Footer Bar */}
      <div className="savings-footer-bar">
        <div className="spend-info-col">
          <div className="spend-line">
            {t.actualTotalSpend} <strong className="mono font-tabular text-white">{formatRM(actualTotalRM)}</strong>
            <span className="spend-note mono">{t.startPlusExtra}</span>
          </div>
          <div className="spend-line">
            {t.directRMCost} <span className="mono font-tabular text-gray-300">{formatRM(fullRMCost)}</span>
          </div>
        </div>
        <div className="savings-badge-wrapper">
          {netSavingsRM >= 0 ? (
            <div className="savings-badge positive mono font-tabular">
              <svg className="savings-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              {t.saveBadge} {formatRM(netSavingsRM)}
            </div>
          ) : (
            <div className="savings-badge neutral mono font-tabular">
              {t.diffBadge}{formatRM(Math.abs(netSavingsRM))}
            </div>
          )}
        </div>
      </div>

      {/* Copy Summary Placed at the Very Bottom */}
      <div className="bottom-copy-container">
        <button onClick={onCopySummary} className="btn-copy-bottom">
          <svg className="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
          </svg>
          {t.copySummaryBtn}
        </button>
      </div>
    </section>
  );
}
