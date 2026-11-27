import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StoreSection from './components/StoreSection';
import SetupWizardModal from './components/SetupWizardModal';
import ResellerDealAnalyzer from './components/ResellerDealAnalyzer';
import TargetItemSection from './components/TargetItemSection';
import BalanceFundsSection from './components/BalanceFundsSection';
import CalculationLedgerSection from './components/CalculationLedgerSection';
import { calculateAll, formatNumber, formatRM } from './utils/calculator';
import { RESELLER_CONFIG } from './constants/gameData';
import { translations } from './constants/translations';
import './styles/App.css';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'bm'
  const t = translations[lang] || translations.en;

  // Active View Tab: 'store' (Default Main View) or 'calculator'
  const [activeTab, setActiveTab] = useState('store');

  // Light / Dark Theme State (Persisted in localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mat2_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mat2_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Pop-up Wizard Modal State (Opens automatically on first visit when visiting calculator)
  const [showWizard, setShowWizard] = useState(false);

  // Core Calculator Configuration States
  const [targetType, setTargetType] = useState('gem'); // 'gem' | 'spin'
  const [targetQty, setTargetQty] = useState(339);
  const [gemPrice, setGemPrice] = useState(550);

  const [modalGold, setModalGold] = useState(50000);
  const [useCheapFund, setUseCheapFund] = useState(true);
  const [useExpFund, setUseExpFund] = useState(true);
  const [useReloadEvent, setUseReloadEvent] = useState(true);
  const [reloadVoucher, setReloadVoucher] = useState(22500);

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Handle configuration from the Wizard
  const handleApplyWizardConfig = (cfg) => {
    setTargetType(cfg.targetType);
    setTargetQty(cfg.qty);
    if (cfg.gemPrice !== undefined) setGemPrice(cfg.gemPrice);
    setUseCheapFund(cfg.useCheap);
    setUseExpFund(cfg.useExp);
    setUseReloadEvent(cfg.useReload);
    setReloadVoucher(cfg.reloadAmount);
  };

  // Convert empty string to 0 for calculations so backspacing doesn't break
  const safeQty = targetQty === '' ? 0 : parseInt(targetQty, 10) || 0;
  const safeGemPrice = gemPrice === '' ? 550 : parseInt(gemPrice, 10) || 550;
  const safeModalGold = modalGold === '' ? 0 : parseInt(modalGold, 10) || 0;
  const safeReloadVoucher = reloadVoucher === '' ? 0 : parseInt(reloadVoucher, 10) || 0;

  // Perform Calculations (1 Spin = 9 Luck Coins = 270 Gold)
  const calc = calculateAll({
    mode: targetType,
    gemPrice: safeGemPrice,
    lcRate: 30,
    targetQty: safeQty,
    modalGold: safeModalGold,
    useCheapFund,
    useExpFund,
    useReloadEvent,
    reloadVoucher: safeReloadVoucher
  });

  const resellerExtraPrice = calc.extraGoldNeeded * RESELLER_CONFIG.targetRate;

  // Direct clipboard copy triggered by Wizard or Bottom button
  const handleCopyTextDirect = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(t.copiedToast);
    }).catch(() => {
      triggerToast(t.failedToast);
    });
  };

  const handleCopySummary = () => {
    const totalCoins = targetType === 'spin' ? safeQty * 9 : null;
    const targetLabel =
      targetType === 'gem'
        ? `${safeQty} Gems @ ${calc.unitPrice}G`
        : `${safeQty} Spins (${formatNumber(totalCoins)} Luck Coins)`;

    const fundDetailText =
      calc.balanceAfterFund >= 0
        ? `${formatNumber(calc.usableGold)} ${t.goldUsable}`
        : `${formatNumber(calc.fundShortfall)} Gold (${t.shortfallLabel})`;

    const summary = `${t.summaryTitle}
━━━━━━━━━━━━━━━━━━━━
${t.summaryTarget} ${targetLabel} (${formatNumber(calc.fullGoldCost)} Gold)
${t.summaryModal} ${formatNumber(safeModalGold)} Gold (${formatRM(safeModalGold * 0.0216)})
━━━━━━━━━━━━━━━━━━━━
${t.summaryProcessTitle}
${t.summaryStep1} ${formatNumber(calc.fullGoldCost)} Gold (${formatRM(calc.fullRMCost)})
${t.summaryStep2} -${formatNumber(calc.totalFundCost)} Gold
${calc.balanceAfterFund >= 0 ? t.summaryStep2Balance : t.summaryStep2Shortfall} ${fundDetailText}
${t.summaryStep3} ${formatNumber(calc.totalVoucherYield)} Vouchers
${t.summaryStep3Cover} ${formatNumber(calc.coveredItems)} ${calc.unitLabel}s (${t.summaryDust} ${formatNumber(calc.dustVoucher)} Vouchers)
${t.summaryStep4} ${formatNumber(calc.remainingItems)} ${calc.unitLabel}s = ${formatNumber(calc.remainingItemsGold)} Gold
${t.summaryStep5} -${formatNumber(calc.usableGold)} Gold
${t.summaryStep5Deficit} ${formatNumber(calc.netItemDeficit)} Gold
━━━━━━━━━━━━━━━━━━━━
${t.summaryExtraNeeded}
${t.summaryExtraGold} ${formatNumber(calc.extraGoldNeeded)} Gold
${t.summaryOfficial} ${formatRM(calc.extraRMNeeded)}
${t.summaryReseller} ${formatRM(resellerExtraPrice)}
━━━━━━━━━━━━━━━━━━━━
${t.summarySave} ${formatRM(Math.max(0, calc.netSavingsRM))}`;

    handleCopyTextDirect(summary);
  };

  return (
    <div className="app-container">
      {/* Top Main Navigation Bar: Store vs Calculator + Theme & Lang Controls */}
      <nav className="main-nav-bar">
        <div className="nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            CiBmall Store
            <span className="nav-tab-pill">Main</span>
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            MAT2 Calculator
          </button>
        </div>

        <div className="nav-controls">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              /* Sun icon */
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              /* Moon icon */
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Language Switcher */}
          <div className="lang-switcher">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <span className="lang-divider">/</span>
            <button
              type="button"
              onClick={() => setLang('bm')}
              className={`lang-btn ${lang === 'bm' ? 'active' : ''}`}
            >
              BM
            </button>
          </div>
        </div>
      </nav>

      {/* Step-by-Step Setup Wizard Pop-Up */}
      <SetupWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        initialTargetQty={targetQty}
        initialGemPrice={gemPrice}
        initialUseCheap={useCheapFund}
        initialUseExp={useExpFund}
        initialReloadVoucher={reloadVoucher}
        initialUseReload={useReloadEvent}
        initialModalGold={modalGold}
        onApplyConfig={handleApplyWizardConfig}
        onCopySummaryDirect={handleCopyTextDirect}
        t={t}
        lang={lang}
      />

      {/* Toast Notification */}
      <div className={`toast-notification mono ${toastMessage ? 'show' : ''}`}>
        {toastMessage}
      </div>

      {/* VIEW 1: STORE VIEW (DEFAULT MAIN) */}
      {activeTab === 'store' && (
        <StoreSection t={t} onNotify={triggerToast} />
      )}

      {/* VIEW 2: MAT2 CALCULATOR VIEW */}
      {activeTab === 'calculator' && (
        <>
          {/* TOP ROW: Header with Setup Wizard & Reseller Deal Analyzer */}
          <div className="desktop-top-grid">
            <Header lang={lang} setLang={setLang} t={t} onOpenWizard={() => setShowWizard(true)} />
            <ResellerDealAnalyzer t={t} />
          </div>

          {/* MAIN ROW: 2-Column Side-by-Side */}
          <div className="desktop-main-grid">
            {/* Left Column: Target Item + Balance & Funds */}
            <div className="desktop-col">
              <TargetItemSection
                targetQty={targetQty}
                setTargetQty={setTargetQty}
                gemPrice={gemPrice}
                setGemPrice={setGemPrice}
                unitPrice={calc.unitPrice}
                fullRMCost={calc.fullRMCost}
                targetType={targetType}
                setTargetType={setTargetType}
                t={t}
              />

              <BalanceFundsSection
                modalGold={modalGold}
                setModalGold={setModalGold}
                useCheapFund={useCheapFund}
                setUseCheapFund={setUseCheapFund}
                useExpFund={useExpFund}
                setUseExpFund={setUseExpFund}
                useReloadEvent={useReloadEvent}
                setUseReloadEvent={setUseReloadEvent}
                reloadVoucher={reloadVoucher}
                setReloadVoucher={setReloadVoucher}
                fundShortfall={calc.fundShortfall}
                totalFundCost={calc.totalFundCost}
                t={t}
              />
            </div>

            {/* Right Column: Calculation Ledger */}
            <div className="desktop-col">
              <CalculationLedgerSection
                targetQty={safeQty}
                unitLabel={calc.unitLabel}
                unitPrice={calc.unitPrice}
                fullGoldCost={calc.fullGoldCost}
                fullRMCost={calc.fullRMCost}
                modalGold={safeModalGold}
                totalFundCost={calc.totalFundCost}
                balanceAfterFund={calc.balanceAfterFund}
                fundShortfall={calc.fundShortfall}
                totalVoucherYield={calc.totalVoucherYield}
                coveredItems={calc.coveredItems}
                dustVoucher={calc.dustVoucher}
                remainingItems={calc.remainingItems}
                remainingItemsGold={calc.remainingItemsGold}
                usableGold={calc.usableGold}
                netItemDeficit={calc.netItemDeficit}
                extraGoldNeeded={calc.extraGoldNeeded}
                extraRMNeeded={calc.extraRMNeeded}
                actualTotalRM={calc.actualTotalRM}
                netSavingsRM={calc.netSavingsRM}
                onCopySummary={handleCopySummary}
                t={t}
              />
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="app-footer mono">
        {t.footerText}
      </footer>
    </div>
  );
}
