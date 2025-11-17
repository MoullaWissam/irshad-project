/**
 * المكون الرئيسي UploadResume
 * مسؤول عن منطق الصفحة الكامل: رفع الملف، التحقق من النوع، عرض الرسائل والنافذة العائمة.
 */

import React, { useState } from "react";
import "./UploadResume.css";

// استيراد المكونات الفرعية (كل مكون مسؤول عن جزء محدد من الواجهة)
import TipsSection from "./TipsSection";
import UploadBox from "./UploadBox";
import Popup from "./Popup";
import ErrorMessage from "./ErrorMessage";

const UploadResume = () => {
  // 🔹 الحالة الخاصة بالملف المرفوع
  const [file, setFile] = useState(null);

  // 🔹 التحكم بظهور النافذة العائمة (popup)
  const [showPopup, setShowPopup] = useState(false);

  // 🔹 حفظ رسالة الخطأ إن وجدت
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * عند اختيار ملف من الجهاز
   * يتم التحقق من امتداد الملف قبل حفظه
   */
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return; // لو المستخدم ما اختار ملف فعليًا

    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    // التحقق من الامتداد
    if (!allowedExtensions.includes(ext)) {
      setErrorMsg("❌ Please upload a valid file (PDF, DOC, DOCX)");
      return;
    }

    // حفظ الملف + مسح رسالة الخطأ السابقة
    setFile(selectedFile);
    setErrorMsg("");
  };

  /**
   * عند الضغط على زر "Show me an example"
   * يتم تنزيل ملف example.pdf من مجلد public مباشرة
   */
  const handleExampleDownload = () => {
    const link = document.createElement("a");
    link.href = "/example.pdf"; // مسار الملف داخل مجلد public
    link.download = "example.pdf";
    link.click();
  };

  /**
   * عند الضغط على زر "See results"
   * إذا تم رفع ملف → تظهر النافذة العائمة
   * إذا لم يتم رفع ملف → تظهر رسالة خطأ مؤقتة
   */
  const handleSeeResults = () => {
    if (!file) {
      setErrorMsg("⚠️ Upload your ATS CV to see results");
      return;
    }
    setShowPopup(true);
  };

  /**
   * إغلاق النافذة العائمة
   * يتضمن أنيميشن خفيف عند الإغلاق
   */
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
      {/* ===== العنوان العام ===== */}
      <div className="main-header">
        <h2 className="welcome-text">Welcome!</h2>
        <h3 className="subtitle">
          {file
            ? "If you’d like to update your resume, simply upload the new version here"
            : "Upload your resume and take the first step toward your career"}
        </h3>
      </div>

      {/* ===== القسمين: النصائح والتحميل ===== */}
      <div className="content-sections">
        {/* 🔸 القسم الأيسر (نصائح المستخدم) */}
        <div className="left-side">
          <TipsSection />
        </div>

        {/* 🔸 القسم الأيمن (تحميل الملف + الأزرار) */}
        <div className="right-side">
          <button className="example-btn" onClick={handleExampleDownload}>
            Show me an example
          </button>

          {/* مربع رفع الملف */}
          <UploadBox onUpload={handleFileUpload} file={file} />

          <button className="see-results-btn" onClick={handleSeeResults}>
            See results
          </button>

          {/* عرض رسالة الخطأ إن وجدت */}
          <ErrorMessage message={errorMsg} onClose={() => setErrorMsg("")} />
        </div>
      </div>

      {/* ===== النافذة العائمة (popup) ===== */}
      {showPopup && <Popup closePopup={closePopup} />}
    </div>
  );
};

export default UploadResume;
