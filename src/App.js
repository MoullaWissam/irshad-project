import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

/* ===== استيراد الصفحات ===== */
// 1. الصفحة الرئيسية
import HomePage from "./pages/home-page/HomePage"; 

// 2. صفحات المصادقة (Auth)
import RegisterPage from "./pages/auth/RegisterPage";
import LoginCard from "./pages/auth/LoginCard"; // سنستخدم الكارد مباشرة كصفحة مؤقتاً
import ForgotPassword from "./pages/auth/SetNewPassword/ForgotPassword";
import CheckEmail from "./pages/auth/SetNewPassword/CheckEmail";
import SetNewPassword from "./pages/auth/SetNewPassword/SetNewPassword";
import Success from "./pages/auth/SetNewPassword/Success";

// 3. لوحات التحكم (Dashboards)
import ApplicantsGrid from "./pages/company/ApplicantsGrid"; // لوحة تحكم الشركة
import AddJobPage from "./pages/company/AddJobPage"; // إدارة الوظائف
import MatchesPage from "./pages/job-seeker/MatchesPage"; // لوحة تحكم الباحث عن عمل
import UploadResume from "./pages/job-seeker/UploadResume"; // صفحة رفع السيرة

// 4. الإعدادات
import SettingsPage from "./pages/settings/SettingsPage";
import { settingsByRole } from "./pages/settings/settingsConfig"; 

function App() {
  // ملاحظة: هذا المتغير يحدد أي إعدادات تظهر (مؤقتاً مثبت على company)
  const userRole = "company"; 
  const currentSettings = settingsByRole[userRole];

  return (
    <BrowserRouter>
      <Routes>
        {/* === الصفحة الرئيسية === */}
        <Route path="/" element={<HomePage />} />

        {/* === المصادقة === */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<div className="auth-container"><LoginCard /></div>} />
        
        {/* إعادة تعيين كلمة السر */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/set-password" element={<SetNewPassword />} />
        <Route path="/success" element={<Success />} />

        {/* === مسارات الشركة === */}
        <Route path="/company/dashboard" element={<ApplicantsGrid />} />
        <Route path="/company/my-jobs" element={<AddJobPage />} />

        {/* === مسارات الباحث عن عمل === */}
        <Route path="/jobseeker/matches" element={<MatchesPage />} />
        <Route path="/jobseeker/upload" element={<UploadResume />} />

        {/* === عام === */}
        <Route path="/settings" element={<SettingsPage settings={currentSettings} />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;