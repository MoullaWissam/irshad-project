// DurationSlider.js
import React from "react";
import { useTranslation } from 'react-i18next';

export default function DurationSlider({ duration, setDuration }) {
  const { t } = useTranslation();
  
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6, color: "white" }}>
        {t("Test Duration:")} <strong>{duration} {t("minutes")}</strong>
      </label>
      <input
        className="range"
        type="range"
        min={6}
        max={14}
        step={2}
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        aria-label={t("Test duration slider")}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginTop: 6,
        }}
      >
        <span>6</span>
        <span>8</span>
        <span>10</span>
        <span>12</span>
        <span>14</span>
      </div>
    </div>
  );
}