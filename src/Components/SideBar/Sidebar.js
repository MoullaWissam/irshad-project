import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ userRole = "jobSeeker" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // كشف حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* زر القائمة للموبايل */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      {/* Overlay للموبايل */}
      {isMobile && isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <aside 
        className={`
          sidebar 
          ${isCollapsed && !isMobile ? "collapsed" : ""}
          ${isMobile ? "mobile" : ""}
          ${isMobileOpen ? "mobile-open" : ""}
        `}
      >
        <div className="sidebar-content">
          <SidebarHeader 
            isCollapsed={isCollapsed} 
            onToggle={isMobile ? closeMobileSidebar : toggleSidebar}
          />
          <SidebarMenu 
            isCollapsed={isCollapsed} 
            userRole={userRole}
            onItemClick={closeMobileSidebar}
          />
          <SidebarFooter 
            isCollapsed={isCollapsed} 
            userRole={userRole}
          />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;