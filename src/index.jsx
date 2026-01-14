import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

const getSavedLanguage = () => {
  const saved = localStorage.getItem('i18nextLng');
  if (saved && (saved === 'en' || saved === 'ar')) {
    return saved;
  }
  
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('ar')) {
    return 'ar';
  }
  return 'en';
};

const savedLanguage = getSavedLanguage();
const direction = savedLanguage === 'ar' ? 'rtl' : 'ltr';

document.documentElement.dir = direction;
document.documentElement.lang = savedLanguage;

document.body.dir = direction;
document.body.lang = savedLanguage;

i18n.changeLanguage(savedLanguage);

i18n.on('languageChanged', (lng) => {
  const newDirection = lng === 'ar' ? 'rtl' : 'ltr';
  
  document.documentElement.dir = newDirection;
  document.documentElement.lang = lng;
  
  document.body.dir = newDirection;
  document.body.lang = lng;
  
  localStorage.setItem('i18nextLng', lng);
  localStorage.setItem('i18nextDir', newDirection);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading translations...</div>}>
        <App />
      </Suspense>
    </I18nextProvider>
  </React.StrictMode>
);

setTimeout(() => {
  const currentLang = i18n.language || savedLanguage;
  const currentDir = currentLang === 'ar' ? 'rtl' : 'ltr';
  
  if (document.documentElement.dir !== currentDir) {
    console.warn('Re-applying direction after render');
    document.documentElement.dir = currentDir;
    document.documentElement.lang = currentLang;
    document.body.dir = currentDir;
    document.body.lang = currentLang;
  }
}, 100);

reportWebVitals();