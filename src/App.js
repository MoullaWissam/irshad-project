// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";

// import HomePage from "./pages/home-page/HomePage";
// import AboutPage from "./pages/home-page/AboutPage";
// import ServicesPage from "./pages/home-page/ServicesPage";
// import ContactPage from "./pages/home-page/ContactPage";

// import RegisterPage from "./pages/auth/RegisterPage";
// import LoginCard from "./pages/auth/LoginCard";
// import ForgotPassword from "./pages/auth/SetNewPassword/ForgotPassword";
// import CheckEmail from "./pages/auth/SetNewPassword/CheckEmail";
// import SetNewPassword from "./pages/auth/SetNewPassword/SetNewPassword";
// import Success from "./pages/auth/SetNewPassword/Success";

// import MatchesPage from "./pages/job-seeker/MatchesPage";
// import UploadResume from "./pages/job-seeker/UploadResume";
// import JobsPage from "./pages/job-seeker/JobsPage";

// import ApplicantsGrid from "./pages/company/ApplicantsGrid";
// import AddJobPage from "./pages/company/AddJobPage";

// import SettingsPage from "./pages/settings/SettingsPage";
// import { settingsByRole } from "./pages/settings/settingsConfig";

// // إنشاء Auth Context مبسط
// const AuthContext = React.createContext();

// function App() {
//   const [userRole, setUserRole] = useState("jobSeeker");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // تحقق من وجود بيانات تسجيل الدخول عند تحميل التطبيق
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//     }

//     // كود للكشف عن التركيز
//     document.addEventListener('click', (e) => {
//       console.log('العنصر المضغوط:', e.target);
//       console.log('العنصر النشط:', document.activeElement);
//       console.log('هل قابل للتركيز?', e.target.tabIndex);
//     });
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsAuthenticated(true);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   // مكون حارس للمسارات المحمية
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//       <BrowserRouter>
//         <div style={{
//           position: 'fixed',
//           top: '10px',
//           right: '10px',
//           zIndex: 10000,
//           background: '#723dff',
//           color: 'white',
//           padding: '10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }} onClick={() => setUserRole(userRole === "jobSeeker" ? "company" : "jobSeeker")}>
//           تبديل إلى: {userRole === "jobSeeker" ? "الشركة" : "الباحث عن عمل"}
//         </div>
        
//         <Routes>
//           {/* الصفحات العامة */}
//           <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
//           <Route path="/about" element={<AboutPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
//           <Route path="/services" element={<ServicesPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
//           <Route path="/contact" element={<ContactPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          
//           {/* صفحات المصادقة */}
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

//           {/* الصفحات المحمية */}
//           <Route path="/matches" element={
//             <ProtectedRoute>
//               <MatchesPage userRole={userRole} isAuthenticated={isAuthenticated} user={user} logout={logout} />
//             </ProtectedRoute>
//           } />
//           <Route path="/upload" element={
//             <ProtectedRoute>
//               <UploadResume isAuthenticated={isAuthenticated} user={user} logout={logout} />
//             </ProtectedRoute>
//           } />
//           <Route path="/jobs" element={
//             <ProtectedRoute>
//               <JobsPage isAuthenticated={isAuthenticated} user={user} logout={logout} />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/company/dashboard" element={
//             <ProtectedRoute>
//               <ApplicantsGrid isAuthenticated={isAuthenticated} user={user} logout={logout} />
//             </ProtectedRoute>
//           } />
//           <Route path="/company/my-jobs" element={
//             <ProtectedRoute>
//               <AddJobPage isAuthenticated={isAuthenticated} user={user} logout={logout} />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/settings" element={
//             <ProtectedRoute>
//               <SettingsPage 
//                 settings={settingsByRole[userRole]} 
//                 isAuthenticated={isAuthenticated} 
//                 user={user} 
//                 logout={logout} 
//               />
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </BrowserRouter>
//     </AuthContext.Provider>
//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/home-page/HomePage";
import AboutPage from "./pages/home-page/AboutPage";
import ServicesPage from "./pages/home-page/ServicesPage";
import ContactPage from "./pages/home-page/ContactPage";

import RegisterPage from "./pages/auth/RegisterPage";
import LoginCard from "./pages/auth/LoginCard";
import ForgotPassword from "./pages/auth/SetNewPassword/ForgotPassword";
import CheckEmail from "./pages/auth/SetNewPassword/CheckEmail";
import SetNewPassword from "./pages/auth/SetNewPassword/SetNewPassword";
import Success from "./pages/auth/SetNewPassword/Success";

// 3. لوحات التحكم (Dashboards)
import ApplicantsGrid from "./pages/company/ApplicantsGrid"; // لوحة تحكم الشركة
import AddJobPage from "./pages/company/AddJobPage"; // إدارة الوظائف
import MatchesPage from "./pages/job-seeker/MatchesPage"; // لوحة تحكم الباحث عن عمل
import UploadResume from "./pages/job-seeker/UploadResume"; // صفحة رفع السيرة
import AddJob from "./pages/company/AddJob/AddJobPage";

// 4. الإعدادات
import SettingsPage from "./pages/settings/SettingsPage";
import { settingsByRole } from "./pages/settings/settingsConfig";

// إنشاء Auth Context مبسط
const AuthContext = React.createContext();

function App() {
  const [userRole, setUserRole] = useState("jobSeeker");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [testMode, setTestMode] = useState(true); // أضف وضع الاختبار

  useEffect(() => {
    // تحقق من وجود بيانات تسجيل الدخول عند تحميل التطبيق
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    // كود للكشف عن التركيز
    document.addEventListener('click', (e) => {
      console.log('العنصر المضغوط:', e.target);
      console.log('العنصر النشط:', document.activeElement);
      console.log('هل قابل للتركيز?', e.target.tabIndex);
    });
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // مكون حارس للمسارات المحمية - معدل ليسمح بالوصول في وضع الاختبار
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated && !testMode) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <BrowserRouter>
        {/* زر التبديل في الجانب الأيسر الآن */}
        {/* <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          position: 'fixed',
          top: '10px',
          left: '10px', // تغيير من right إلى left
          zIndex: 10000,
          background: '#723dff',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          minWidth: '180px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <div 
            onClick={() => setUserRole(userRole === "jobSeeker" ? "company" : "jobSeeker")}
            style={{
              padding: '8px 12px',
              background: '#5a2ed6',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4a25b5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#5a2ed6'}
          >
            تبديل إلى: {userRole === "jobSeeker" ? "الشركة" : "الباحث عن عمل"}
          </div>
          
          <div 
            onClick={() => setTestMode(!testMode)}
            style={{
              background: testMode ? '#28a745' : '#dc3545',
              padding: '8px 12px',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            وضع الاختبار: {testMode ? 'مفعل' : 'معطل'}
          </div>
          
          <div 
            onClick={() => {
              // زر لتسجيل دخول سريع للاختبار
              login({
                id: 1,
                name: "مستخدم تجريبي",
                email: "test@example.com",
                role: userRole
              }, "test-token-123");
            }}
            style={{
              background: '#ffc107',
              color: '#000',
              padding: '8px 12px',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            تسجيل دخول سريع
          </div>
          
          <div 
            onClick={logout}
            style={{
              background: '#dc3545',
              padding: '8px 12px',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            تسجيل خروج
          </div>
          
          <div style={{
            marginTop: '5px',
            padding: '5px',
            fontSize: '11px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px'
          }}>
            الدور الحالي: {userRole === "jobSeeker" ? "باحث عن عمل" : "شركة"}
          </div>
        </div> */}
        
        <Routes>
          {/* الصفحات العامة */}
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          <Route path="/about" element={<AboutPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          <Route path="/services" element={<ServicesPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          <Route path="/contact" element={<ContactPage isAuthenticated={isAuthenticated} user={user} logout={logout} />} />
          
          {/* صفحات المصادقة */}
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

        {/* === مسارات الشركة === */}
        <Route path="/company/dashboard" element={<ApplicantsGrid />} />
        <Route path="/company/my-jobs" element={<AddJobPage />} />

        {/* === مسارات الباحث عن عمل === */}
        <Route path="/jobseeker/matches" element={<MatchesPage />} />
        <Route path="/jobseeker/upload" element={<UploadResume />} />

        {/* === عام === */}
        <Route
          path="/settings"
          element={<SettingsPage settings={currentSettings} />}
        />

        <Route path="/Addjob" element={<AddJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;