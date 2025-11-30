import React, { useState } from "react";
import "./Sidebar.css";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ userRole = "jobSeeker" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      
      /*  
        ملاحظة مهمة:
        onClick يشتغل فقط لو المستخدم كبس في المنطقة الفاضية
      */
      onClick={toggleSidebar}
    >
      <div 
        className="sidebar-content"
        
        /*  
          منع انتقال الضغط للـ Sidebar
          حتى لا ينفّذ toggle عند الضغط داخل العناصر
        */
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarHeader isCollapsed={isCollapsed} />
        <SidebarMenu isCollapsed={isCollapsed} userRole={userRole} />
        <SidebarFooter isCollapsed={isCollapsed} userRole={userRole} />
      </div>
    </aside>
  );
}

export default Sidebar;
