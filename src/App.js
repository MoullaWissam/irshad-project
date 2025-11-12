import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./Components/Set new password/ForgotPassword";
import CheckEmail from "./Components/Set new password/CheckEmail";
import SetNewPassword from "./Components/Set new password/SetNewPassword";
import Success from "./Components/Set new password/Success";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/set-password" element={<SetNewPassword />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Sidebar from "./Components/SideBar/Sidebar";
// import SettingsPage from "./Components/Settings/SettingsPage";
// import { settingsByRole } from "./Components/Settings/settingsConfig";
// import RegisterPage from "./Components/RegisterPage/RegisterPage";

// function App() {
//   const userRole = "company"; // أو "jobSeeker"
//   const settings = settingsByRole[userRole];

//   return <RegisterPage />;
// }

// export default App;
