import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for iOS & Android Mobile PWA Application
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).then(
      (registration) => {
        registration.update();
        console.log('MAT2 Calc PWA registered successfully with scope:', registration.scope);
      },
      (err) => {
        console.warn('MAT2 Calc PWA registration failed (safe to ignore if not on HTTPS or offline):', err);
      }
    ).catch(() => {});
  });
}
