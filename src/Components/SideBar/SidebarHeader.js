import React from "react";
import "./SidebarHeader.css";
import whitelogo from "../../assets/icons/whightlogo.png"
import arrowlogo from "../../assets/icons/logoicon.svg"
function SidebarHeader({ isCollapsed }) {
  return (
    <div className="sidebar-header">
      {!isCollapsed ? (
        <img src={whitelogo} alt="Logo" className="sidebar-logo" />
      ) : (
        <img
          src={arrowlogo}
          alt="Small Logo"
          className="sidebar-logo-small"
        />
      )}
    </div>
  );
}

export default SidebarHeader;
