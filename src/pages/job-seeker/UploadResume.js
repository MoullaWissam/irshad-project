import React, { useState } from "react";
import "./UploadResume.css";

// استيراد المكونات الفرعية
import TipsSection from "./TipsSection";
import UploadBox from "./UploadBox";
import Popup from "./Popup";
import ErrorMessage from "./ErrorMessage";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scanComplete, setScanComplete] = useState(false); // ✅ حالة جديدة لتتبع اكتمال المسح

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setErrorMsg(" Please upload a valid file (PDF, DOC, DOCX)");
      return;
    }

    setFile(selectedFile);
    setScanComplete(false); // ✅ إعادة تعيين حالة المسح عند رفع ملف جديد
    setErrorMsg("");
  };

  // ✅ دالة تُستدعى عند اكتمال المسح
  const handleScanComplete = () => {
    setScanComplete(true);
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
        credentials: "include",
      });

      setShowPopup(true);
    } catch (error) {
      setErrorMsg(`❌ Upload failed: ${error.message}`);
    }
  };

  const closePopup = () => {
    const popup = document.querySelector(".upload-resume-popup");
    if (popup) {
      popup.classList.add("fade-out");
      setTimeout(() => setShowPopup(false), 250);
    } else {
      setShowPopup(false);
    }
  };

  return (
    <div className="upload-resume-container">
      <div className="upload-resume-main-header">
        <h2 className="upload-resume-welcome-text">Welcome!</h2>
        <h3 className="upload-resume-subtitle">
          {file
            ? "If you'd like to update your resume, simply upload the new version here"
            : "Upload your resume and take the first step toward your career"}
        </h3>
      </div>

      <div className="upload-resume-content-sections">
        <div className="upload-resume-left-side">
          <TipsSection />
        </div>

        <div className="upload-resume-right-side">
          <button className="upload-resume-example-btn" onClick={handleExampleDownload}>
            Show me an example
          </button>

          {/* ✅ تمرير callback لمعرفة متى يكتمل المسح */}
          <UploadBox 
            onUpload={handleFileUpload} 
            file={file} 
            onScanComplete={handleScanComplete}
          />

          {/* ✅ زر يظهر فقط بعد انتهاء المسح */}
          {file && scanComplete && (
            <button className="upload-resume-see-results-btn" onClick={handleSeeResults}>
              See results
            </button>
          )}

          <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />
        </div>
      </div>

      {showPopup && <Popup closePopup={closePopup} />}
    </div>
  );
};

export default UploadResume;