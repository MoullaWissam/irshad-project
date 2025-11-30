import React from "react";
import "./ScreeningPopup.css";

export default function Toast({ toast }) {
  if (!toast.text) return null;

  return <div className={`toast ${toast.type} show`}>{toast.text}</div>;
}
