// UploadResume.js - المكون الرئيسي المعدل
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./UploadResume.css";

// استيراد المكونات الفرعية
import TipsSection from "./TipsSection";
import UploadBox from "./UploadBox";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [hasUploadedBefore, setHasUploadedBefore] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // حالة جديدة لتتبع المسح
  const navigate = useNavigate();

  // ✅ التحقق من localStorage عند تحميل المكون
  useEffect(() => {
    const hasPreviousUpload = localStorage.getItem('hasUploadedCV');
    if (hasPreviousUpload === 'true') {
      setHasUploadedBefore(true);
    }
    
    // استرجاع الملف السابق إذا كان موجودًا
    const savedFile = localStorage.getItem('currentCV');
    if (savedFile) {
      try {
        const parsedFile = JSON.parse(savedFile);
        setFile(parsedFile);
        setScanComplete(true); // نفترض أن المسح اكتمل
      } catch (error) {
        console.error("Error parsing saved file:", error);
        toast.error("❌ خطأ في تحميل السيرة الذاتية المحفوظة");
      }
    }
  }, []);

  // في handleFileUpload خزّن الملف الأصلي
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      toast.error("⚠️ Please upload a valid file (PDF, DOC, DOCX)");
    return;
  }

  // خزّن الملف نفسه في state
  setFile(selectedFile);
  setScanComplete(false);

  localStorage.setItem('hasUploadedCV', 'true');
  // إذا أردت تخزين بيانات فقط، لا تحفظ الملف نفسه في localStorage لأنه لا يُخزن Blob
  localStorage.setItem('currentCV', JSON.stringify({
    name: selectedFile.name,
    size: selectedFile.size,
    type: selectedFile.type,
    lastModified: selectedFile.lastModified
  }));

  toast.success("✅ تم رفع الملف بنجاح!");
};


  // ✅ دالة لتتبع حالة المسح
  const handleScanStart = () => {
    setIsScanning(true);
  };

  // ✅ دالة تُستدعى عند اكتمال المسح
  const handleScanComplete = () => {
    setScanComplete(true);
    setIsScanning(false); // إنهاء حالة المسح
    toast.success("✅ اكتمل الفحص الدقيق للملف");
  };

  // ✅ دالة لحذف الملف الحالي
  const handleDeleteFile = () => {
    setFile(null);
    setScanComplete(false);
    localStorage.removeItem('currentCV');
    toast.info("🗑️ تم حذف السيرة الذاتية الحالية");
    // لا نزيل hasUploadedCV لأن المستخدم قد رفع من قبل
  };

  const handleExampleDownload = () => {
    const link = document.createElement("a");
    link.href = "/example.pdf";
    link.download = "example.pdf";
    link.click();
    toast.info("📥 جارٍ تحميل المثال...");
  };

 const handleSeeResults = async () => {
  if (!file) {
    toast.error("⚠️ Upload your ATS CV to see results");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    // تحقق من حجم الملف
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error("⚠️ File size too large (max 10MB)");
      return;
    }

    console.log("File info:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // جرب عدة endpoints
    const endpoints = [
      "http://localhost:3000/resumes/upload",

    ];

    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Success with endpoint:", endpoint, data);
          
          // حفظ النتيجة
          localStorage.setItem('resumeData', JSON.stringify(data));
          localStorage.setItem('hasUploadedCV', 'true');
          
          // إظهار البوب أب أولاً
          setShowPopup(true);
          
          // الانتقال بعد 3 ثواني
          setTimeout(() => {
            setShowPopup(false);
            navigate("/matches");
          }, 3000);
          
          return;
        }
        
        lastError = `Endpoint ${endpoint} failed with status ${response.status}`;
        console.error(lastError);
        
      } catch (err) {
        lastError = `Endpoint ${endpoint} error: ${err.message}`;
        console.error(lastError);
      }
      
      // إعادة إنشاء FormData لكل محاولة
      formData.delete('file');
      formData.append('file', file);
    }

    throw new Error(`All endpoints failed. Last error: ${lastError}`);
    
  } catch (error) {
    console.error("Final upload error:", error);
    toast.error(`❌ فشل الرفع: ${error.message}`);
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />

      <div className="upload-resume-main-header">
        <h2 className="upload-resume-welcome-text">
          {hasUploadedBefore ? "Welcome back!" : "Welcome!"}
        </h2>
        <h3 className="upload-resume-subtitle">
          {file
            ? hasUploadedBefore
              ? "You can replace your current CV with a new version, or delete it to start fresh"
              : "If you'd like to update your resume, simply upload the new version here"
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

          {/* ✅ تمرير callback لمعرفة متى يبدأ وينتهي المسح */}
          <UploadBox 
            onUpload={handleFileUpload} 
            file={file} 
            onScanStart={handleScanStart}
            onScanComplete={handleScanComplete}
          />

          {/* ✅ زر عرض النتائج يظهر فقط بعد انتهاء المسح */}
          {file && scanComplete && !isScanning && (
            <button className="upload-resume-see-results-btn" onClick={handleSeeResults}>
              See results
            </button>
          )}

          {/* ✅ زر حذف الملف يظهر عندما يكون هناك ملف مرفوع وليس أثناء المسح */}
          {file && hasUploadedBefore && !isScanning && (
            <button 
              className="upload-resume-delete-btn"
              onClick={handleDeleteFile}
            >
              Delete current CV
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default UploadResume;