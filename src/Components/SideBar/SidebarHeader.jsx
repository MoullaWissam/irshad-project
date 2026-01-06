import React from "react";
import "./SidebarHeader.css";
import whitelogo from "../../assets/icons/whightlogo.svg";
import arrowlogo from "../../assets/icons/logoicon.svg";
import toggleIcon from "../../assets/icons/sidebar.svg";

function SidebarHeader({ isCollapsed, onToggle }) {
  return (
    <div className="sidebar-header-custom">
      <div className="sidebar-header-content">
        {!isCollapsed ? (
          <>
            {/* عندما يكون مفتوحاً - الشعار + أيقونة التبديل ثابتة */}
            <img src={whitelogo} alt="Logo" className="sidebar-logo-main" />
            <div 
              className="sidebar-toggle-btn sidebar-toggle-visible"
              onClick={onToggle}
            >
              <img src={toggleIcon} alt="Toggle Menu" className="sidebar-toggle-icon" />
            </div>
          </>
        ) : (
          <>
            {/* عندما يكون مغلقاً - الشعار يظهر افتراضياً */}
            <img
              src={arrowlogo}
              alt="Small Logo"
              className="sidebar-logo-collapsed sidebar-logo-default"
            />
            {/* وعند الhover تظهر أيقونة التبديل بدلاً منه */}
            <div 
              className="sidebar-toggle-btn sidebar-toggle-hover"
              onClick={onToggle}
            >
              <img src={toggleIcon} alt="Toggle Menu" className="sidebar-toggle-icon" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SidebarHeader;