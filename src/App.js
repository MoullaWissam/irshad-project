import React from "react";
import Sidebar from "./Components/SideBar/Sidebar.js";
import Addjob from "./Company/Company 1/AddJobPage.js";
import ApplicantsGrid from "./Company/Company 2/ApplicantsGrid.js";
import UploadResume from "./Job seeker/Main/UploadResume.js";
import Home from "./Job seeker/Job seeker 2/MatchesPage.js";

function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: 36,
          background: "linear-gradient(#f7f7ff, #efe6ff)",
        }}
      >
        {/* هنا تضع باقي المحتوى (العنوان + بطاقات) */}
        <Home />
      </main>
    </div>
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
