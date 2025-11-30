import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/Layout/MainLayout";

/* ===== استيراد الصفحات ===== */
// 1. الصفحة الرئيسية
import HomePage from "./pages/home-page/HomePage";

// 2. صفحات المصادقة (Auth)
import RegisterPage from "./pages/auth/RegisterPage";
import LoginCard from "./pages/auth/LoginCard";
import ForgotPassword from "./pages/auth/SetNewPassword/ForgotPassword";
import CheckEmail from "./pages/auth/SetNewPassword/CheckEmail";
import SetNewPassword from "./pages/auth/SetNewPassword/SetNewPassword";
import Success from "./pages/auth/SetNewPassword/Success";

// 3. لوحات التحكم (Dashboards) - للباحث عن عمل
import MatchesPage from "./pages/job-seeker/MatchesPage";
import UploadResume from "./pages/job-seeker/UploadResume";
import JobsPage from "./pages/job-seeker/JobsPage";

// 4. لوحات التحكم (Dashboards) - للشركة (سيتم تفعيلها لاحقاً)
// import ApplicantsGrid from "./pages/company/ApplicantsGrid";
// import AddJobPage from "./pages/company/AddJobPage";

// 5. الإعدادات
import SettingsPage from "./pages/settings/SettingsPage";
import { settingsByRole } from "./pages/settings/settingsConfig";

function App() {
  // ⚡ تحديد دور المستخدم - يمكن تغييره لاحقاً
  const userRole = "jobSeeker"; // أو "company"

  return (
    <BrowserRouter>
      <Routes>
        {/* === الصفحة الرئيسية (بدون Sidebar) === */}
        <Route path="/" element={<HomePage />} />

        {/* === صفحات المصادقة (بدون Sidebar) === */}
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={
            <div className="auth-container">
              <LoginCard />
            </div>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/set-password" element={<SetNewPassword />} />
        <Route path="/success" element={<Success />} />

        {/* === جميع الصفحات الأخرى (مع Sidebar) === */}
        <Route path="/*" element={
          <MainLayout userRole={userRole}>
            <Routes>
              {/* مسارات الباحث عن عمل */}
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/upload" element={<UploadResume />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/applications" element={<div>Applications Page - Coming Soon</div>} />

              {/* مسارات الشركة - سيتم تفعيلها لاحقاً */}
              {/* <Route path="/company/dashboard" element={<ApplicantsGrid />} />
              <Route path="/company/my-jobs" element={<AddJobPage />} /> */}

              {/* الإعدادات */}
              <Route 
                path="/settings" 
                element={<SettingsPage settings={settingsByRole[userRole]} />} 
              />

              {/* الصفحة الافتراضية */}
              <Route path="/" element={<MatchesPage />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;