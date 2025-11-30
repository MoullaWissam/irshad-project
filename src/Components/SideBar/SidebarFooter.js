// // components/SideBar/SidebarFooter.js
// import React from "react";
// import "./SidebarFooter.css";
// import "./Sidebar.css";
// import iconSettings from "../../assets/icons/settings.png";
// import iconLogout from "../../assets/icons/logout.png";

// function SidebarFooter({ isCollapsed, userRole = "jobSeeker" }) {
//   // بيانات المستخدم حسب الدور
//   const userData = {
//     jobSeeker: {
//       name: "Michael Smith",
//       email: "michaelsmith12@gmail.com",
//       avatar: "/user.png",
//     },
//     company: {
//       name: "Tech Solutions Inc.",
//       email: "contact@techsolutions.com", 
//       avatar: "/company-avatar.png",
//     }
//   };

//   const user = userData[userRole] || userData.jobSeeker;

//   const handleLogout = () => {
//     console.log("Logging out...");
//     // logic تسجيل الخروج
//   };

//   return (
//     <div className="sidebar-footer">
      
//       {/* Settings */}
//       <a
//         href="/settings"
//         className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
//       >
//         <img src={iconSettings} alt="Settings" className="menu-icon-img" />
//         {!isCollapsed && <span className="footer-text">Settings</span>}
//       </a>

//       {/* Logout */}
//       <div
//         className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
//         onClick={handleLogout}
//       >
//         <img src={iconLogout} alt="Logout" className="menu-icon-img" />
//         {!isCollapsed && <span className="footer-text">Logout</span>}
//       </div>

//       {/* User info */}
//       <div className={`user-info ${isCollapsed ? "collapsed" : ""}`}>
//         <img src={user.avatar} alt="User" className="user-avatar" />
//         {!isCollapsed && (
//           <div className="user-details">
//             <p className="user-name">{user.name}</p>
//             <p className="user-email">{user.email}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SidebarFooter;
// components/SideBar/SidebarFooter.js
import React from "react";
import "./SidebarFooter.css";

import iconSettings from "../../assets/icons/settings.png";
import iconLogout from "../../assets/icons/logout.png";

function SidebarFooter({ isCollapsed, userRole = "jobSeeker", onClickInside }) {
  // بيانات المستخدم حسب الدور
  const userData = {
    jobSeeker: {
      name: "Michael Smith",
      email: "michaelsmith12@gmail.com",
      avatar: "/user.png",
    },
    company: {
      name: "Tech Solutions Inc.",
      email: "contact@techsolutions.com",
      avatar: "/company-avatar.png",
    }
  };

  const user = userData[userRole] || userData.jobSeeker;

  const handleLogout = (e) => {
    e.stopPropagation(); // منع collapse
    console.log("Logging out...");
  };

  return (
    <div className="sidebar-footer" onClick={onClickInside}>
      
      {/* Settings */}
      <a
        href="/settings"
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={(e) => e.stopPropagation()} // منع collapse عند الضغط
      >
        <img src={iconSettings} alt="Settings" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">Settings</span>}
      </a>

      {/* Logout */}
      <div
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleLogout}
      >
        <img src={iconLogout} alt="Logout" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">Logout</span>}
      </div>

      {/* User info */}
      <div
        className={`user-info ${isCollapsed ? "collapsed" : ""}`}
        onClick={(e) => e.stopPropagation()} // منع collapse
      >
        <img src={user.avatar} alt="User" className="user-avatar" />
        {!isCollapsed && (
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarFooter;
