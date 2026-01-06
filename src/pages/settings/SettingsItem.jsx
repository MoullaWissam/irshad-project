import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

function SettingsItem({ label, icon, onClick }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // تحديث اللغة الحالية عند التغيير
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const handleClick = () => {
    if (label === "Account status" || label === "Delete Account") {
      setShowPopup(true);
      setPassword("");
      setError("");
    } else if (label === "Language") {
      setShowLanguagePopup(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 1) {
      setError("Password is required");
    } else if (value.length < 6) {
      setError("Password must be at least 6 characters");
    } else {
      setError("");
    }
  };

  const handleDeleteAccount = () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    console.log("Deleting account with password:", password);
    alert(
      "Account deletion request has been submitted. You will receive a confirmation email."
    );

    setShowPopup(false);
    setPassword("");
    setError("");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLanguagePopup(false);
    
    // تحديث اتجاه الصفحة بناءً على اللغة
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // حفظ التفضيل في localStorage
    localStorage.setItem('preferred-language', lng);
  };

  const renderPopup = () => {
    if (!showPopup) return null;

    if (label === "Account status") {
      return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{t('Account status')}</h3>
            <p>{t('Do you want to activate your account?')}</p>
            <div className="popup-actions">
              <button
                className="btn-activate"
                onClick={() => {
                  console.log("Account activated");
                  setShowPopup(false);
                }}
              >
                {t('Activate')}
              </button>
              <button
                className="btn-deactivate"
                onClick={() => {
                  console.log("Account deactivated");
                  setShowPopup(false);
                }}
              >
                {t('Deactivate')}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowPopup(false)}
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (label === "Delete Account") {
      const isPasswordValid = password.length >= 6;

      return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{t('Delete Account')}</h3>
            <p className="warning-text">
               {t('Warning: This action cannot be undone. All your data will be permanently deleted.')}
            </p>
            <p>{t('Please enter your password to confirm account deletion:')}</p>

            <div className="password-input-group">
              <input
                type="password"
                placeholder={t('Enter your password')}
                className={`password-input ${error ? "input-error" : ""}`}
                value={password}
                onChange={handlePasswordChange}
                autoFocus
              />
              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="popup-actions">
              <button
                className={`btn-confirm ${!isPasswordValid ? "btn-disabled" : ""}`}
                onClick={handleDeleteAccount}
                disabled={!isPasswordValid}
              >
                {t('Delete Account')}
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowPopup(false);
                  setPassword("");
                  setError("");
                }}
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

 const renderLanguagePopup = () => {
  if (!showLanguagePopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{t('Select Language')}</h3>
        <div className="language-options">
          <div 
            className={`language-option ${currentLanguage === 'en' ? 'selected' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            <div className="language-content">
              <span className="language-flag">🇺🇸</span>
              <div className="language-info">
                <span className="language-name">English</span>
                <span className="language-desc">English language</span>
              </div>
            </div>
            {currentLanguage === 'en' && (
              <div className="language-check">
                <div className="check-circle">✓</div>
              </div>
            )}
          </div>
          <div 
            className={`language-option ${currentLanguage === 'ar' ? 'selected' : ''}`}
            onClick={() => changeLanguage('ar')}
          >
            <div className="language-content">
              <span className="language-flag">🇸🇦</span>
              <div className="language-info">
                <span className="language-name">العربية</span>
                <span className="language-desc">اللغة العربية</span>
              </div>
            </div>
            {currentLanguage === 'ar' && (
              <div className="language-check">
                <div className="check-circle">✓</div>
              </div>
            )}
          </div>
        </div>
        <div className="popup-actions">
          <button
            className="btn-cancel"
            onClick={() => setShowLanguagePopup(false)}
          >
            {t('Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

  if (label === "---") {
    return <hr className="divider" />;
  }

  return (
    <>
      <div className="settings-item" onClick={handleClick}>
        <img src={icon} alt={label} className="item-icon" />
        <span className="item-label">{t(label)}</span>
        {label === "Language" && (
          <span className="language-indicator">
            {currentLanguage === 'en' ? 'English' : 'العربية'}
          </span>
        )}
      </div>
      {renderPopup()}
      {renderLanguagePopup()}
    </>
  );
}

export default SettingsItem;