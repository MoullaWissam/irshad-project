import React, { useState } from "react";
import "./UploadResume.css";

// استيراد المكونات الفرعية (كل مكون مسؤول عن جزء محدد من الواجهة)
import TipsSection from "./TipsSection";
import UploadBox from "./UploadBox";
import Popup from "./Popup";
import ErrorMessage from "./ErrorMessage";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setErrorMsg("❌ Please upload a valid file (PDF, DOC, DOCX)");
      return;
    }

    setFile(selectedFile);
    setErrorMsg("");
  };

  const handleExampleDownload = () => {
    const link = document.createElement("a");
    link.href = "/example.pdf";
    link.download = "example.pdf";
    link.click();
  };

  const handleSeeResults = async () => {
    if (!file) {
      setErrorMsg("⚠️ Upload your ATS CV to see results");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await fetch("http://localhost:3000/resumes/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // يرسل accessToken من الكوكي تلقائيًا
      });

      setShowPopup(true);
    } catch (error) {
      setErrorMsg(`❌ Upload failed: ${error.message}`);
    }
  };

  const closePopup = () => {
    const popup = document.querySelector(".popup");
    if (popup) {
      popup.classList.add("fade-out");
      setTimeout(() => setShowPopup(false), 250);
    } else {
      setShowPopup(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="main-header">
        <h2 className="welcome-text">Welcome!</h2>
        <h3 className="subtitle">
          {file
            ? "If you’d like to update your resume, simply upload the new version here"
            : "Upload your resume and take the first step toward your career"}
        </h3>
      </div>

      <div className="content-sections">
        <div className="left-side">
          <TipsSection />
        </div>

        <div className="right-side">
          <button className="example-btn" onClick={handleExampleDownload}>
            Show me an example
          </button>

          <UploadBox onUpload={handleFileUpload} file={file} />

          <button className="see-results-btn" onClick={handleSeeResults}>
            See results
          </button>

          <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />
        </div>
      </div>

      {showPopup && <Popup closePopup={closePopup} />}
    </div>
  );
};

export default UploadResume;
