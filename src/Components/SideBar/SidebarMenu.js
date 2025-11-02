import React from "react";
import "./SidebarMenu.css";

function SidebarMenu({ isCollapsed }) {
  return (
    <nav className="sidebar-menu">
      <div className="menu-item">
        <div className={`menu-left ${isCollapsed ? "collapsed" : ""}`}>
          <img
            src={"/applications.png"}
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
