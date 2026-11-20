import React from 'react';
import { OFFICIAL_PACKS, GOLD_PRESETS, RELOAD_PRESETS, VOUCHER_DENOMINATIONS } from '../constants/gameData';
import { formatNumber, formatRM } from '../utils/calculator';
import './BalanceFundsSection.css';

export default function BalanceFundsSection({
  modalGold,
  setModalGold,
  useCheapFund,
  setUseCheapFund,
  useExpFund,
  setUseExpFund,
  useReloadEvent,
  setUseReloadEvent,
  reloadVoucher,
  setReloadVoucher,
  fundShortfall,
  totalFundCost,
  t
}) {
  const onDropdownSelect = (e) => {
    const val = e.target.value;
    if (val !== 'custom') {
      setModalGold(parseInt(val, 10));
    }
  };

  const isMatchedDropdown = OFFICIAL_PACKS.some((p) => p.gold === modalGold) || modalGold === 0;

  return (
    <section className="card-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="indicator indicator-blue"></span> {t.balanceFundsTitle}
        </h2>
      </div>

      {/* Starting Modal Gold */}
      <div className="balance-box">
        <div className="balance-header-row">
          <label htmlFor="modalGoldInput" className="balance-label">
            {t.startingGoldLabel}
          </label>
          <span className="balance-rm mono font-tabular">
            {formatRM(modalGold * 0.0216)}
          </span>
        </div>
        <div className="balance-inputs-row">
          <input
            id="modalGoldInput"
            type="number"
            min="0"
            step="500"
            value={modalGold}
            onChange={(e) => setModalGold(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="numeric-input font-tabular"
          />
          <select
            value={isMatchedDropdown ? modalGold : 'custom'}
            onChange={onDropdownSelect}
            className="refill-dropdown mono"
          >
            <option value="custom">{t.customGoldOption}</option>
            <option value="0">0 Gold (RM 0.00)</option>
            {OFFICIAL_PACKS.slice().reverse().map((pack) => (
              <option key={pack.tier} value={pack.gold}>
                Tier {pack.tier}: {formatNumber(pack.gold)} Gold ({formatRM(pack.rm)})
              </option>
            ))}
          </select>
        </div>
        <div className="quick-buttons-row">
          <span className="quick-title mono">{t.quickLabel}</span>
          {GOLD_PRESETS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setModalGold(g)}
              className={`btn-gold-quick mono ${modalGold === g ? 'active' : ''}`}
            >
              {g >= 1000 ? `${g / 1000}k` : g}
            </button>
          ))}
        </div>
      </div>

      {/* Active Funds Selection Cards */}
      <div className="funds-selection-list">
        {/* Active Fund Cheap */}
        <label className="fund-card-label">
          <input
            type="checkbox"
            checked={useCheapFund}
            onChange={(e) => setUseCheapFund(e.target.checked)}
            className="fund-checkbox"
          />
          <div className="fund-card-content">
            <div className="fund-header-line">
              <span className="fund-title">{t.fundCheapTitle}</span>
              <span className="fund-cost mono">-3,400 Gold</span>
            </div>
            <p className="fund-desc">
              {t.fundCheapYield} <strong className="mono">+17,000 Gold Voucher</strong>
            </p>
          </div>
        </label>

        {/* Active Fund Expensive */}
        <label className="fund-card-label">
          <input
            type="checkbox"
            checked={useExpFund}
            onChange={(e) => setUseExpFund(e.target.checked)}
            className="fund-checkbox"
          />
          <div className="fund-card-content">
            <div className="fund-header-line">
              <span className="fund-title">{t.fundExpTitle}</span>
              <span className="fund-cost mono">-34,400 Gold</span>
            </div>
            <p className="fund-desc">
              {t.fundExpYield} <strong className="mono">+85,000 Gold Voucher</strong>
            </p>
          </div>
        </label>
      </div>

      {/* Reload Topup Reward Event */}
      <div className="event-reload-box">
        <div className="event-header-line">
          <label className="event-toggle-label">
            <input
              type="checkbox"
              checked={useReloadEvent}
              onChange={(e) => setUseReloadEvent(e.target.checked)}
              className="fund-checkbox"
            />
            {t.reloadEventTitle}
          </label>
          <span className="event-badge mono">{t.freeEventBadge}</span>
        </div>
        <div className={`event-body ${useReloadEvent ? '' : 'disabled'}`}>
          <div className="event-input-wrapper">
            <input
              type="number"
              min="0"
              step="500"
              value={reloadVoucher}
              onChange={(e) => setReloadVoucher(Math.max(0, parseInt(e.target.value, 10) || 0))}
              disabled={!useReloadEvent}
              className="numeric-input font-tabular text-sm"
            />
            <span className="input-suffix mono">{t.vouchersSuffix}</span>
          </div>
          <div className="quick-buttons-row">
            <span className="quick-title mono">{t.presetsLabel}</span>
            {RELOAD_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setReloadVoucher(v)}
                disabled={!useReloadEvent}
                className={`btn-gold-quick mono ${reloadVoucher === v ? 'active' : ''}`}
              >
                {formatNumber(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voucher Denominations Explanation Note */}
      <div className="voucher-note-card mono">
        <span className="voucher-note-title">ℹ️ Voucher Denominations:</span> 500, 1k, 2k, 5k, 10k, 20k
        <p className="voucher-note-body">{t.voucherDenomNote}</p>
      </div>

      {/* Shortfall Alert */}
      {fundShortfall > 0 && (
        <div className="shortfall-alert">
          <div className="shortfall-title">
            <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            {t.shortfallTitle}
          </div>
          <p className="shortfall-msg">
            {t.shortfallMsg1} <span className="mono text-white">{formatNumber(totalFundCost)}</span> {t.shortfallMsg2} <strong className="mono">{formatNumber(fundShortfall)}</strong> {t.shortfallMsg3}
          </p>
        </div>
      )}
    </section>
  );
}
