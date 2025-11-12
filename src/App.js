import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./Components/SetNewPassword/ForgotPassword";
import CheckEmail from "./Components/SetNewPassword/CheckEmail";
import SetNewPassword from "./Components/SetNewPassword/SetNewPassword";
import Success from "./Components/SetNewPassword/Success";
import Home from "./HomePage/HomePage";

function App() {
  return (
    <Home /> // <Router>
    //   <Routes>
    //     <Route path="/" element={<ForgotPassword />} />
    //     <Route path="/check-email" element={<CheckEmail />} />
    //     <Route path="/set-password" element={<SetNewPassword />} />
    //     <Route path="/success" element={<Success />} />
    //   </Routes>
    // </Router>
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
