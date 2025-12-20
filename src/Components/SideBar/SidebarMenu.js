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
    applications: false,
    applicants: false,
  });

  const toggleDropdown = (dropdownName) => {
    if (isCollapsed) return; // لا نفتح القائمة إذا كان السايدبار مغلقاً
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
    { path: "/matches", text: "Matches", icon: matchesIcon },
    { path: "/jobs", text: "Jobs", icon: searchIcon },
    { path: "/upload-resume", text: "Upload Resume", icon: mainIcon },
    {
      text: "Applications",
      icon: applicationsIcon,
      isDropdown: true,
      dropdownName: "applications",
      items: [
        { path: "/applications/pending", text: "Pending" },
        { path: "/applications/accepted", text: "Accepted" },
        { path: "/applications/rejected", text: "Rejected" },
      ],
    },
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