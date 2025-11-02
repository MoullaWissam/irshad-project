import React, { useState } from "react";
import "./Sidebar.css";

// استيراد المكونات الجزئية
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  // ✅ حالة الطي
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ دالة التبديل
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* زر الطي */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? ">" : "<"}
      </button>

      <div className="sidebar-content">
        {/* رأس الشريط الجانبي */}
        <SidebarHeader isCollapsed={isCollapsed} />

        {/* مربع البحث */}
        <SidebarSearch isCollapsed={isCollapsed} />

        {/* قائمة العناصر */}
        <SidebarMenu isCollapsed={isCollapsed} />

        {/* الفوتر */}
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}

export default Sidebar;
