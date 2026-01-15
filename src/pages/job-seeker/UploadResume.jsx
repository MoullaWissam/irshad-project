import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UploadResume.css";
import { useTranslation } from "react-i18next";
import exampleImage from "../../assets/images/example.png";
import TipsSection from "./TipsSection";
import UploadBox from "./UploadBox";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [hasUploadedBefore, setHasUploadedBefore] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";

  useEffect(() => {
    const hasPreviousUpload = localStorage.getItem("hasUploadedCV");
    if (hasPreviousUpload === "true") {
      setHasUploadedBefore(true);
    }

    // استرجاع الملف السابق إذا كان موجودًا
    const savedFile = localStorage.getItem("currentCV");
    const savedResumeId = localStorage.getItem("resumeId");

    if (savedFile) {
      try {
        const parsedFile = JSON.parse(savedFile);
        setFile(parsedFile);
        setScanComplete(true);
      } catch (error) {
        console.error("Error parsing saved file:", error);
        toast.error(t(" Error loading saved resume"));
      }
    }

    if (savedResumeId) {
      setResumeId(savedResumeId);
    }
  }, [t]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      toast.error(t(" Please upload a valid file (PDF, DOC, DOCX)"));
      return;
    }

    setFile(selectedFile);
    setScanComplete(false);

    localStorage.setItem("hasUploadedCV", "true");
    localStorage.setItem(
      "currentCV",
      JSON.stringify({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      })
    );

    toast.success(t("The file has been uploaded successfully!"));
  };

  const handleScanStart = () => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setScanComplete(true);
    setIsScanning(false);
    toast.success(t("The thorough examination of the file has been completed."));
  };

  const handleDeleteFile = () => {
    setFile(null);
    setResumeId(null);
    setScanComplete(false);
    localStorage.removeItem("currentCV");
    localStorage.removeItem("resumeId");
    toast.info(t("Current CV deleted"));
  };

  const handleExampleDownload = () => {
    const link = document.createElement("a");
    link.href = exampleImage;  
    link.download = "example-resume.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeeResults = async () => {
    if (!file) {
      toast.error(t(" Upload your ATS CV to see results"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (file.size > 10 * 1024 * 1024) {
        toast.error(t(" File size too large (max 10MB)"));
        return;
      }

      console.log("File info:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // جرب عدة endpoints
      const endpoints = ["https://irshad-ovo6.onrender.com/resumes/upload"];

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

            localStorage.setItem("resumeData", JSON.stringify(data));
            localStorage.setItem("hasUploadedCV", "true");

            if (data.id || data.resumeId) {
              const newResumeId = data.id || data.resumeId;
              setResumeId(newResumeId);
              localStorage.setItem("resumeId", newResumeId);
            }

            setShowPopup(true);

            setTimeout(() => {
              setShowPopup(false);
              navigate("/matches");
            }, 3000);

            return;
          }else if (response.status == 422) {
            console.log("22");   
            const data = await response.json()                     
            toast.error(`Uploading failed: ${data.message}`);   
          }else{
            const data = await response.json()                     
            console.log(data.message);
            
          }
          // lastError = `Endpoint ${endpoint} failed with status ${response.status}`;
          // console.error(response.message);
        } catch (err) {
          console.log("error",err.message);
        }

        // إعادة إنشاء FormData لكل محاولة
        formData.delete("file");
        formData.append("file", file);
      }

      throw new Error(`All endpoints failed. Last error: ${lastError}`);
    } catch (error) {
      console.error("Final upload error:", error);
      toast.error(t(`Uploading failed: ${error.message}`));
    }
  };

  // ✅ دالة لتحديث السيرة الذاتية باستخدام PUT
  const handleUpdateResume = async () => {
    if (!file) {
      toast.error(t("⚠️ No resume file available to update"));
      return;
    }

    // إذا لم يكن هناك resumeId، استخدم الافتراضي 21 أو حاول الحصول من localStorage
    const updateResumeId = localStorage.getItem("userData");
    const RID = JSON.parse(updateResumeId);
    console.log("all", RID);
    console.log("s", RID.id);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // تحقق من حجم الملف
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("File size too large (max 10MB)"));
        return;
      }

      console.log(`Updating resume with ID: ${updateResumeId}`);

      const response = await fetch(`https://irshad-ovo6.onrender.com/resumes/update`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Update successful:", data);

        toast.success(t(" The CV has been successfully updated!"));

        // حفظ الـ ID الجديد إذا كان مختلفاً
        if (data.id && data.id !== updateResumeId) {
          setResumeId(data.id);
          localStorage.setItem("resumeId", data.id);
        }

        // الانتقال إلى صفحة matches فوراً
        setTimeout(() => {
          navigate("/matches");
        }, 1000);
      } else {
        const errorText = await response.text();
        console.error("Update failed:", response.status, errorText);
        if (response.status === 422) {
          toast.error(`Uplodaing failed: is not a valid CV `)
        }
        if (response.status === 404) {
          toast.error(
            t("The CV was not found. Please upload it first.")
          );
        } else {
          toast.error(t(`Update failed: ${response.status}`));
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(t(`Error updating CV: ${error.message}`));
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
    <div className="upload-resume-container" dir={isRTL ? "rtl" : "ltr"}>
      <ToastContainer
        position={isRTL ? "bottom-left" : "bottom-right"}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />

      <div className="upload-resume-main-header">
        <h2
          className="upload-resume-welcome-text"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          {hasUploadedBefore ? t("Welcome back!") : t("Welcome!")}
        </h2>
        <h3
          className="upload-resume-subtitle"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          {file
            ? hasUploadedBefore
              ? t(
                  "You can replace your current CV with a new version, or delete it to start fresh"
                )
              : t(
                  "If you'd like to update your resume, simply upload the new version here"
                )
            : t(
                "Upload your resume and take the first step toward your career"
              )}
        </h3>
      </div>

      <div className="upload-resume-content-sections">
        <div className="upload-resume-left-side">
          <TipsSection />
        </div>

        <div className="upload-resume-right-side">
          <button
            className="upload-resume-example-btn"
            onClick={handleExampleDownload}
            style={{ float: isRTL ? "left" : "right" }}
          >
            {t("Show me an example")}
          </button>

          <UploadBox
            onUpload={handleFileUpload}
            file={file}
            onScanStart={handleScanStart}
            onScanComplete={handleScanComplete}
          />

          <div className="upload-resume-action-buttons">
            {file && scanComplete && !isScanning && (
              <button
                className="upload-resume-see-results-btn"
                onClick={handleSeeResults}
                style={{
                  float: isRTL ? "left" : "right",
                  marginRight: isRTL ? "0" : "10px",
                  marginLeft: isRTL ? "10px" : "0",
                }}
              >
                {t("See results")}
              </button>
            )}

            <div
              className="upload-resume-update-delete-container"
              style={{
                float: isRTL ? "right" : "left",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              {file && (
                <button
                  className="upload-resume-update-btn"
                  onClick={handleUpdateResume}
                  disabled={isScanning}
                >
                  {t("Update Resume")}
                </button>
              )}

              {file && hasUploadedBefore && !isScanning && (
                <button
                  className="upload-resume-delete-btn"
                  onClick={handleDeleteFile}
                >
                  {t("Delete this CV")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="upload-resume-popup">
          <div className="upload-resume-popup-content">
            <h3 style={{ textAlign: isRTL ? "right" : "left" }}>
              {t("Upload successful!")}
            </h3>
            <p style={{ textAlign: isRTL ? "right" : "left" }}>
              {t("Your resume is being analyzed..")}
            </p>
            <div className="upload-resume-spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
