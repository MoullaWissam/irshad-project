import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
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
  const { t } = useTranslation();
  const [openDropdowns, setOpenDropdowns] = useState({
    applicants: false,
  });
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole === "company") {
      fetchCompanyJobs();
    }
  }, [userRole]);

  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const companyData = localStorage.getItem("companyData");

      const company = JSON.parse(companyData);

      const companyId = company.id;

      console.log(companyId); 

      console.log("Fetching jobs for company ID:", companyId);
      
      const response = await fetch(
        `http://localhost:3000/company-management/${companyId}/jobs`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials:"include"
        }
      );
      const responseData = await response.json();
      console.log("Jobs API response:", responseData);
      setCompanyJobs(responseData);
      toast.success(`Loaded ${responseData.length} jobs`);
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      if (error.response) {
        console.error("Response data:", error.responseData);
        console.error("Response status:", error.responseData.status);
        toast.error(`Failed to load jobs: ${error.responseData.message || 'Server error'}`);
      } else {
        toast.error("Failed to load jobs. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const menuItems = userRole === "company" ? [
    { path: "/company/my-jobs", text: t("Add Job"), icon: addJobIcon },
    {
      text: t("Applicants"),
      icon: applicantsIcon,
      isDropdown: true,
      dropdownName: "applicants",
      items: loading ? 
        [{ path: "#", text: t("Loading...") }] :
        companyJobs.map(job => ({
          path: `/company/applicants/job/${job.id}`,
          text: job.title,
          jobId: job.id
        }))
    },
  ] : [
    { path: "/upload-resume", text: t("Main"), icon: mainIcon },
    { path: "/matches", text: t("Matches"), icon: matchesIcon },
    { path: "/jobs", text: t("Jobs"), icon: searchIcon },
    { path: "/applications", text: t("Applications"), icon: applicationsIcon },
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
                      onClick={() => {
                        handleItemClick();
                        localStorage.setItem(`job_${subItem.jobId}`, JSON.stringify(
                          companyJobs.find(j => j.id === subItem.jobId)
                        ));
                      }}
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