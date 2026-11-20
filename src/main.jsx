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
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('MAT2 Calc PWA registered successfully with scope:', registration.scope);
      },
      (err) => {
        console.log('MAT2 Calc PWA registration failed:', err);
      }
    );
  });
}
