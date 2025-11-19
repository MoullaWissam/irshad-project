import React from "react";
import "./SidebarSearch.css";

import Search from "../icons/search.png";

function SidebarSearch({ isCollapsed }) {
  return (
    <div className={`sidebar-search ${isCollapsed ? "collapsed" : ""}`}>
      <img src={Search} alt="Search" className="search-icon" />
      {!isCollapsed && <input type="text" placeholder="Search jobs..." />}
    </div>
  );
}

export default SidebarSearch;
