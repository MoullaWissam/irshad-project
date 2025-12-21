import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SidebarMenu.css";

// Icons Imports
import applicationsIcon from "../../assets/icons/applications.svg";
import searchIcon from "../../assets/icons/search.svg";
import settingsIcon from "../../assets/icons/settings.png";
import matchesIcon from "../../assets/icons/matches.svg";
import mainIcon from "../../assets/icons/home.svg";
import applicantsIcon from "../../assets/icons/applicants.svg";
import addJobIcon from "../../assets/icons/addjobs.svg";
import dropdownIcon from "../../assets/icons/dropdown.svg";

function SidebarMenu({ isCollapsed, userRole = "jobSeeker", onItemClick }) {
  const [openDropdowns, setOpenDropdowns] = useState({
    applicants: false, // تمت إزالة 'applications' من هنا
  });

  const toggleDropdown = (dropdownName) => {
    if (isCollapsed) return;
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  const handleItemClick = () => {
    if (onItemClick) onItemClick();
  };

  // تعريف عناصر القائمة بناءً على الدور
  const menuItems = userRole === "company" ? [
    { path: "/company/dashboard", text: "Dashboard", icon: mainIcon },
    { path: "/company/add-job", text: "Add Job", icon: addJobIcon },
    {
      text: "Applicants",
      icon: applicantsIcon,
      isDropdown: true,
      dropdownName: "applicants",
      items: [
        { path: "/company/applicants/all", text: "All Applicants" },
        { path: "/company/applicants/new", text: "New" },
        { path: "/company/applicants/reviewed", text: "Reviewed" },
      ],
    },
    { path: "/company/settings", text: "Settings", icon: settingsIcon },
  ] : [
    { path: "/upload-resume", text: "Main", icon: mainIcon },
    { path: "/matches", text: "Matches", icon: matchesIcon },
    { path: "/jobs", text: "Jobs", icon: searchIcon },
    // تم التغيير هنا: تحويل "Applications" من قائمة منسدلة إلى رابط عادي
    { path: "/applications", text: "Applications", icon: applicationsIcon },
  ];

  return (
    <nav className="sidebar-menu">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-group">
          {item.isDropdown ? (
            <div className={`dropdown-container ${openDropdowns[item.dropdownName] ? "open" : ""}`}>
              <div 
                className={`menu-item dropdown-toggle ${isCollapsed ? "collapsed" : ""}`}
                onClick={() => toggleDropdown(item.dropdownName)}
              >
                <div className="menu-left">
                  <img src={item.icon} alt={item.text} className="menu-icon-img" />
                  {!isCollapsed && <span className="menu-text">{item.text}</span>}
                </div>
                {!isCollapsed && (
                  <img 
                    src={dropdownIcon} 
                    alt="arrow" 
                    className={`dropdown-arrow ${openDropdowns[item.dropdownName] ? "open" : ""}`} 
                  />
                )}
              </div>
              
              {!isCollapsed && openDropdowns[item.dropdownName] && (
                <div className="dropdown-menu">
                  {item.items.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) => `dropdown-item ${isActive ? "active" : ""}`}
                      onClick={handleItemClick}
                    >
                      {subItem.text}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // هذا الجزء يعالج الآن كلاً من الأزرار العادية والزر الجديد "Applications"
            <NavLink
              to={item.path}
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}
              onClick={handleItemClick}
            >
              <div className="menu-left">
                <img src={item.icon} alt={item.text} className="menu-icon-img" />
                {!isCollapsed && <span className="menu-text">{item.text}</span>}
              </div>
            </NavLink>
          )}
        </div>
      ))}
    </nav>
  );
}

export default SidebarMenu;