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
  
  // الحصول على userId أو companyId من localStorage
  const userId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");

  const handleItemClick = (itemLabel) => {
    if (itemLabel === "Change Password") {
      navigate("/forgot-password");
    } else if (itemLabel === "Account Settings") {
      if (userRole === "company") {
        // للشركة: التوجه إلى صفحة الملف الشخصي للشركة
        if (companyId) {
          navigate(`/company/profile/edit/${companyId}`);
        } else {
          navigate("/company/profile");
        }
      } else if (userRole === "jobSeeker") {
        // للمتقدم: التوجه إلى صفحة تحرير الملف الشخصي
        if (userId) {
          navigate(`/user/profile/edit/${userId}`);
        } else {
          navigate("/user/profile/edit");
        }
      }
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