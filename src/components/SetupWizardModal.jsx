import React, { useState } from 'react';
import { formatNumber, formatRM } from '../utils/calculator';
import { RESELLER_CONFIG } from '../constants/gameData';
import './SetupWizardModal.css';

export default function SetupWizardModal({
  isOpen,
  onClose,
  initialTargetQty,
  initialUseCheap,
  initialUseExp,
  initialReloadVoucher,
  initialUseReload,
  initialModalGold,
  onApplyConfig,
  onCopySummaryDirect,
  t,
  lang
}) {
  const [step, setStep] = useState(1);

  // Wizard state: targetType is 'gem' or 'spin'
  const [targetType, setTargetType] = useState('gem'); // 'gem' | 'spin'
  const [qty, setQty] = useState(initialTargetQty !== undefined ? initialTargetQty : 339);

  const [useCheap, setUseCheap] = useState(initialUseCheap ?? true);
  const [useExp, setUseExp] = useState(initialUseExp ?? true);

  const [useReload, setUseReload] = useState(initialUseReload ?? true);
  const [reloadAmount, setReloadAmount] = useState(initialReloadVoucher || 22500);

  if (!isOpen) return null;

  const handleTypeChange = (type) => {
    setTargetType(type);
    if (type === 'gem') {
      setQty(339);
    } else {
      setQty(440);
    }
  };

  const handleQtyChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setQty('');
    } else {
      const parsed = parseInt(val, 10);
      setQty(isNaN(parsed) ? '' : Math.max(0, parsed));
    }
  };

  const handleReloadAmountChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setReloadAmount('');
    } else {
      const parsed = parseInt(val, 10);
      setReloadAmount(isNaN(parsed) ? '' : Math.max(0, parsed));
    }
  };

  const numericQty = qty === '' ? 0 : parseInt(qty, 10) || 0;
  const numericReload = reloadAmount === '' ? 0 : parseInt(reloadAmount, 10) || 0;

  // 1 Spin = 9 Luck Coins @ 30G/coin = 270 Gold
  const unitPrice = targetType === 'gem' ? 550 : 270;
  const fullGold = numericQty * unitPrice;
  const fullRM = fullGold * 0.0216;
  const totalCoinsNeeded = targetType === 'spin' ? numericQty * 9 : null;

  const totalFundCost = (useCheap ? 3400 : 0) + (useExp ? 34400 : 0);
  const totalVouchers = (useCheap ? 17000 : 0) + (useExp ? 85000 : 0) + (useReload ? numericReload : 0);
  const coveredItems = Math.min(numericQty, Math.floor(totalVouchers / unitPrice));
  const remainingItems = numericQty - coveredItems;
  const remainingGold = remainingItems * unitPrice;

  const balanceAfterFund = initialModalGold - totalFundCost;
  const usableGold = balanceAfterFund >= 0 ? balanceAfterFund : 0;
  const fundShortfall = balanceAfterFund < 0 ? Math.abs(balanceAfterFund) : 0;

  const extraGoldNeeded = fundShortfall + Math.max(0, remainingGold - usableGold);
  const extraRMNeeded = extraGoldNeeded * 0.0216;
  const resellerExtraPrice = extraGoldNeeded * RESELLER_CONFIG.targetRate;
  const actualTotalRM = (initialModalGold + extraGoldNeeded) * 0.0216;
  const netSavingsRM = fullRM - actualTotalRM;

  const handleFinishAndEnter = () => {
    onApplyConfig({
      targetType,
      qty: numericQty,
      useCheap,
      useExp,
      useReload,
      reloadAmount: numericReload
    });
    onClose();
  };

  const handleCopyAndEnter = () => {
    const targetLabel = targetType === 'gem' ? 'Gems' : `Spins (${formatNumber(totalCoinsNeeded)} Luck Coins)`;
    const summaryText = `${t.summaryTitle}
━━━━━━━━━━━━━━━━━━━━
${t.summaryTarget} ${numericQty} ${targetLabel} (${formatNumber(fullGold)} Gold)
${t.summaryModal} ${formatNumber(initialModalGold)} Gold (${formatRM(initialModalGold * 0.0216)})
${t.summaryVoucherCover} ${formatNumber(coveredItems)} (${t.summaryRemain} ${formatNumber(remainingItems)})
━━━━━━━━━━━━━━━━━━━━
${t.summaryExtraNeeded}
${t.summaryExtraGold} ${formatNumber(extraGoldNeeded)} Gold
${t.summaryOfficial} ${formatRM(extraRMNeeded)}
${t.summaryReseller} ${formatRM(resellerExtraPrice)}
━━━━━━━━━━━━━━━━━━━━
${t.summarySave} ${formatRM(Math.max(0, netSavingsRM))}`;

    onCopySummaryDirect(summaryText);
    handleFinishAndEnter();
  };

  return (
    <div className="wizard-overlay">
      <div className="wizard-card">
        {/* Step Indicator Header */}
        <div className="wizard-header">
          <div className="wizard-step-badge mono">
            {lang === 'bm' ? `LANGKAH ${step} DARI 4` : `STEP ${step} OF 4`}
          </div>
          <div className="wizard-progress-dots">
            <span className={`dot ${step >= 1 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 2 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 3 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 4 ? 'active' : ''}`}></span>
          </div>
        </div>

        {/* STEP 1: Target Item (Gem / Spin) */}
        {step === 1 && (
          <div className="wizard-body">
            <h2 className="wizard-title">
              {lang === 'bm' ? 'Pilih Sasaran Item Anda' : 'Choose Your Target Item'}
            </h2>
            <p className="wizard-desc">
              {lang === 'bm'
                ? 'Pilih sama ada anda ingin mengira kos untuk Gems atau Spins.'
                : 'Select whether you want to calculate for Gems or Spins.'}
            </p>

            <div className="wizard-options-grid">
              <button
                type="button"
                onClick={() => handleTypeChange('gem')}
                className={`wizard-select-btn ${targetType === 'gem' ? 'selected' : ''}`}
              >
                <div className="select-btn-title">Gem</div>
                <div className="select-btn-sub mono">550 Gold / Unit</div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('spin')}
                className={`wizard-select-btn ${targetType === 'spin' ? 'selected' : ''}`}
              >
                <div className="select-btn-title">Spin</div>
                <div className="select-btn-sub mono">9 Coins (270 Gold) / Spin</div>
              </button>
            </div>

            <div className="wizard-input-group">
              <div className="flex justify-between items-center">
                <label className="wizard-input-label">
                  {lang === 'bm'
                    ? `Jumlah ${targetType === 'gem' ? 'Gems' : 'Spins'} Diperlukan:`
                    : `Number of ${targetType === 'gem' ? 'Gems' : 'Spins'} Needed:`}
                </label>
                {targetType === 'spin' && (
                  <span className="text-coins-needed mono font-tabular">
                    = {formatNumber(totalCoinsNeeded)} Luck Coins
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={qty}
                onChange={handleQtyChange}
                placeholder="0"
                className="wizard-number-input font-tabular"
              />
              <div className="wizard-presets-row">
                {targetType === 'gem' ? (
                  <>
                    <button type="button" onClick={() => setQty(239)} className="btn-wizard-preset mono">239</button>
                    <button type="button" onClick={() => setQty(339)} className="btn-wizard-preset mono">339</button>
                    <button type="button" onClick={() => setQty(578)} className="btn-wizard-preset mono">578</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => setQty(50)} className="btn-wizard-preset mono">50</button>
                    <button type="button" onClick={() => setQty(120)} className="btn-wizard-preset mono">120</button>
                    <button type="button" onClick={() => setQty(300)} className="btn-wizard-preset mono">300</button>
                    <button type="button" onClick={() => setQty(440)} className="btn-wizard-preset mono">440</button>
                    <button type="button" onClick={() => setQty(2030)} className="btn-wizard-preset mono">2,030</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Active Funds (Murah / Mahal) */}
        {step === 2 && (
          <div className="wizard-body">
            <h2 className="wizard-title">
              {lang === 'bm' ? 'Pilihan Active Fund' : 'Active Funds Selection'}
            </h2>
            <p className="wizard-desc">
              {lang === 'bm'
                ? 'Tandakan dana yang ingin dibeli untuk tebus baucar diskaun.'
                : 'Select the Active Funds you plan to purchase for discounted vouchers.'}
            </p>

            <div className="wizard-funds-list">
              <label className={`wizard-fund-card ${useCheap ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={useCheap}
                  onChange={(e) => setUseCheap(e.target.checked)}
                  className="wizard-checkbox"
                />
                <div className="fund-card-info">
                  <div className="fund-card-title-row">
                    <span className="fund-name">{lang === 'bm' ? 'Active Fund Murah' : 'Active Fund Cheap'}</span>
                    <span className="fund-cost mono">-3,400 Gold</span>
                  </div>
                  <div className="fund-benefit mono">
                    {lang === 'bm' ? 'Dapat: +17,000 Baucar' : 'Yields: +17,000 Vouchers'}
                  </div>
                </div>
              </label>

              <label className={`wizard-fund-card ${useExp ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={useExp}
                  onChange={(e) => setUseExp(e.target.checked)}
                  className="wizard-checkbox"
                />
                <div className="fund-card-info">
                  <div className="fund-card-title-row">
                    <span className="fund-name">{lang === 'bm' ? 'Active Fund Mahal' : 'Active Fund Expensive'}</span>
                    <span className="fund-cost mono">-34,400 Gold</span>
                  </div>
                  <div className="fund-benefit mono">
                    {lang === 'bm' ? 'Dapat: +85,000 Baucar' : 'Yields: +85,000 Vouchers'}
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Gold Reward Topup Event */}
        {step === 3 && (
          <div className="wizard-body">
            <h2 className="wizard-title">
              {lang === 'bm' ? 'Ganjaran Topup Reload (Event)' : 'Reload Topup Reward (Event)'}
            </h2>
            <p className="wizard-desc">
              {lang === 'bm'
                ? 'Masukkan jumlah baucar percuma yang diterima dari event top-up.'
                : 'Enter the free vouchers rewarded from the current top-up reload event.'}
            </p>

            <label className="wizard-toggle-box">
              <input
                type="checkbox"
                checked={useReload}
                onChange={(e) => setUseReload(e.target.checked)}
                className="wizard-checkbox"
              />
              <span className="toggle-text">
                {lang === 'bm' ? 'Sertakan Baucar Event' : 'Include Event Reload Vouchers'}
              </span>
            </label>

            {useReload && (
              <div className="wizard-input-group mt-3">
                <label className="wizard-input-label">
                  {lang === 'bm' ? 'Jumlah Baucar Event:' : 'Event Voucher Amount:'}
                </label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={reloadAmount}
                  onChange={handleReloadAmountChange}
                  placeholder="0"
                  className="wizard-number-input font-tabular"
                />
                <div className="wizard-presets-row">
                  <button type="button" onClick={() => setReloadAmount(0)} className="btn-wizard-preset mono">0</button>
                  <button type="button" onClick={() => setReloadAmount(10000)} className="btn-wizard-preset mono">10k</button>
                  <button type="button" onClick={() => setReloadAmount(22500)} className="btn-wizard-preset mono active">22.5k</button>
                  <button type="button" onClick={() => setReloadAmount(50000)} className="btn-wizard-preset mono">50k</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Review Summary, Copy, or Enter Website */}
        {step === 4 && (
          <div className="wizard-body">
            <h2 className="wizard-title">
              {lang === 'bm' ? 'Sedia! Ringkasan Pantas' : 'Ready! Quick Summary'}
            </h2>
            <p className="wizard-desc">
              {lang === 'bm'
                ? 'Semua konfigurasi selesai. Anda boleh salin ringkasan sekarang atau terus masuk ke papan pemuka.'
                : 'Configuration complete. You can copy the summary now or enter the full dashboard.'}
            </p>

            <div className="wizard-summary-box mono font-tabular">
              <div className="summary-line">
                <span>{lang === 'bm' ? 'Sasaran:' : 'Target:'}</span>
                <strong>
                  {numericQty} {targetType === 'gem' ? 'Gems' : `Spins (${formatNumber(totalCoinsNeeded)} LC)`} ({formatNumber(fullGold)} Gold)
                </strong>
              </div>
              <div className="summary-line">
                <span>{lang === 'bm' ? 'Dilindungi Baucar:' : 'Voucher Covered:'}</span>
                <span className="text-blue">{formatNumber(coveredItems)} {targetType === 'gem' ? 'Gems' : 'Spins'}</span>
              </div>
              <div className="summary-line highlight-line">
                <span>{lang === 'bm' ? 'Top-Up Diperlukan:' : 'Extra Gold Needed:'}</span>
                <strong className="text-orange">{formatNumber(extraGoldNeeded)} Gold</strong>
              </div>
              <div className="summary-line">
                <span>{lang === 'bm' ? 'Harga Kedai Rasmi:' : 'Official Store RM:'}</span>
                <span>{formatRM(extraRMNeeded)}</span>
              </div>
              <div className="summary-line">
                <span>{lang === 'bm' ? 'Harga Reseller:' : 'Reseller RM:'}</span>
                <strong className="text-green">{formatRM(resellerExtraPrice)}</strong>
              </div>
              <div className="summary-line border-top-line">
                <span>{lang === 'bm' ? 'Penjimatan Bersih:' : 'Net Savings:'}</span>
                <strong className="text-orange">{formatRM(Math.max(0, netSavingsRM))}</strong>
              </div>
            </div>

            <div className="wizard-action-buttons">
              <button
                type="button"
                onClick={handleCopyAndEnter}
                className="btn-wizard-copy mono"
              >
                {lang === 'bm' ? 'Salin Ringkasan & Masuk' : 'Copy Summary & Enter'}
              </button>
              <button
                type="button"
                onClick={handleFinishAndEnter}
                className="btn-wizard-enter mono"
              >
                {lang === 'bm' ? 'Terus Masuk Website' : 'Enter Dashboard'}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="wizard-footer">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-wizard-back mono"
            >
              ← {lang === 'bm' ? 'Kembali' : 'Back'}
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-wizard-next mono"
            >
              {lang === 'bm' ? 'Seterusnya' : 'Next'} →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
