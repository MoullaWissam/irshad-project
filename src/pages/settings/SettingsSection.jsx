import React from "react";
import SettingsItem from "./SettingsItem";

function SettingsSection({ title, items, onItemClick, userRole, userId, companyId }) {
  return (
    <div className="settings-section">
      <h3 className="section-title">{title}</h3>
      <div className="section-items">
        {items.map((item, index) => (
          <SettingsItem
            key={index}
            label={item.label}
            icon={item.icon}
            onClick={() => onItemClick && onItemClick(item.label)}
            userRole={userRole}
            userId={userId}
            companyId={companyId}
          />
        ))}
      </div>
    </div>
  );
}

export default SettingsSection;