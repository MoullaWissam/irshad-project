// import React, { useEffect, useState, createContext } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";

// // Import Layout
// import MainLayout from "./Components/Layout/MainLayout";

// // Public Pages
// import HomePage from "./pages/home-page/HomePage";
// import AboutPage from "./pages/home-page/AboutPage";
// import ServicesPage from "./pages/home-page/ServicesPage";
// import ContactPage from "./pages/home-page/ContactPage";

// // Auth Pages
// import RegisterPage from "./pages/auth/RegisterPage";
// import LoginCard from "./pages/auth/LoginCard";
// import ForgotPassword from "./pages/auth/SetNewPassword/ForgotPassword";
// import CheckEmail from "./pages/auth/SetNewPassword/CheckEmail";
// import SetNewPassword from "./pages/auth/SetNewPassword/SetNewPassword";
// import Success from "./pages/auth/SetNewPassword/Success";
// import VerfiyEmail from "./pages/auth/SetNewPassword/VerfiyEmail";

// // Job Seeker Pages
// import MatchesPage from "./pages/job-seeker/MatchesPage";
// import UploadResume from "./pages/job-seeker/UploadResume";
// import JobsPage from "./pages/job-seeker/JobsPage";
// import JobDetails from "./pages/job-seeker/JobDetails";
// import QuickTest from "./pages/job-seeker/QuickTest";
// import ApplicationSuccess from "./pages/job-seeker/ApplicationSuccess";
// import MyApplications from "./pages/job-seeker/MyApplications";

// // Company Pages
// import ApplicantsGrid from "./pages/company/ApplicantsGrid";
// import JobManagementPage from "./pages/company/JobManagementPage";
// import AddJob from "./pages/company/AddJob/AddJob";

// import SettingsPage from "./pages/settings/SettingsPage";
// import { settingsByRole } from "./pages/settings/settingsConfig";
// import EditJob from "./pages/company/EditJob";

// // Mock Protected Route Component (لأغراض العرض)
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = true; // يجب ربطها بنظام التحقق الخاص بك
//   return isAuthenticated ? children : <Navigate replace to="/login" />;
// };

// export const AuthContext = createContext();

// function App() {
//   const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "jobSeeker");

//   // تحديث الروول عند التغيير في localStorage
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const role = localStorage.getItem("userRole");
//       if (role) setUserRole(role);
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userRole, setUserRole }}>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes (بدون سايدبار) */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/login" element={<LoginCard />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/check-email" element={<CheckEmail />} />
//           <Route path="/set-new-password" element={<SetNewPassword />} />
//           <Route path="/success" element={<Success />} />
//           <Route path="/verfiy-email" element={<VerfiyEmail />} />

//           {/* Job Seeker Routes (مع سايدبار) */}
//           <Route path="/matches" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><MatchesPage /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/jobs" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><JobsPage /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/job/:jobId" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><JobDetails /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/upload-resume" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><UploadResume /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/job/:jobId/test" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><QuickTest /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="job/:jobId/application-success" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><ApplicationSuccess /></MainLayout>
//             </ProtectedRoute>
//           } />
          
//           {/* MyApplications Routes - التعديلات المهمة */}
//           <Route path="/applications" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><MyApplications /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/applications/:status" element={
//             <ProtectedRoute>
//               <MainLayout userRole="jobSeeker"><MyApplications /></MainLayout>
//             </ProtectedRoute>
//           } />

//           {/* Company Routes (مع سايدبار) */}
//           <Route path="/company/applicants/all" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/applicants/new" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/applicants/reviewed" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/settings" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company">
//                 <div className="page-content"><h1>Company Settings</h1></div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           {/* صفحة Dashboard للشركة (مضافة حديثاً) */}
//           <Route path="/company/dashboard" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company">
//                 <div className="page-content"><h1>Company Dashboard</h1></div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           {/* صفحة Add Job للشركة (مضافة حديثاً) */}
//           <Route path="/company/add-job" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company">
//                 <div className="page-content"><h1>Add New Job</h1></div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           {/* Protected Pages - With MainLayout (Company) */}
//           <Route path="/company/dashboard" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <ApplicantsGrid />
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/company/AddJob" element={
//             <AddJob>
//               <MainLayout userRole={userRole}>
//                 <ApplicantsGrid />
//               </MainLayout>
//             </AddJob>
//           } />
          
//           <Route path="/company/my-jobs" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <JobManagementPage  />
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           <Route path="/job/:jobId/edit" element={<EditJob />} />
          
//            {/* المسارات الجديدة للوظائف المحددة */}
//           <Route path="/company/applicants/job/:jobId/all" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/applicants/job/:jobId" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/applicants/job/:jobId/sent" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/applicants/job/:jobId/rejected" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/applicants/job/:jobId/scheduled" element={
//             <ProtectedRoute>
//               <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
//             </ProtectedRoute>
//           } />

//           <Route path="/settings" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <SettingsPage 
//                   settings={settingsByRole[userRole]} 
//                 />
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           <Route path="/company/settings" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>Company Settings</h1>
//                   <p>This page would contain company-specific settings.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//         </Routes>
//       </BrowserRouter>
//      </AuthContext.Provider>
//   );
// }

// export default App;

// src/App.js
import React, { useEffect, useState, createContext, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Import Layout
import MainLayout from "./Components/Layout/MainLayout";

// Import settings config
import { settingsByRole } from "./pages/settings/settingsConfig";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/home-page/HomePage"));
const AboutPage = lazy(() => import("./pages/home-page/AboutPage"));
const ServicesPage = lazy(() => import("./pages/home-page/ServicesPage"));
const ContactPage = lazy(() => import("./pages/home-page/ContactPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const LoginCard = lazy(() => import("./pages/auth/LoginCard"));
const ForgotPassword = lazy(() => import("./pages/auth/SetNewPassword/ForgotPassword"));
const CheckEmail = lazy(() => import("./pages/auth/SetNewPassword/CheckEmail"));
const SetNewPassword = lazy(() => import("./pages/auth/SetNewPassword/SetNewPassword"));
const Success = lazy(() => import("./pages/auth/SetNewPassword/Success"));
const VerfiyEmail = lazy(() => import("./pages/auth/SetNewPassword/VerfiyEmail"));
const MatchesPage = lazy(() => import("./pages/job-seeker/MatchesPage"));
const UploadResume = lazy(() => import("./pages/job-seeker/UploadResume"));
const JobsPage = lazy(() => import("./pages/job-seeker/JobsPage"));
const JobDetails = lazy(() => import("./pages/job-seeker/JobDetails"));
const QuickTest = lazy(() => import("./pages/job-seeker/QuickTest"));
const ApplicationSuccess = lazy(() => import("./pages/job-seeker/ApplicationSuccess"));
const MyApplications = lazy(() => import("./pages/job-seeker/MyApplications"));
const ApplicantsGrid = lazy(() => import("./pages/company/ApplicantsGrid"));
const JobManagementPage = lazy(() => import("./pages/company/JobManagementPage"));
const AddJob = lazy(() => import("./pages/company/AddJob/AddJob"));
const EditJob = lazy(() => import("./pages/company/EditJob"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));

// Loading component for Suspense
const PageLoading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <div style={{ textAlign: 'center', color: 'white' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid rgba(255,255,255,0.3)',
        borderRadius: '50%',
        borderTopColor: 'white',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <h3>جاري التحميل...</h3>
    </div>
  </div>
);

// Add CSS for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

// Mock Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  
  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate replace to="/" />;
  }
  
  return children;
};

export const AuthContext = createContext();

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "jobSeeker");
  const [isLoading, setIsLoading] = useState(false);

  // تحديث الروول عند التغيير في localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const role = localStorage.getItem("userRole");
      if (role) setUserRole(role);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // معالجة تغيير الدور
  const handleRoleChange = (newRole) => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("userRole", newRole);
      setUserRole(newRole);
      setIsLoading(false);
    }, 300);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <AuthContext.Provider value={{ userRole, setUserRole: handleRoleChange }}>
      <Suspense fallback={<PageLoading />}>
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
            <Route path="/verfiy-email" element={<VerfiyEmail />} />

            {/* Job Seeker Routes (مع سايدبار) */}
            <Route path="/matches" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><MatchesPage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><JobsPage /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/job/:jobId" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><JobDetails /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/upload-resume" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><UploadResume /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/job/:jobId/test" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><QuickTest /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/job/:jobId/application-success" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><ApplicationSuccess /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* MyApplications Routes */}
            <Route path="/applications" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><MyApplications /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/applications/:status" element={
              <ProtectedRoute requiredRole="jobSeeker">
                <MainLayout userRole="jobSeeker"><MyApplications /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Company Routes (مع سايدبار) */}
            <Route path="/company/applicants" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/all" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/new" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/reviewed" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Company Dashboard */}
            <Route path="/company/dashboard" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company">
                  <div className="page-content">
                    <h1>لوحة تحكم الشركة</h1>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Add Job */}
            <Route path="/company/add-job" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><AddJob /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/company/my-jobs" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><JobManagementPage /></MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/job/:jobId/edit" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><EditJob /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Job-specific applicant routes */}
            <Route path="/company/applicants/job/:jobId" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/job/:jobId/all" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/job/:jobId/sent" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/job/:jobId/rejected" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/company/applicants/job/:jobId/scheduled" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company"><ApplicantsGrid /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Settings - General */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout userRole={userRole}>
                  <SettingsPage settings={settingsByRole[userRole]} />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Company Settings */}
            <Route path="/company/settings" element={
              <ProtectedRoute requiredRole="company">
                <MainLayout userRole="company">
                  <SettingsPage settings={settingsByRole.company} />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </AuthContext.Provider>
  );
}

export default App;