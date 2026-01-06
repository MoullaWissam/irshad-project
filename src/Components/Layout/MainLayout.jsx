// components/Layout/MainLayout.js
import React from "react";
import Sidebar from "../SideBar/Sidebar";
import "./MainLayout.css";

function MainLayout({ children, userRole }) {
  return (
    <div className="main-layout">
      <Sidebar userRole={userRole} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;