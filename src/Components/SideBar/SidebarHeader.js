import React from "react";
import "./SidebarHeader.css";
import whitelogo from "../../assets/icons/whightlogo.svg";
import arrowlogo from "../../assets/icons/logoicon.svg";
import toggleIcon from "../../assets/icons/sidebar.svg";

function SidebarHeader({ isCollapsed, onToggle }) {
  return (
    <div className="sidebar-header">
      <div className="header-content">
        {!isCollapsed ? (
          <>
            {/* عندما يكون مفتوحاً - الشعار + أيقونة التبديل ثابتة */}
            <img src={whitelogo} alt="Logo" className="sidebar-logo" />
            <div 
              className="toggle-button always-visible"
              onClick={onToggle}
            >
              <img src={toggleIcon} alt="Toggle Menu" className="toggle-icon" />
            </div>
          </>
        ) : (
          <>
            {/* عندما يكون مغلقاً - الشعار يظهر افتراضياً */}
            <img
              src={arrowlogo}
              alt="Small Logo"
              className="sidebar-logo-small default-logo"
            />
            {/* وعند الhover تظهر أيقونة التبديل بدلاً منه */}
            <div 
              className="toggle-button hover-only"
              onClick={onToggle}
            >
              <img src={toggleIcon} alt="Toggle Menu" className="toggle-icon" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SidebarHeader;