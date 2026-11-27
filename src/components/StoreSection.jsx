import React, { useState } from 'react';
import { STORE_ITEMS, TRANSACTION_FEE, PAYMENT_DETAILS } from '../constants/storeData';
import cibLogo from '../assets/cib-logo.svg';
import qrImage from '../assets/payment/qr-code.svg';
import './StoreSection.css';

export default function StoreSection({ t, onNotify }) {
  // State: Cart quantities keyed by item id, default empty or 1 for top card
  const [cart, setCart] = useState({});
  const [selectedItem, setSelectedItem] = useState(STORE_ITEMS[0].id);
  const [showQRModal, setShowQRModal] = useState(false);

  // Update item quantity
  const handleSetQty = (id, delta) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleQuickSelect = (id) => {
    setSelectedItem(id);
    setCart((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current > 0 ? current : 1 };
    });
  };

  // Calculations
  const cartEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const totalItemCount = cartEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const subtotal = cartEntries.reduce((sum, [id, qty]) => {
    const item = STORE_ITEMS.find((it) => it.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const originalSubtotal = cartEntries.reduce((sum, [id, qty]) => {
    const item = STORE_ITEMS.find((it) => it.id === id);
    return sum + (item ? (item.originalPrice || item.price) * qty : 0);
  }, 0);

  const savings = Math.max(0, originalSubtotal - subtotal);
  const totalFee = totalItemCount > 0 ? TRANSACTION_FEE : 0;
  const finalTotal = subtotal + totalFee;

  // Copy account number to clipboard
  const handleCopyAcc = () => {
    navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber).then(() => {
      if (onNotify) onNotify('Account number copied to clipboard!');
    });
  };

  // Generate WhatsApp Order Link
  const handleWhatsAppOrder = () => {
    if (totalItemCount === 0) {
      if (onNotify) onNotify('Please select at least one denomination.');
      return;
    }

    const orderLines = cartEntries.map(([id, qty]) => {
      const item = STORE_ITEMS.find((it) => it.id === id);
      const lineTotal = (item.price * qty).toFixed(2);
      return `• ${item.title} x${qty} = RM ${lineTotal}`;
    });

    const msg = [
      `*ORDER SUMMARY - CIB POINT / MAT2*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      ...orderLines,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Subtotal: RM ${subtotal.toFixed(2)}`,
      `Transaction Fee: RM ${totalFee.toFixed(2)}`,
      `*TOTAL PAYABLE: RM ${finalTotal.toFixed(2)}*`,
      savings > 0 ? `Total Saved: RM ${savings.toFixed(2)}` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `*Payment Method: Maybank Transfer / DuitNow*`,
      `Bank: ${PAYMENT_DETAILS.bankName}`,
      `Acc No: ${PAYMENT_DETAILS.accountNumber}`,
      `Acc Name: ${PAYMENT_DETAILS.accountName}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Hi, I would like to place this order. I have sent/will send the payment receipt now.`
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${PAYMENT_DETAILS.whatsappNumber}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="store-container">
      {/* Breadcrumb & Brand Header */}
      <div className="store-header-banner">
        <div className="store-breadcrumbs">
          <span>Home</span>
          <span className="breadcrumb-slash">/</span>
          <span>Gift Cards</span>
        </div>

        <div className="store-brand-card">
          <img src={cibLogo} alt="CiBmall Logo" className="store-cib-logo" />
          <div className="store-brand-info">
            <h2 className="store-brand-title">CiBmall</h2>
            <div className="store-brand-badge">Malaysia</div>
          </div>
        </div>
      </div>

      {/* Tabs navigation matching reference: Digital Pins */}
      <div className="store-tabs-row">
        <button type="button" className="store-tab-btn active">
          Digital Pins
        </button>
      </div>

      {/* Main Grid: Denominations (Left) & Order Summary / Payment (Right) */}
      <div className="store-layout-grid">
        {/* Left Column: Denomination Selector */}
        <div className="store-catalog-col">
          <div className="store-section-label">
            <h3>Denomination</h3>
            <span className="fee-notice-pill font-tabular">
              Buy more, save more (+RM 1.00 fee per order)
            </span>
          </div>

          <div className="denomination-grid">
            {STORE_ITEMS.map((item) => {
              const qty = cart[item.id] || 0;
              const isSelected = selectedItem === item.id || qty > 0;

              return (
                <div
                  key={item.id}
                  className={`denom-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleQuickSelect(item.id)}
                >
                  {/* Top fire / hot badge if available */}
                  <div className="denom-card-header">
                    {item.tag && (
                      <span className="denom-hot-tag" title="Hot Deal">
                        <svg className="fire-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                          <path d="M12 2c-.5 2-2 3.5-3.5 5.5C7 9.5 6 12 6 14.5c0 3.6 2.7 6.5 6 6.5s6-2.9 6-6.5c0-1.5-.5-3.5-2-5.5-1.5-2-3-3.5-3.5-5.5z"/>
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="denom-title">{item.title}</div>

                  <div className="denom-price-row font-tabular">
                    <span className="denom-price">
                      {item.price.toFixed(2)} <span className="denom-curr">MYR</span>
                    </span>
                    {item.originalPrice && (
                      <span className="denom-orig-price">
                        {item.originalPrice.toFixed(2)} MYR
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="denom-qty-stepper" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => handleSetQty(item.id, -1)}
                      disabled={qty === 0}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="stepper-value font-tabular">{qty}</span>
                    <button
                      type="button"
                      className="stepper-btn plus"
                      onClick={() => handleSetQty(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Checkout & Payment Details */}
        <div className="store-checkout-col">
          {/* Order Summary Card */}
          <div className="checkout-summary-card">
            <div className="checkout-header">
              <h3 className="checkout-title">Order Summary</h3>
              {totalItemCount > 0 && (
                <span className="checkout-items-count mono">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            {totalItemCount === 0 ? (
              <div className="checkout-empty-state">
                <p>No denomination selected yet.</p>
                <span>Click any card on the left to add CiB Points to your order.</span>
              </div>
            ) : (
              <div className="checkout-items-list">
                {cartEntries.map(([id, qty]) => {
                  const item = STORE_ITEMS.find((it) => it.id === id);
                  return (
                    <div key={id} className="checkout-item-row font-tabular">
                      <div className="item-row-left">
                        <span className="item-row-name">{item.title}</span>
                        <span className="item-row-qty mono">x{qty}</span>
                      </div>
                      <div className="item-row-right">
                        <span>RM {(item.price * qty).toFixed(2)}</span>
                        <button
                          type="button"
                          className="item-remove-btn"
                          onClick={() => handleSetQty(id, -qty)}
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="checkout-ledger-divider" />

            <div className="checkout-breakdown font-tabular">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row fee-row">
                <span>
                  Transaction Fee
                  <small className="fee-badge">Fixed RM 1</small>
                </span>
                <span>RM {totalFee.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="breakdown-row savings-row">
                  <span>Total Discount</span>
                  <span>-RM {savings.toFixed(2)}</span>
                </div>
              )}
              <div className="breakdown-row total-row">
                <span>Total Payable</span>
                <span className="total-amount">RM {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Order CTA Button */}
            <button
              type="button"
              className="btn-whatsapp-checkout mono"
              onClick={handleWhatsAppOrder}
              disabled={totalItemCount === 0}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.17 8.17 0 0 1-1.25-4.28c0-4.51 3.67-8.18 8.18-8.18 2.19 0 4.24.85 5.79 2.4 1.54 1.55 2.4 3.6 2.4 5.79 0 4.52-3.67 8.14-8.18 8.14zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29z"/>
              </svg>
              Send Order via WhatsApp
            </button>
            <p className="wa-help-text">
              Direct order sent to <strong>{PAYMENT_DETAILS.whatsappDisplay}</strong>
            </p>
          </div>

          {/* Bank Transfer & QR Details Card */}
          <div className="payment-details-card">
            <div className="payment-card-header">
              <h4 className="payment-card-title">Payment Method</h4>
              <span className="payment-badge">Bank / DuitNow</span>
            </div>

            <div className="bank-info-box">
              <div className="bank-row">
                <span className="bank-label">Bank</span>
                <span className="bank-value font-tabular">{PAYMENT_DETAILS.bankName}</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Account No</span>
                <div className="acc-number-row">
                  <span className="bank-value font-tabular bold-acc">{PAYMENT_DETAILS.accountNumber}</span>
                  <button
                    type="button"
                    className="btn-copy-acc mono"
                    onClick={handleCopyAcc}
                    title="Copy Account Number"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="bank-row">
                <span className="bank-label">Account Name</span>
                <span className="bank-value">{PAYMENT_DETAILS.accountName}</span>
              </div>
            </div>

            {/* QR View Trigger */}
            <div className="qr-preview-box">
              <img src={qrImage} alt="Payment QR Code" className="qr-thumbnail" />
              <div className="qr-preview-info">
                <span className="qr-title">Instant DuitNow QR</span>
                <span className="qr-subtitle">Scan via Maybank, MAE, or any banking app</span>
                <button
                  type="button"
                  className="btn-show-qr mono"
                  onClick={() => setShowQRModal(true)}
                >
                  View Large QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="qr-modal-backdrop" onClick={() => setShowQRModal(false)}>
          <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Maybank / DuitNow QR</h3>
              <button
                type="button"
                className="qr-modal-close"
                onClick={() => setShowQRModal(false)}
              >
                ×
              </button>
            </div>
            <div className="qr-modal-body">
              <img src={qrImage} alt="Payment QR Code Full" className="qr-modal-img" />
              <div className="qr-modal-details font-tabular">
                <p><strong>{PAYMENT_DETAILS.bankName}</strong>: {PAYMENT_DETAILS.accountNumber}</p>
                <p>{PAYMENT_DETAILS.accountName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
