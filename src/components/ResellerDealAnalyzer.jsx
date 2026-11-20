import React, { useState } from 'react';
import { RESELLER_CONFIG } from '../constants/gameData';
import { formatRM } from '../utils/calculator';
import './ResellerDealAnalyzer.css';

export default function ResellerDealAnalyzer({ t }) {
  const [spins, setSpins] = useState('');
  const [coins, setCoins] = useState('');
  const [gold, setGold] = useState('');

  const cleanDecimal = (val) => {
    const str = String(val);
    if (str.endsWith('.0')) {
      return str.slice(0, -2);
    }
    return str;
  };

  // Bi-directional handler: Spins
  const handleSpinsChange = (e) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    setSpins(raw);

    if (raw === '' || isNaN(parseFloat(raw))) {
      setCoins('');
      setGold('');
      return;
    }

    const s = parseFloat(raw);
    const c = s * RESELLER_CONFIG.coinsPerSpin;
    const g = c * RESELLER_CONFIG.goldPerCoin;

    setCoins(cleanDecimal(c.toFixed(1)));
    setGold(cleanDecimal(Math.round(g)));
  };

  // Bi-directional handler: Coins
  const handleCoinsChange = (e) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    setCoins(raw);

    if (raw === '' || isNaN(parseFloat(raw))) {
      setSpins('');
      setGold('');
      return;
    }

    const c = parseFloat(raw);
    const s = c / RESELLER_CONFIG.coinsPerSpin;
    const g = c * RESELLER_CONFIG.goldPerCoin;

    setSpins(cleanDecimal(s.toFixed(1)));
    setGold(cleanDecimal(Math.round(g)));
  };

  // Bi-directional handler: Gold
  const handleGoldChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setGold(raw);

    if (raw === '' || isNaN(parseFloat(raw))) {
      setSpins('');
      setCoins('');
      return;
    }

    const g = parseFloat(raw);
    const c = g / RESELLER_CONFIG.goldPerCoin;
    const s = c / RESELLER_CONFIG.coinsPerSpin;

    setCoins(cleanDecimal(c.toFixed(1)));
    setSpins(cleanDecimal(s.toFixed(1)));
  };

  // Target Prices Calculation
  const numericGold = parseFloat(gold) || 0;
  const retailStoreValue = numericGold * RESELLER_CONFIG.officialRate;
  const targetMaxPrice = numericGold * RESELLER_CONFIG.targetRate;

  return (
    <div className="reseller-hud-card">
      <div className="hud-header">
        <div className="hud-title-wrap">
          <span className="hud-badge mono">{t.hudBadge}</span>
          <h3 className="hud-title">{t.hudTitle}</h3>
        </div>
        <div className="hud-target-rate mono">
          {t.hudTargetRate} <span className="text-neon">RM 650</span> / 50k Gold (RM 0.013/G)
        </div>
      </div>

      {/* Row 1 & 2: Active 3-Way Bi-directional Input Forms */}
      <div className="hud-inputs-grid">
        {/* SPINS */}
        <div className="hud-input-col">
          <label className="hud-label mono">{t.spinsLabel}</label>
          <input
            type="text"
            value={spins}
            onChange={handleSpinsChange}
            placeholder="0"
            className="hud-input font-tabular"
          />
        </div>

        {/* COINS */}
        <div className="hud-input-col">
          <label className="hud-label mono">{t.coinsLabel}</label>
          <input
            type="text"
            value={coins}
            onChange={handleCoinsChange}
            placeholder="0"
            className="hud-input font-tabular"
          />
        </div>

        {/* GOLD PTS */}
        <div className="hud-input-col">
          <label className="hud-label mono">{t.goldPtsLabel}</label>
          <input
            type="text"
            value={gold}
            onChange={handleGoldChange}
            placeholder="0"
            className="hud-input font-tabular"
          />
        </div>
      </div>

      {/* Row 3: Target Displays & Branding */}
      <div className="hud-results-grid">
        <div className="result-block">
          <div className="hud-label mono">{t.retailStoreValue}</div>
          <div className="result-val val-neon mono font-tabular">
            {formatRM(retailStoreValue)}
          </div>
          <div className="result-sub-note mono">{t.officialRateDesc}</div>
        </div>

        <div className="result-block">
          <div className="hud-label mono">{t.targetMaxDeal}</div>
          <div className="result-val val-green mono font-tabular">
            {formatRM(targetMaxPrice)}
          </div>
          <div className="result-sub-note mono">{t.maxBuyDesc}</div>
        </div>

        <div className="brand-corner mono">
          b1337x
        </div>
      </div>
    </div>
  );
}
