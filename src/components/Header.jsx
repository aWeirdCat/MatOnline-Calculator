import React from 'react';
import logoImg from '../assets/logo1.png';
import './Header.css';

export default function Header({ lang, setLang, t, onOpenWizard }) {
  return (
    <header className="header-card">
      <div className="header-top">
        <div className="title-row">
          <img src={logoImg} alt="MAT2 Logo" className="header-logo-img" />
          <div className="title-text-group">
            <h1 className="header-title">{t.appTitle}</h1>
            <p className="header-subtitle">{t.appSubtitle}</p>
          </div>
        </div>

        <div className="header-actions-group">
          {/* Quick Setup Wizard Button (No emoji) */}
          <button
            type="button"
            onClick={onOpenWizard}
            className="btn-wizard-trigger mono"
            title="Open Setup Wizard"
          >
            Setup Wizard
          </button>

          {/* Language Switcher Buttons */}
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
      </div>

      <div className="header-bottom">
        <span className="badge-base-rate">
          {t.baseRate} <strong>RM 10.80</strong> = 500 Gold (<strong>RM 0.0216</strong>/G)
        </span>
        <span className="badge-formula">{t.baseFormula}</span>
      </div>
    </header>
  );
}
