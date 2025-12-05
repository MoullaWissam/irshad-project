import React from "react";
import SettingsSection from "./SettingsSection";
import { settingsByRole } from "./settingsConfig.js";
import "./SettingsPage.css";
import { useNavigate } from "react-router-dom";

function SettingsPage({ userRole = "jobSeeker" }) {
  const navigate = useNavigate();
  const settings = settingsByRole[userRole];

  // دالة للتعامل مع النقر على العناصر
  const handleItemClick = (itemLabel) => {
    if (itemLabel === "Change Password") {
      // الانتقال إلى صفحة forgot-password
      navigate("/forgot-password");
    }
    // العناصر الأخرى تعالج في SettingsItem
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>
      {settings.map((section, index) => (
        <SettingsSection
          key={index}
          title={section.title}
          items={section.items}
          onItemClick={handleItemClick}
        />
      ))}
    </div>
  );
}

export default SettingsPage;

// // SettingsPage.js
// import React from "react";
// import SettingsSection from "./SettingsSection";
// import { settingsByRole } from "./settingsConfig.js";
// import "./SettingsPage.css";

// function SettingsPage({ userRole = "jobSeeker" }) {
//   const settings = settingsByRole[userRole];

//   return (
//     <div className="settings-page">
//       <h2 className="settings-title">Settings</h2>
//       {settings.map((section, index) => (
//         <SettingsSection
//           key={index}
//           title={section.title}
//           items={section.items}
//         />
//       ))}
//     </div>
//   );
// }

// export default SettingsPage;
