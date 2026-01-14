import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

function SettingsItem({ label, icon, onClick, userRole, userId, companyId }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const handleClick = () => {
    if (label === "Account status") {
      setShowPopup(true);
    } else if (label === "Delete Account") {
      setShowConfirmDelete(true);
    } else if (label === "Language") {
      setShowLanguagePopup(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      let url = "";
      
      // تحديد الرابط بناءً على نوع المستخدم
      if (userRole === "company" && companyId) {
        url = `http://localhost:3000/company-management/delete/${companyId}`;
      } else if (userRole === "jobSeeker" && userId) {
        url = `http://localhost:3000/auth/delete/${userId}`;
      } else {
        throw new Error("User ID or Company ID not found");
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // تم الحذف بنجاح
        alert(data.message || t("Account has been deleted successfully."));
        
        // مسح جميع البيانات من localStorage
        localStorage.clear();
        
        // إعادة التوجيه إلى الصفحة الرئيسية أو صفحة تسجيل الدخول
        navigate("/");
        window.location.reload(); // لتحديث حالة التطبيق بالكامل
      } else {
        // خطأ من الخادم
        alert(data.message || t("Failed to delete account. Please try again."));
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(t("Network error. Please check your connection and try again."));
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLanguagePopup(false);
    
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
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

    return null;
  };

  const renderConfirmDelete = () => {
    if (!showConfirmDelete) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>{t('Delete Account')}</h3>
          <p className="warning-text">
            {t('Warning: This action cannot be undone. All your data will be permanently deleted.')}
          </p>
          <p>{t('Are you sure you want to delete your account?')}</p>

          <div className="popup-actions">
            <button
              className={`btn-confirm ${isDeleting ? "btn-disabled" : ""}`}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? t('Deleting...') : t('Yes, Delete Account')}
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowConfirmDelete(false)}
              disabled={isDeleting}
            >
              {t('Cancel')}
            </button>
          </div>
        </div>
      </div>
    );
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
      {renderConfirmDelete()}
      {renderLanguagePopup()}
    </>
  );
}

export default SettingsItem;