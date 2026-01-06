import React from "react";
import { useTranslation } from 'react-i18next';
import "./SidebarSearch.css";

import Search from "../../assets/icons/search.png";

function SidebarSearch({ isCollapsed }) {
  const { t } = useTranslation();

  return (
    <div className={`sidebar-search ${isCollapsed ? "collapsed" : ""}`}>
      <img src={Search} alt="Search" className="search-icon" />
      {!isCollapsed && <input type="text" placeholder={t("Search jobs...")} />}
    </div>
  );
}

export default SidebarSearch;