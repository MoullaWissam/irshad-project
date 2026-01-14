import React, {
  useEffect,
  useState,
  createContext,
  lazy,
  Suspense,
} from "react";
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
const ForgotPassword = lazy(() =>
  import("./pages/auth/SetNewPassword/ForgotPassword")
);
const CheckEmail = lazy(() => import("./pages/auth/SetNewPassword/CheckEmail"));
const SetNewPassword = lazy(() =>
  import("./pages/auth/SetNewPassword/SetNewPassword")
);
const Success = lazy(() => import("./pages/auth/SetNewPassword/Success"));
const VerfiyEmail = lazy(() =>
  import("./pages/auth/SetNewPassword/VerfiyEmail")
);
const MatchesPage = lazy(() => import("./pages/job-seeker/MatchesPage"));
const UploadResume = lazy(() => import("./pages/job-seeker/UploadResume"));
const JobsPage = lazy(() => import("./pages/job-seeker/JobsPage"));
const JobDetails = lazy(() => import("./pages/job-seeker/JobDetails"));
const QuickTest = lazy(() => import("./pages/job-seeker/QuickTest"));
const ApplicationSuccess = lazy(() =>
  import("./pages/job-seeker/ApplicationSuccess")
);
const MyApplications = lazy(() => import("./pages/job-seeker/MyApplications"));
const ApplicantsGrid = lazy(() => import("./pages/company/ApplicantsGrid"));
const JobManagementPage = lazy(() =>
  import("./pages/company/JobManagementPage")
);
const AddJob = lazy(() => import("./pages/company/AddJob/AddJob"));
const EditJob = lazy(() => import("./pages/company/EditJob"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const UserProfilePage = lazy(() => import("./pages/job-seeker/UserProfile"));
const UpdateUserProfilePage = lazy(() =>
  import("./pages/job-seeker/UpdateUserProfilePage")
);
const CompanyProfilePage = lazy(() =>
  import("./pages/company/CompanyProfilePage")
);
const UpdateCompanyProfilePage = lazy(() =>
  import("./pages/company/UpdateCompanyProfilePage")
);

// Loading Component
const PageLoading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}
  >
    <div style={{ textAlign: "center", color: "white" }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid rgba(255,255,255,0.3)",
          borderRadius: "50%",
          borderTopColor: "white",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px",
        }}
      ></div>
      <h3>جاري التحميل...</h3>
    </div>
  </div>
);

// Add CSS for spinner
const spinnerStyle = document.createElement("style");
spinnerStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  console.log("ProtectedRoute Check:", {
    isAuthenticated,
    userRole,
    requiredRole,
    path: window.location.pathname,
  });
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
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || "jobSeeker"
  );
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
            <Route
              path="/matches"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <MatchesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <JobsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/job/:jobId"
              element={
                <ProtectedRoute>
                  <MainLayout userRole={userRole}>
                    <JobDetails />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-resume"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <UploadResume />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/job/:jobId/test"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <QuickTest />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/job/:jobId/application-success"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <ApplicationSuccess />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* User Profile Pages (مع سايدبار) */}
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <UserProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile/edit"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <UpdateUserProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile/edit/:userId"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <UpdateUserProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* MyApplications Routes */}
            <Route
              path="/applications"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <MyApplications />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:status"
              element={
                <ProtectedRoute requiredRole="jobSeeker">
                  <MainLayout userRole="jobSeeker">
                    <MyApplications />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Company Routes (مع سايدبار) */}
            <Route
              path="/company/applicants"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/all"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/new"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/reviewed"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Company Profile Pages (مع سايدبار) */}
            <Route
              path="/company/profile"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <CompanyProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/profile/edit"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <UpdateCompanyProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/profile/edit/:id"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <UpdateCompanyProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Company Dashboard */}
            <Route
              path="/company/dashboard"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <div className="page-content">
                      <h1>لوحة تحكم الشركة</h1>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Add Job */}
            <Route
              path="/company/AddJob"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <AddJob />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/my-jobs"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <JobManagementPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/job/:jobId/edit"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <EditJob />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Job-specific applicant routes */}
            <Route
              path="/company/applicants/job/:jobId"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/job/:jobId/all"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/job/:jobId/sent"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/job/:jobId/rejected"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applicants/job/:jobId/scheduled"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <ApplicantsGrid />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Settings - General */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout userRole={userRole}>
                    <SettingsPage
                      userRole={userRole}
                      settings={settingsByRole[userRole]}
                    />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Company Settings */}
            <Route
              path="/company/settings"
              element={
                <ProtectedRoute requiredRole="company">
                  <MainLayout userRole="company">
                    <SettingsPage
                      userRole="company"
                      settings={settingsByRole.company}
                    />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </BrowserRouter>
      </Suspense>
    </AuthContext.Provider>
  );
}

export default App;
