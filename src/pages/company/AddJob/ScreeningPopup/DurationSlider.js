import React from "react";

export default function DurationSlider({ duration, setDuration }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6, color: "white" }}>
        Test Duration: <strong>{duration} minutes</strong>
      </label>
      <input
        className="range"
        type="range"
        min={6}
        max={14}
        step={2}
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        aria-label="Test duration slider"
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
