import React from "react";
import "./SidebarFooter.css";

import iconSettings from "../../icons/settings.png";
import iconLogout from "../../icons/logout.png";

function SidebarFooter({ isCollapsed }) {
  const user = {
    name: "Michael Smith",
    email: "michaelsmith12@gmail.com",
    avatar: "/user.png",
    isActive: true,
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="sidebar-footer">
      {/* Settings */}
      <a
        href="/settings"
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
      >
        <img src={iconSettings} alt="Settings" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">Settings</span>}
      </a>

      {/* Logout */}
      <div
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleLogout}
      >
        <img src={iconLogout} alt="Logout" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">Logout</span>}
      </div>

      {/* User info */}
      <div className={`user-info ${isCollapsed ? "collapsed" : ""}`}>
        <img src={user.avatar} alt="User" className="user-avatar" />
        {!isCollapsed && (
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarFooter;
