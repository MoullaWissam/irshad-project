import React from "react";
import SettingsSection from "./SettingsSection.jsx";
import { settingsByRole } from "./settingsConfig.jsx";
import "./SettingsPage.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function SettingsPage({ userRole = "jobSeeker", settings }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // احصل على بيانات المستخدم من localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const companyData = JSON.parse(localStorage.getItem("companyData"));
  
  // استخرج الـ IDs بناءً على الدور
  const userId = userRole === "jobSeeker" && userData ? userData.id : null;
  const companyId = userRole === "company" && companyData ? companyData.id : null;

  console.log("SettingsPage: userRole =", userRole, "companyId =", companyId, "userId =", userId);

  const handleItemClick = (itemLabel) => {
    if (itemLabel === "Change Password") {
      navigate("/forgot-password");
    } else if (itemLabel === "Account Settings") {
      if (userRole === "company") {
        navigate("/company/profile/");
      } else if (userRole === "jobSeeker") {
        navigate("/user/profile/");
      }
    }
  };

  const currentSettings = settings || settingsByRole[userRole];

  return (
    <div className="settings-page">
      <h2 className="settings-title">{t('Settings')}</h2>
      {currentSettings.map((section, index) => (
        <SettingsSection
          key={index}
          title={t(section.title)}
          items={section.items}
          onItemClick={handleItemClick}
          userRole={userRole}
          userId={userId}
          companyId={companyId}
        />
      ))}
    </div>
  );
}

export default SettingsPage;