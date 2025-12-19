import React from "react";
import { useNavigate } from "react-router-dom";
import "./SidebarFooter.css";

import iconSettings from "../../assets/icons/settings.png";
import iconLogout from "../../assets/icons/logout.png";

function SidebarFooter({ isCollapsed, userRole = "jobSeeker", onClickInside }) {
  const navigate = useNavigate();

  // جلب بيانات المستخدم من localStorage
  const getUserDataFromStorage = () => {
    try {
      if (userRole === "company") {
        const companyDataString = localStorage.getItem("companyData");
        if (companyDataString) {
          const companyData = JSON.parse(companyDataString);
          return {
            type: "company",
            data: companyData
          };
        }
      } else {
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          return {
            type: "user",
            data: userData
          };
        }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return null;
  };

  const storedData = getUserDataFromStorage();
  
  // بيانات افتراضية في حالة عدم وجود بيانات في localStorage
  const defaultUserData = {
    jobSeeker: {
      name: "Michael Smith",
      email: "michaelsmith12@gmail.com",
      avatar: "/user.png",
      roleDisplay: "Job Seeker"
    },
    company: {
      name: "Tech Solutions Inc.",
      email: "contact@techsolutions.com",
      avatar: "/company-avatar.png",
      roleDisplay: "Company"
    }
  };

  // تحديد البيانات التي ستستخدم بناءً على ما في localStorage أو الافتراضي
  let user;
  let roleDisplayText;
  
  if (storedData) {
    if (storedData.type === "company") {
      // استخدام بيانات الشركة من localStorage
      const companyData = storedData.data;
      
      // بناء مسار الصورة بشكل صحيح
      let avatarPath = "/company-avatar.png"; // القيمة الافتراضية
      
      if (companyData.companyLogo) {
        // إذا كان المسار يحتوي على uploads/، أضف المسار الأساسي للخادم
        if (companyData.companyLogo.includes("uploads/")) {
          // تعديل المسار ليكون نسبياً للخادم
          avatarPath = `http://localhost:3000/${companyData.companyLogo}`;
          console.log(avatarPath);
          
        } else {
          avatarPath = companyData.companyLogo;
        }
      }
      
      user = {
        name: companyData.companyName || "Company",
        email: companyData.email || "",
        avatar: avatarPath
      };
      
      roleDisplayText = "Company";
    } else {
      // استخدام بيانات المستخدم العادي من localStorage
      const userData = storedData.data;
      
      // بناء مسار الصورة بشكل صحيح للمستخدم
      let avatarPath = "/user.png"; // القيمة الافتراضية
      
      if (userData.profileImage) {
        // إذا كان المسار يحتوي على uploads/، أضف المسار الأساسي للخادم
        if (userData.profileImage.includes("uploads/")) {
          avatarPath = `http://localhost:3000/${userData.profileImage}`;
        } else {
          avatarPath = userData.profileImage;
        }
      }
      
      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      user = {
        name: fullName || "User",
        email: userData.email || "",
        avatar: avatarPath
      };
      roleDisplayText = "Job Seeker";
    }
  } else {
    // استخدام البيانات الافتراضية
    user = defaultUserData[userRole] || defaultUserData.jobSeeker;
    roleDisplayText = userRole === "company" ? "Company" : "Job Seeker";
  }

  const handleLogout = (e) => {
    e.stopPropagation();
    console.log("Logging out...");
    
    // حذف جميع البيانات من localStorage
    localStorage.removeItem("userData");
    localStorage.removeItem("companyData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
    
    // توجيه المستخدم إلى الصفحة الرئيسية
    window.location.href = "http://localhost:3001/";
  };

  const handleSettings = (e) => {
    e.stopPropagation();
    // توجه إلى إعدادات الشركة أو الباحث عن عمل باستخدام navigate
    const settingsPath = userRole === "company" ? "/company/settings" : "/settings";
    navigate(settingsPath);
  };

  const handleImageError = (e) => {
    // استبدال الصورة المعطوبة بصورة افتراضية
    e.target.onerror = null; // منع تكرار الحدث
    e.target.src = userRole === "company" ? "/company-avatar.png" : "/user.png";
  };

  return (
    <div className="sidebar-footer" onClick={onClickInside}>
      
      {/* Settings */}
      <div
        className={`footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleSettings}
      >
        <img src={iconSettings} alt="Settings" className="menu-icon-img" />
        {!isCollapsed && <span className="footer-text">
          {userRole === "company" ? "Company Settings" : "Settings"}
        </span>}
      </div>

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
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={user.avatar} 
          alt="User" 
          className="user-avatar"
          onError={handleImageError}
        />
        {!isCollapsed && (
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
            <span className={`status-dot ${userRole === "company" ? "active" : "active"}`}>
              {roleDisplayText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarFooter;