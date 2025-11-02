import React from "react";
import "./SidebarHeader.css";

function SidebarHeader({ isCollapsed }) {
  return (
    <div className="sidebar-header">
      {!isCollapsed ? (
        <img src="/LogoWhite.png" alt="Logo" className="sidebar-logo" />
      ) : (
        <img
          src="/LogoArow.png"
          alt="Small Logo"
          className="sidebar-logo-small"
        />
      )}
    </div>
  );
}

export default SidebarHeader;
