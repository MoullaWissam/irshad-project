import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from './i18n'; // استيراد مثيل i18n
import { I18nextProvider } from 'react-i18next';

// ----- الحل: تطبيق الاتجاه قبل أي شيء -----
// 1. تحميل اللغة المحفوظة أو الافتراضية
const getSavedLanguage = () => {
  const saved = localStorage.getItem('i18nextLng');
  if (saved && (saved === 'en' || saved === 'ar')) {
    return saved;
  }
  
  // اكتشاف لغة المتصفح
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('ar')) {
    return 'ar';
  }
  return 'en';
};

// 2. تطبيق الاتجاه على HTML قبل تحميل React
const savedLanguage = getSavedLanguage();
const direction = savedLanguage === 'ar' ? 'rtl' : 'ltr';

// تطبيق على documentElement
document.documentElement.dir = direction;
document.documentElement.lang = savedLanguage;

// تطبيق على body
document.body.dir = direction;
document.body.lang = savedLanguage;

// 3. تحديث i18n لاستخدام اللغة المحفوظة
i18n.changeLanguage(savedLanguage);

// 4. تأكد من تطبيق الاتجاه عند تغيير اللغة
i18n.on('languageChanged', (lng) => {
  const newDirection = lng === 'ar' ? 'rtl' : 'ltr';
  
  // تحديث HTML
  document.documentElement.dir = newDirection;
  document.documentElement.lang = lng;
  
  // تحديث body
  document.body.dir = newDirection;
  document.body.lang = lng;
  
  // حفظ في localStorage
  localStorage.setItem('i18nextLng', lng);
  localStorage.setItem('i18nextDir', newDirection);
});

// ----- تصيير React مع Provider -----
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* I18nextProvider لتوفير i18n لجميع المكونات */}
    <I18nextProvider i18n={i18n}>
      {/* Suspense للتحميل غير المتزامن للترجمات */}
      <Suspense fallback={<div>Loading translations...</div>}>
        <App />
      </Suspense>
    </I18nextProvider>
  </React.StrictMode>
);

// 5. تأكد من أن الاتجاه مطبق بعد التصيير
setTimeout(() => {
  // إعادة تطبيق للسلامة
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