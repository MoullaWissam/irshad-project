import React from "react";
import SettingsSection from "./SettingsSection";
import "./SettingsPage.css";

function SettingsPage({ settings }) {
  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>
      {settings.map((section, index) => (
        <SettingsSection
          key={index}
          title={section.section}
          items={section.items}
        />
      ))}
    </div>
  );
}

export default SettingsPage;
