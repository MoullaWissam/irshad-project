import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState("jobSeeker"); // قيمة افتراضية

  // كشف حجم الشاشة وجلب userRole من localStorage
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    // جلب userRole من localStorage
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // استماع لتغييرات localStorage (اختياري - إذا كنت تريد التحديث عند التغيير)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserRole = localStorage.getItem("userRole");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
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