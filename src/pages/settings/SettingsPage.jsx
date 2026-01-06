import React from "react";
import SettingsSection from "./SettingsSection.jsx";
import { settingsByRole } from "./settingsConfig.jsx";
import "./SettingsPage.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function SettingsPage({ userRole = "jobSeeker" }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const settings = settingsByRole[userRole];

  const handleItemClick = (itemLabel) => {
    if (itemLabel === "Change Password") {
      navigate("/forgot-password");
    }
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">{t('Settings')}</h2>
      {settings.map((section, index) => (
        <SettingsSection
          key={index}
          title={t(section.title)}
          items={section.items}
          onItemClick={handleItemClick}
        />
      ))}
    </div>
  );
}

export default SettingsPage;