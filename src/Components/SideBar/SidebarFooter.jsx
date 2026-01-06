import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import "./SidebarFooter.css";

import iconSettings from "../../assets/icons/settings.png";
import iconLogout from "../../assets/icons/logout.png";
import defaultUserIcon from "../../assets/icons/profile .png";

function SidebarFooter({ isCollapsed, userRole = "jobSeeker", onClickInside }) {
  const { t } = useTranslation();
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
      avatar: defaultUserIcon,
      roleDisplay: t("Job Seeker"),
      hasAvatar: false
    },
    company: {
      name: "Tech Solutions Inc.",
      email: "contact@techsolutions.com",
      avatar: defaultUserIcon,
      roleDisplay: t("Company"),
      hasAvatar: false
    }
  };

  // تحديد البيانات التي ستستخدم بناءً على ما في localStorage أو الافتراضي
  let user;
  let roleDisplayText;
  let hasAvatar = false;
  
  if (storedData) {
    if (storedData.type === "company") {
      // استخدام بيانات الشركة من localStorage
      const companyData = storedData.data;
      
      // بناء مسار الصورة بشكل صحيح
      let avatarPath = defaultUserIcon; // القيمة الافتراضية
      
      if (companyData.companyLogo && companyData.companyLogo.trim() !== "") {
        // إذا كان المسار يحتوي على uploads/، أضف المسار الأساسي للخادم
        if (companyData.companyLogo.includes("uploads/")) {
          // تعديل المسار ليكون نسبياً للخادم
          avatarPath = `http://localhost:3000/${companyData.companyLogo}`;
          hasAvatar = true;
        } else {
          avatarPath = companyData.companyLogo;
          hasAvatar = true;
        }
      }
      
      user = {
        name: companyData.companyName || "Company",
        email: companyData.email || "",
        avatar: avatarPath,
        hasAvatar: hasAvatar
      };
      
      roleDisplayText = t("Company");
    } else {
      // استخدام بيانات المستخدم العادي من localStorage
      const userData = storedData.data;
      
      // بناء مسار الصورة بشكل صحيح للمستخدم
      let avatarPath = defaultUserIcon; // القيمة الافتراضية
      
      if (userData.profileImage && userData.profileImage.trim() !== "") {
        // إذا كان المسار يحتوي على uploads/، أضف المسار الأساسي للخادم
        if (userData.profileImage.includes("uploads/")) {
          avatarPath = `http://localhost:3000/${userData.profileImage}`;
          hasAvatar = true;
        } else {
          avatarPath = userData.profileImage;
          hasAvatar = true;
        }
      }
      
      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      user = {
        name: fullName || "User",
        email: userData.email || "",
        avatar: avatarPath,
        hasAvatar: hasAvatar
      };
      roleDisplayText = t("Job Seeker");
    }
  } else {
    // استخدام البيانات الافتراضية
    user = defaultUserData[userRole] || defaultUserData.jobSeeker;
    roleDisplayText = userRole === "company" ? t("Company") : t("Job Seeker");
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
    e.target.src = defaultUserIcon;
    e.target.classList.add("default-avatar");
    user.hasAvatar = false;
  };

  const handleImageLoad = (e) => {
    // إذا تم تحميل الصورة بنجاح، تأكد من إزالة كلاس الصورة الافتراضية
    if (user.hasAvatar) {
      e.target.classList.remove("default-avatar");
    }
  };

  return (
    <div className="sidebar-footer-container" onClick={onClickInside}>
      
      {/* Settings */}
      <div
        className={`sidebar-footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleSettings}
      >
        <img src={iconSettings} alt="Settings" className="sidebar-footer-icon" />
        {!isCollapsed && <span className="sidebar-footer-text">
          {userRole === "company" ? t("Company Settings") : t("Settings")}
        </span>}
      </div>

      {/* Logout */}
      <div
        className={`sidebar-footer-item ${isCollapsed ? "collapsed" : ""}`}
        onClick={handleLogout}
      >
        <img src={iconLogout} alt="Logout" className="sidebar-footer-icon" />
        {!isCollapsed && <span className="sidebar-footer-text">{t("Logout")}</span>}
      </div>

      {/* User info */}
      <div
        className={`sidebar-footer-user-info ${isCollapsed ? "collapsed" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`sidebar-footer-avatar-container ${!user.hasAvatar ? 'has-default-avatar' : ''}`}>
          <img 
            src={user.avatar} 
            alt="User" 
            className={`sidebar-footer-avatar ${!user.hasAvatar ? 'default-avatar' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          {isCollapsed && (
            <span className={`sidebar-footer-status-dot ${userRole === "company" ? "active" : "active"}`}></span>
          )}
        </div>
        {!isCollapsed && (
          <div className="sidebar-footer-details">
            <p className="sidebar-footer-name">{user.name}</p>
            <p className="sidebar-footer-email">{user.email}</p>
            <span className={`sidebar-footer-status ${userRole === "company" ? "active" : "active"}`}>
              {roleDisplayText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarFooter;