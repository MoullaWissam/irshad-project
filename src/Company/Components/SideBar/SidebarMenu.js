import React from "react";
import "./SidebarMenu.css";

import iconApplications from "../../icons/applications.png"; // أيقونة التطبيقات

function SidebarMenu({ isCollapsed }) {
  return (
    <nav className="sidebar-menu">
      <div className="menu-item">
        <div className={`menu-left ${isCollapsed ? "collapsed" : ""}`}>
          <img
            src={iconApplications}
            alt="Applications"
            className="menu-icon-img"
          />
          {!isCollapsed && <span className="menu-text">Applications</span>}
        </div>
      </div>
    </nav>
  );
}

export default SidebarMenu;
