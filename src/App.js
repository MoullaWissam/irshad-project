import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Import Layout
import MainLayout from "./Components/Layout/MainLayout";

// Public Pages
import HomePage from "./pages/home-page/HomePage";
import AboutPage from "./pages/home-page/AboutPage";
import ServicesPage from "./pages/home-page/ServicesPage";
import ContactPage from "./pages/home-page/ContactPage";

// Auth Pages
import RegisterPage from "./pages/auth/RegisterPage";
import LoginCard from "./pages/auth/LoginCard";
import ForgotPassword from "./pages/auth/SetNewPassword/ForgotPassword";
import CheckEmail from "./pages/auth/SetNewPassword/CheckEmail";
import SetNewPassword from "./pages/auth/SetNewPassword/SetNewPassword";
import Success from "./pages/auth/SetNewPassword/Success";
import VerfiyEmail from "./pages/auth/SetNewPassword/VerfiyEmail";

// Job Seeker Pages
import MatchesPage from "./pages/job-seeker/MatchesPage";
import UploadResume from "./pages/job-seeker/UploadResume";
import JobsPage from "./pages/job-seeker/JobsPage";
import JobDetails from "./pages/job-seeker/JobDetails";
import QuickTest from "./pages/job-seeker/QuickTest";
import ApplicationSuccess from "./pages/job-seeker/ApplicationSuccess";
import MyApplications from "./pages/job-seeker/MyApplications";

// Company Pages
import ApplicantsGrid from "./pages/company/ApplicantsGrid";

// Mock Protected Route Component (لأغراض العرض)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // يجب ربطها بنظام التحقق الخاص بك
  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

export const AuthContext = createContext();

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "jobSeeker");

  // تحديث الروول عند التغيير في localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const role = localStorage.getItem("userRole");
      if (role) setUserRole(role);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    // <AuthContext.Provider value={{ userRole, setUserRole }}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (بدون سايدبار) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/success" element={<Success />} />
          <Route path="/verify-email" element={<VerfiyEmail />} />

          {/* Job Seeker Routes (مع سايدبار) */}
          <Route path="/matches" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><MatchesPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><JobsPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/job/:jobId" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><JobDetails /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/upload-resume" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><UploadResume /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/test/:jobId" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><QuickTest /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/application-success/:jobId" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><ApplicationSuccess /></MainLayout>
            </ProtectedRoute>
          } />
          
          {/* MyApplications Routes - التعديلات المهمة */}
          <Route path="/applications" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><MyApplications /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/applications/:status" element={
            <ProtectedRoute>
              <MainLayout userRole="jobSeeker"><MyApplications /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Company Routes (مع سايدبار) */}
          <Route path="/company/applicants/all" element={
            <ProtectedRoute>
              <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/applicants/new" element={
            <ProtectedRoute>
              <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/applicants/reviewed" element={
            <ProtectedRoute>
              <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/settings" element={
            <ProtectedRoute>
              <MainLayout userRole="company">
                <div className="page-content"><h1>Company Settings</h1></div>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* صفحة Dashboard للشركة (مضافة حديثاً) */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute>
              <MainLayout userRole="company">
                <div className="page-content"><h1>Company Dashboard</h1></div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* صفحة Add Job للشركة (مضافة حديثاً) */}
          <Route path="/company/add-job" element={
            <ProtectedRoute>
              <MainLayout userRole="company">
                <div className="page-content"><h1>Add New Job</h1></div>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* إعادة التوجيه لجميع المسارات غير المعرفة */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    // </AuthContext.Provider>
  );
}

export default App;