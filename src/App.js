
// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";

// // Import MainLayout
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

// // Job Seeker Pages
// import MatchesPage from "./pages/job-seeker/MatchesPage";
// import UploadResume from "./pages/job-seeker/UploadResume";
// import JobsPage from "./pages/job-seeker/JobsPage";

// // Company Pages
// import ApplicantsGrid from "./pages/company/ApplicantsGrid";
// import JobManagementPage from "./pages/company/JobManagementPage";

// // Settings Pages
// import SettingsPage from "./pages/settings/SettingsPage";
// import { settingsByRole } from "./pages/settings/settingsConfig";
// import AddCompanyForm from "./pages/company/AddCompanyForm";
// import AddJob from "./pages/company/AddJob/AddJob";

// // Create Auth Context
// const AuthContext = React.createContext();

// function App() {
//   const [userRole, setUserRole] = useState("jobSeeker");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [testMode, setTestMode] = useState(true); // Test mode enabled by default
//   const [showTestPanel, setShowTestPanel] = useState(true); // Show test panel by default

//   useEffect(() => {
//     // Check for login data when app loads
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
      
//       // Set role from user data if available
//       if (JSON.parse(userData).role) {
//         setUserRole(JSON.parse(userData).role);
//       }
//     }

//     // Focus detection code (for debugging)
//     document.addEventListener('click', (e) => {
//       console.log('Clicked element:', e.target);
//       console.log('Active element:', document.activeElement);
//       console.log('Focusable?', e.target.tabIndex);
//     });
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsAuthenticated(true);
//     setUser(userData);
//     if (userData.role) {
//       setUserRole(userData.role);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   // Protected Route Component
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated && !testMode) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   // Quick login for testing
//   const quickLogin = () => {
//     login({
//       id: 1,
//       name: userRole === "jobSeeker" ? "Michael Smith" : "Tech Solutions Inc.",
//       email: userRole === "jobSeeker" ? "michaelsmith12@gmail.com" : "contact@techsolutions.com",
//       role: userRole
//     }, "test-token-123");
//   };


//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//       <BrowserRouter>
//         {/* Test Control Panel - Floating on Left Side */}
//         {showTestPanel && (
//           <div className="test-control-panel">
//             <div className="test-header">
//               <span>🔧 Test Controls</span>
//               <button 
//                 className="close-panel-btn"
//                 onClick={() => setShowTestPanel(false)}
//                 title="Close panel"
//               >
//                 ×
//               </button>
//             </div>
            
//             <div className="test-controls">
//               {/* Role Toggle */}
//               <div className="control-group">
//                 <label>Current Role:</label>
//                 <div className="role-toggle">
//                   <button 
//                     className={`role-btn ${userRole === "jobSeeker" ? "active" : ""}`}
//                     onClick={() => setUserRole("jobSeeker")}
//                   >
//                     👤 Job Seeker
//                   </button>
//                   <button 
//                     className={`role-btn ${userRole === "company" ? "active" : ""}`}
//                     onClick={() => setUserRole("company")}
//                   >
//                     🏢 Company
//                   </button>
//                 </div>
//               </div>
              
//               {/* Test Mode Toggle */}
//               <div className="control-group">
//                 <label>Test Mode:</label>
//                 <div className="toggle-switch">
//                   <input 
//                     type="checkbox" 
//                     id="testModeToggle" 
//                     checked={testMode}
//                     onChange={() => setTestMode(!testMode)}
//                   />
//                   <label htmlFor="testModeToggle" className="toggle-slider">
//                     <span className="toggle-text">
//                       {testMode ? "ON" : "OFF"}
//                     </span>
//                   </label>
//                 </div>
//               </div>
              
//               {/* Quick Actions */}
//               <div className="control-group">
//                 <label>Quick Actions:</label>
//                 <div className="action-buttons">
//                   <button 
//                     className="action-btn login-btn"
//                     onClick={quickLogin}
//                   >
//                     🔑 Quick Login
//                   </button>
//                   <button 
//                     className="action-btn logout-btn"
//                     onClick={logout}
//                   >
//                     🚪 Logout
//                   </button>
//                 </div>
//               </div>
              
//               {/* Status Info */}
//               <div className="status-info">
//                 <div className="status-item">
//                   <span className="status-label">Auth Status:</span>
//                   <span className={`status-value ${isAuthenticated ? "authenticated" : "not-authenticated"}`}>
//                     {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
//                   </span>
//                 </div>
//                 <div className="status-item">
//                   <span className="status-label">Test Mode:</span>
//                   <span className={`status-value ${testMode ? "test-on" : "test-off"}`}>
//                     {testMode ? "🟢 Enabled" : "🔴 Disabled"}
//                   </span>
//                 </div>
//                 <div className="status-item">
//                   <span className="status-label">Current User:</span>
//                   <span className="status-value">
//                     {user ? user.name : "None"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Show Test Panel Button (when hidden) */}
//         {!showTestPanel && (
//           <button 
//             className="show-test-panel-btn"
//             onClick={() => setShowTestPanel(true)}
//             title="Show test controls"
//           >
//             ⚙️
//           </button>
//         )}


//         <Routes>
//           {/* Public Pages - Without Layout */}
//           <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
//           <Route path="/about" element={<AboutPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
//           <Route path="/services" element={<ServicesPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
//           <Route path="/contact" element={<ContactPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          
//           {/* Auth Pages - Without Layout */}
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/login" element={
//             <div className="auth-container">
//               <LoginCard login={login} />
//             </div>
//           } />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/check-email" element={<CheckEmail />} />
//           <Route path="/set-password" element={<SetNewPassword />} />
//           <Route path="/success" element={<Success />} />

//           {/* Protected Pages - With MainLayout (Job Seeker) */}
//           <Route path="/matches" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <MatchesPage userRole={userRole} isAuthenticated={isAuthenticated} user={user} logout={logout} />
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/upload" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <UploadResume isAuthenticated={isAuthenticated} user={user} logout={logout} />
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/jobs" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <JobsPage isAuthenticated={isAuthenticated} user={user} logout={logout} />
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           {/* Protected Pages - With MainLayout (Company) */}
//           <Route path="/company/dashboard" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <ApplicantsGrid isAuthenticated={isAuthenticated} user={user} logout={logout} />
//               </MainLayout>
//             </ProtectedRoute>
//           } />
//           <Route path="/company/AddJob" element={
//             <AddJob>
//               <MainLayout userRole={userRole}>
//                 <ApplicantsGrid isAuthenticated={isAuthenticated} user={user} logout={logout} />
//               </MainLayout>
//             </AddJob>
//           } />
          
//           <Route path="/company/my-jobs" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <JobManagementPage isAuthenticated={isAuthenticated} user={user} logout={logout} />
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           {/* Settings Page - With MainLayout */}
//           <Route path="/settings" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <SettingsPage 
//                   settings={settingsByRole[userRole]} 
//                   isAuthenticated={isAuthenticated} 
//                   user={user} 
//                   logout={logout} 
//                 />
//               </MainLayout>
//             </ProtectedRoute>
//           } />


//           {/* Applications Sub-pages (Job Seeker) - With MainLayout */}
//           <Route path="/applications/approved" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>Approved Applications</h1>
//                   <p>This page would show approved job applications.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/applications/pending" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>Pending Applications</h1>
//                   <p>This page would show pending job applications.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/applications/denied" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>Denied Applications</h1>
//                   <p>This page would show denied job applications.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           {/* Applicants Sub-pages (Company) - With MainLayout */}
//           <Route path="/company/applicants/all" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>All Applicants</h1>
//                   <p>This page would show all applicants for company jobs.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/company/applicants/new" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>New Applicants</h1>
//                   <p>This page would show new applicants.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/company/applicants/reviewed" element={
//             <ProtectedRoute>
//               <MainLayout userRole={userRole}>
//                 <div className="page-content">
//                   <h1>Reviewed Applicants</h1>
//                   <p>This page would show reviewed applicants.</p>
//                 </div>
//               </MainLayout>
//             </ProtectedRoute>
//           } />

//           {/* Company Settings Page */}
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
          
//           {/* Catch-all route - Redirect to home */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthContext.Provider>
//   );
// }

// export default App;









import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Import MainLayout
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

// Job Seeker Pages
import MatchesPage from "./pages/job-seeker/MatchesPage";
import UploadResume from "./pages/job-seeker/UploadResume";
import JobsPage from "./pages/job-seeker/JobsPage";
import JobDetails from "./pages/job-seeker/JobDetails"; // أضيف هذا الاستيراد

// Company Pages
import ApplicantsGrid from "./pages/company/ApplicantsGrid";
import JobManagementPage from "./pages/company/JobManagementPage";

// Settings Pages
import SettingsPage from "./pages/settings/SettingsPage";
import { settingsByRole } from "./pages/settings/settingsConfig";
import AddCompanyForm from "./pages/company/AddCompanyForm";
import AddJob from "./pages/company/AddJob/AddJob";

// Create Auth Context
const AuthContext = React.createContext();

function App() {
  const [userRole, setUserRole] = useState("jobSeeker");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [testMode, setTestMode] = useState(true); // Test mode enabled by default
  const [showTestPanel, setShowTestPanel] = useState(true); // Show test panel by default

  useEffect(() => {
    // Check for login data when app loads
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      
      // Set role from user data if available
      if (JSON.parse(userData).role) {
        setUserRole(JSON.parse(userData).role);
      }
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    if (userData.role) {
      setUserRole(userData.role);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated && !testMode) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Quick login for testing
  const quickLogin = () => {
    login({
      id: 1,
      name: userRole === "jobSeeker" ? "Michael Smith" : "Tech Solutions Inc.",
      email: userRole === "jobSeeker" ? "michaelsmith12@gmail.com" : "contact@techsolutions.com",
      role: userRole
    }, "test-token-123");
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <BrowserRouter>
        {/* Test Control Panel - Floating on Left Side */}
        {showTestPanel && (
          <div className="test-control-panel">
            <div className="test-header">
              <span>🔧 Test Controls</span>
              <button 
                className="close-panel-btn"
                onClick={() => setShowTestPanel(false)}
                title="Close panel"
              >
                ×
              </button>
            </div>
            
            <div className="test-controls">
              {/* Role Toggle */}
              <div className="control-group">
                <label>Current Role:</label>
                <div className="role-toggle">
                  <button 
                    className={`role-btn ${userRole === "jobSeeker" ? "active" : ""}`}
                    onClick={() => setUserRole("jobSeeker")}
                  >
                    👤 Job Seeker
                  </button>
                  <button 
                    className={`role-btn ${userRole === "company" ? "active" : ""}`}
                    onClick={() => setUserRole("company")}
                  >
                    🏢 Company
                  </button>
                </div>
              </div>
              
              {/* Test Mode Toggle */}
              <div className="control-group">
                <label>Test Mode:</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="testModeToggle" 
                    checked={testMode}
                    onChange={() => setTestMode(!testMode)}
                  />
                  <label htmlFor="testModeToggle" className="toggle-slider">
                    <span className="toggle-text">
                      {testMode ? "ON" : "OFF"}
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="control-group">
                <label>Quick Actions:</label>
                <div className="action-buttons">
                  <button 
                    className="action-btn login-btn"
                    onClick={quickLogin}
                  >
                    🔑 Quick Login
                  </button>
                  <button 
                    className="action-btn logout-btn"
                    onClick={logout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
              
              {/* Status Info */}
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Auth Status:</span>
                  <span className={`status-value ${isAuthenticated ? "authenticated" : "not-authenticated"}`}>
                    {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Test Mode:</span>
                  <span className={`status-value ${testMode ? "test-on" : "test-off"}`}>
                    {testMode ? "🟢 Enabled" : "🔴 Disabled"}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Current User:</span>
                  <span className="status-value">
                    {user ? user.name : "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Show Test Panel Button (when hidden) */}
        {!showTestPanel && (
          <button 
            className="show-test-panel-btn"
            onClick={() => setShowTestPanel(true)}
            title="Show test controls"
          >
            ⚙️
          </button>
        )}


        <Routes>
          {/* Public Pages - Without Layout */}
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          <Route path="/about" element={<AboutPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          <Route path="/services" element={<ServicesPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          <Route path="/contact" element={<ContactPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          
          {/* Auth Pages - Without Layout */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={
            <div className="auth-container">
              <LoginCard login={login} />
            </div>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/set-password" element={<SetNewPassword />} />
          <Route path="/success" element={<Success />} />

          {/* Job Details Page - NEW ROUTE */}
          <Route path="/job/:jobId" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <JobDetails />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Protected Pages - With MainLayout (Job Seeker) */}
          <Route path="/matches" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <MatchesPage userRole={userRole} isAuthenticated={isAuthenticated} user={user} logout={logout} />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <UploadResume isAuthenticated={isAuthenticated} user={user} logout={logout} />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/jobs" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <JobsPage isAuthenticated={isAuthenticated} user={user} logout={logout} />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Protected Pages - With MainLayout (Company) */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <ApplicantsGrid isAuthenticated={isAuthenticated} user={user} logout={logout} />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/AddJob" element={
            <AddJob>
              <MainLayout userRole={userRole}>
                <ApplicantsGrid isAuthenticated={isAuthenticated} user={user} logout={logout} />
              </MainLayout>
            </AddJob>
          } />
          
          <Route path="/company/my-jobs" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <JobManagementPage isAuthenticated={isAuthenticated} user={user} logout={logout} />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Settings Page - With MainLayout */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <SettingsPage 
                  settings={settingsByRole[userRole]} 
                  isAuthenticated={isAuthenticated} 
                  user={user} 
                  logout={logout} 
                />
              </MainLayout>
            </ProtectedRoute>
          } />


          {/* Applications Sub-pages (Job Seeker) - With MainLayout */}
          <Route path="/applications/approved" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>Approved Applications</h1>
                  <p>This page would show approved job applications.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/applications/pending" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>Pending Applications</h1>
                  <p>This page would show pending job applications.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/applications/denied" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>Denied Applications</h1>
                  <p>This page would show denied job applications.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Applicants Sub-pages (Company) - With MainLayout */}
          <Route path="/company/applicants/all" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>All Applicants</h1>
                  <p>This page would show all applicants for company jobs.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/company/applicants/new" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>New Applicants</h1>
                  <p>This page would show new applicants.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/company/applicants/reviewed" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>Reviewed Applicants</h1>
                  <p>This page would show reviewed applicants.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Company Settings Page */}
          <Route path="/company/settings" element={
            <ProtectedRoute>
              <MainLayout userRole={userRole}>
                <div className="page-content">
                  <h1>Company Settings</h1>
                  <p>This page would contain company-specific settings.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Catch-all route - Redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;