import React from 'react';
import { ITEM_PRESETS } from '../constants/gameData';
import { formatNumber, formatRM } from '../utils/calculator';
import gemImg from '../assets/gem.png';
import luckcoinImg from '../assets/luckcoin.png';
import './TargetItemSection.css';

export default function TargetItemSection({
  targetQty,
  setTargetQty,
  unitPrice,
  fullRMCost,
  targetType,
  setTargetType,
  t
}) {
  const isGem = targetType === 'gem';
  const numericQty = targetQty === '' ? 0 : parseInt(targetQty, 10) || 0;
  const totalCoinsNeeded = !isGem ? numericQty * 9 : null;

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setTargetQty('');
    } else {
      const parsed = parseInt(val, 10);
      setTargetQty(isNaN(parsed) ? '' : Math.max(0, parsed));
    }
  };

  return (
    <section className="card-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="indicator indicator-blue"></span>{' '}
          {isGem ? t.targetItemTitle : t.targetSpinTitle}
        </h2>
        <span className="badge-unit-price mono font-tabular">
          <img src={isGem ? gemImg : luckcoinImg} alt={isGem ? "Gem" : "Luck Coin"} className="badge-item-icon" />
          {isGem ? '550 Gold / Gem' : '9 Coins (270G) / Spin'}
        </span>
      </div>

      {/* Target Type Switcher Tabs (Gem vs Spin) */}
      <div className="target-type-toggle">
        <button
          type="button"
          onClick={() => {
            setTargetType('gem');
            setTargetQty(339);
          }}
          className={`btn-type-tab mono ${isGem ? 'active' : ''}`}
        >
          <img src={gemImg} alt="Gem" className="tab-item-icon" />
          Gem (550G)
        </button>
        <button
          type="button"
          onClick={() => {
            setTargetType('spin');
            setTargetQty(440);
          }}
          className={`btn-type-tab mono ${!isGem ? 'active' : ''}`}
        >
          <img src={luckcoinImg} alt="Luck Coin" className="tab-item-icon" />
          Spin (9 Coins / 270G)
        </button>
      </div>

      {/* Target Quantity Input */}
      <div className="input-group">
        <div className="input-header-row">
          <label htmlFor="targetQtyInput" className="input-label">
            {isGem ? t.qtyNeededLabel : t.qtySpinsNeededLabel}
          </label>
          <span className="direct-rm-preview mono font-tabular">
            {t.directPreview} {formatRM(fullRMCost)}
          </span>
        </div>
        <div className="input-wrapper">
          <input
            id="targetQtyInput"
            type="number"
            min="0"
            step="1"
            value={targetQty}
            onChange={handleInputChange}
            placeholder="0"
            className="numeric-input font-tabular"
          />
          <span className="input-suffix mono">
            <img src={isGem ? gemImg : luckcoinImg} alt="" className="suffix-item-icon" />
            {isGem ? t.gemsSuffix : t.spinsSuffix}
          </span>
        </div>

        {/* Total Luck Coins Required Display */}
        {!isGem && (
          <div className="coins-needed-indicator mono">
            <span className="coins-label">{t.totalCoinsRequired}</span>
            <div className="coins-val-wrap">
              <img src={luckcoinImg} alt="Luck Coin" className="indicator-coin-icon" />
              <strong className="coins-val font-tabular text-orange">
                {formatNumber(totalCoinsNeeded)} Luck Coins
              </strong>
            </div>
            <span className="coins-sub font-tabular">
              ({formatNumber(numericQty)} × 9 LC @ 30G)
            </span>
          </div>
        )}
      </div>

      {/* Quick Presets */}
      <div className="presets-wrapper">
        <span className="presets-label">{t.quickPresets}</span>
        <div className="presets-list">
          {isGem ? (
            ITEM_PRESETS.gem.map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setTargetQty(preset.val)}
                className="btn-preset mono"
              >
                {preset.label}
              </button>
            ))
          ) : (
            [
              { label: '50 Spins', val: 50 },
              { label: '120 Spins', val: 120 },
              { label: '300 Spins', val: 300 },
              { label: '440 Spins', val: 440 },
              { label: '2,030 (All)', val: 2030 }
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setTargetQty(p.val)}
                className="btn-preset mono"
              >
                {p.label}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
