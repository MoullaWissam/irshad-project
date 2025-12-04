import React from "react";
import "./SidebarFooter.css";

import iconSettings from "../../assets/icons/settings.png";
import iconLogout from "../../assets/icons/logout.png";

function SidebarFooter({ isCollapsed, userRole = "jobSeeker", onClickInside }) {
  // بيانات المستخدم حسب الدور
  const userData = {
    jobSeeker: {
      name: "Michael Smith",
      email: "michaelsmith12@gmail.com",
      avatar: "/user.png",
    },
    company: {
      name: "Tech Solutions Inc.",
      email: "contact@techsolutions.com",
      avatar: "/company-avatar.png", // تأكد من وجود هذه الصورة
    }
  };

  const user = userData[userRole] || userData.jobSeeker;

  const handleLogout = (e) => {
    e.stopPropagation();
    console.log("Logging out...");
    // logic تسجيل الخروج
  };

  const handleSettings = (e) => {
    e.stopPropagation();
    // توجه إلى إعدادات الشركة أو الباحث عن عمل
    const settingsPath = userRole === "company" ? "/company/settings" : "/settings";
    window.location.href = settingsPath;
  };

  return (
    <div className="sidebar-footer" onClick={onClickInside}>
      
      {/* Settings */}
      <div
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleSettings}
      >
        <img src={iconSettings} alt="Settings" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">
          {userRole === "company" ? "Company Settings" : "Settings"}
        </span>}
      </div>

      {/* Logout */}
      <div
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleLogout}
      >
        <img src={iconLogout} alt="Logout" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">Logout</span>}
      </div>

      {/* User info */}
      <div
        className={`user-info ${isCollapsed ? "collapsed" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={user.avatar} alt="User" className="user-avatar" />
        {!isCollapsed && (
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
            <span className={`status-dot ${userRole === "company" ? "active" : "active"}`}>
              {userRole === "company" ? "Company" : "Job Seeker"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarFooter;