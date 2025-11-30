// components/SideBar/SidebarMenu.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./SidebarMenu.css";
import applicationsIcon from "../../assets/icons/applications.svg";
import searchIcon from "../../assets/icons/search.svg";
import settingsIcon from "../../assets/icons/settings.png";
import matchesIcon from "../../assets/icons/matches.svg";
import mainIcon from "../../assets/icons/home.svg";
function SidebarMenu({ isCollapsed, userRole = "jobSeeker" }) {
  // قوائم التنقل حسب الدور
  const menuConfig = {
    jobSeeker: [
      {
        path: "/matches",
        icon: matchesIcon,
        text: "Matches"
      },
      {
        path: "/jobs",
        icon: "/icons/jobs.svg",
        text: "Jobs"
      },
      {
        path: "/upload",
        icon: mainIcon,
        text: "Main"
      },
      {
        path: "/applications",
        icon: applicationsIcon,
        text: "Applications"
      }
    ],
    company: [
      {
        path: "/company/dashboard",
        icon: "/icons/dashboard.svg",
        text: "Dashboard"
      },
      {
        path: "/company/my-jobs",
        icon: "/icons/jobs.svg",
        text: "My Jobs"
      },
      {
        path: "/company/applicants",
        icon: "/icons/applicants.svg",
        text: "Applicants"
      },
      {
        path: "/company/post-job",
        icon: "/icons/post-job.svg",
        text: "Post New Job"
      }
    ]
  };

  const menuItems = menuConfig[userRole] || menuConfig.jobSeeker;

  return (
    <nav className="sidebar-menu">
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => 
            `menu-item ${isActive ? "active" : ""}`
          }
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
      ))}
    </nav>
  );
}

export default SidebarMenu;