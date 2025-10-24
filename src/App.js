import React from "react";
import Sidebar from "./Company/Components/SideBar/Sidebar.js";
import Addjob from "./Company/Company 1/AddJobPage.js";

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
        <Addjob />
      </main>
    </div>
  );
}

export default App;
