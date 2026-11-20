import React, { useState } from 'react';
import Header from './components/Header';
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

  // Pop-up Wizard Modal State (Opens automatically on first visit)
  const [showWizard, setShowWizard] = useState(true);

  // Core Calculator Configuration States
  const [targetType, setTargetType] = useState('gem'); // 'gem' | 'spin'
  const [targetQty, setTargetQty] = useState(339);

  const [modalGold, setModalGold] = useState(50000);
  const [useCheapFund, setUseCheapFund] = useState(true);
  const [useExpFund, setUseExpFund] = useState(true);
  const [useReloadEvent, setUseReloadEvent] = useState(true);
  const [reloadVoucher, setReloadVoucher] = useState(22500);

  const [toastMessage, setToastMessage] = useState('');

  // Handle configuration from the Wizard
  const handleApplyWizardConfig = (cfg) => {
    setTargetType(cfg.targetType);
    setTargetQty(cfg.qty);
    setUseCheapFund(cfg.useCheap);
    setUseExpFund(cfg.useExp);
    setUseReloadEvent(cfg.useReload);
    setReloadVoucher(cfg.reloadAmount);
  };

  // Convert empty string to 0 for calculations so backspacing doesn't break
  const safeQty = targetQty === '' ? 0 : parseInt(targetQty, 10) || 0;
  const safeModalGold = modalGold === '' ? 0 : parseInt(modalGold, 10) || 0;
  const safeReloadVoucher = reloadVoucher === '' ? 0 : parseInt(reloadVoucher, 10) || 0;

  // Perform Calculations (1 Spin = 9 Luck Coins = 270 Gold)
  const calc = calculateAll({
    mode: targetType,
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
      setToastMessage(t.copiedToast);
      setTimeout(() => setToastMessage(''), 2500);
    }).catch(() => {
      setToastMessage(t.failedToast);
      setTimeout(() => setToastMessage(''), 2500);
    });
  };

  const handleCopySummary = () => {
    const totalCoins = targetType === 'spin' ? safeQty * 9 : null;
    const targetLabel =
      targetType === 'gem'
        ? `${safeQty} Gems`
        : `${safeQty} Spins (${formatNumber(totalCoins)} Luck Coins)`;

    const summary = `${t.summaryTitle}
━━━━━━━━━━━━━━━━━━━━
${t.summaryTarget} ${targetLabel} (${formatNumber(calc.fullGoldCost)} Gold)
${t.summaryModal} ${formatNumber(safeModalGold)} Gold (${formatRM(safeModalGold * 0.0216)})
${t.summaryVoucherCover} ${formatNumber(calc.coveredItems)} (${t.summaryRemain} ${formatNumber(calc.remainingItems)})
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
      {/* Step-by-Step Setup Wizard Pop-Up */}
      <SetupWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        initialTargetQty={targetQty}
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

      {/* TOP ROW: Header with Language Switcher & Reseller Deal Analyzer */}
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

      {/* Footer */}
      <footer className="app-footer mono">
        {t.footerText}
      </footer>
    </div>
  );
}
