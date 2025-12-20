import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SidebarMenu.css";
import applicationsIcon from "../../assets/icons/applications.svg";
import searchIcon from "../../assets/icons/search.svg";
import settingsIcon from "../../assets/icons/settings.png";
import matchesIcon from "../../assets/icons/matches.svg";
import mainIcon from "../../assets/icons/home.svg";
import applicantsIcon from "../../assets/icons/applicants.svg";
import addJobIcon from "../../assets/icons/addjobs.svg";
import dashboardIcon from "../../assets/icons/whightlogo.svg";
import dropdownIcon from "../../assets/icons/dropdown.svg";

function SidebarMenu({ isCollapsed, userRole = "jobSeeker", onItemClick }) {
  const [openDropdowns, setOpenDropdowns] = useState({
    applications: false,
    applicants: false
  });

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({
      applications: false,
      applicants: false
    });
  };

  const handleItemClick = () => {
    closeAllDropdowns();
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleSubItemClick = () => {
    closeAllDropdowns();
    if (onItemClick) {
      onItemClick();
    }
  };

  const menuConfig = {
    jobSeeker: [
      {
        path: "/matches",
        icon: matchesIcon,
        text: "Matches",
      },
      {
        path: "/jobs",
        icon: searchIcon,
        text: "Jobs",
      },
      {
        path: "/upload",
        icon: mainIcon,
        text: "Main",
      },
      {
        type: "dropdown",
        text: "Applications",
        icon: applicationsIcon,
        dropdownName: "applications",
        items: [
          { path: "/applications/approved", text: "Approved" },
          { path: "/applications/pending", text: "Pending" },
          { path: "/applications/denied", text: "Denied" },
        ],
      },
    ],
    company: [
      {
        path: "/company/my-jobs",
        icon: addJobIcon,
        text: "My Jobs",
      },
      {
        type: "dropdown",
        text: "Applicants",
        icon: applicantsIcon,
        dropdownName: "applicants",
        items: [
          { path: "/company/applicants/all", text: "All Applicants" },
          { path: "/company/applicants/new", text: "New Applicants" },
          { path: "/company/applicants/reviewed", text: "Reviewed" },
        ],
      },
    ],
  };

  const menuItems = menuConfig[userRole] || menuConfig.jobSeeker;

  return (
    <nav className="sidebar-menu">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.type === "dropdown" ? (
            <div className="dropdown-container">
              <div
                className={`menu-item dropdown-toggle ${
                  openDropdowns[item.dropdownName] ? "active" : ""
                }`}
                onClick={() => toggleDropdown(item.dropdownName)}
              >
                <div className={`menu-left ${isCollapsed ? "collapsed" : ""}`}>
                  <img
                    src={item.icon}
                    alt={item.text}
                    className="menu-icon-img"
                  />
                  {!isCollapsed && (
                    <>
                      <span className="menu-text">{item.text}</span>
                      <img
                        src={dropdownIcon}
                        alt="Dropdown"
                        className={`dropdown-arrow ${
                          openDropdowns[item.dropdownName] ? "open" : ""
                        }`}
                      />
                    </>
                  )}
                </div>
              </div>

              {!isCollapsed && openDropdowns[item.dropdownName] && (
                <div className="dropdown-menu">
                  {item.items.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `dropdown-item ${isActive ? "active" : ""}`
                      }
                      onClick={handleSubItemClick}
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
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <div className={`menu-left ${isCollapsed ? "collapsed" : ""}`}>
                <img
                  src={item.icon}
                  alt={item.text}
                  className="menu-icon-img"
                />
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