import React from "react";

function SettingsItem({ label, icon }) {
  return (
    <div className="settings-item">
      <img src={icon} alt={label} className="item-icon" />
      <span className="item-label">{label}</span>
    </div>
  );
}

export default SettingsItem;
