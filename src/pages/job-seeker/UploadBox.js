// UploadBox.jsx - المكون المعدل
import React, { useState, useEffect, useRef } from "react";
import { FileText, UploadCloud, Search } from "lucide-react";
import RobotAvatar from "../../assets/images/Murshed.png";
import "./UploadBoxAnimations.css";
import { useTranslation } from 'react-i18next'; // أضف هذا الاستيراد

const UploadBox = ({ onUpload, file, onScanStart, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanComplete, setIsScanComplete] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation(); // أضف هذا

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setIsScanComplete(false);
    startScan();
    onUpload(e);
  };

  const startScan = () => {
    // إعلام المكون الرئيسي ببدء المسح
    if (onScanStart) {
      onScanStart();
    }
    
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setIsScanComplete(true);
      if (onScanComplete) {
        onScanComplete(); // إعلام المكون الرئيسي بانتهاء المسح
      }
    }, 4000);
  };

  const handleClick = () => {
    if (!isScanning && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files: [files[0]] } };
      handleFileSelect(event);
    }
  };

  useEffect(() => {
    if (file && !isScanning) {
      setIsScanComplete(true);
    }
  }, [file, isScanning]);

  const scanPoints = Array.from({ length: 6 });
  const textEffects = Array.from({ length: 4 });
  const activeLines = Array.from({ length: 4 });
  const dataPoints = Array.from({ length: 6 });
  const dataStreams = Array.from({ length: 5 });

  return (
    <div 
      className={`upload-resume-upload-box ai-box ${isScanning ? "scanning" : ""} ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ cursor: isScanning ? 'default' : 'pointer' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        hidden
        disabled={isScanning}
        onChange={handleFileSelect}
      />

      {/* 🤖 الروبوت في المنتصف */}
      <div className={`robot-head ${isScanning ? 'scanning-mode' : isScanComplete ? 'centered-after-scan' : 'upload-mode'}`}>
        <img src={RobotAvatar} alt="AI Assistant" />
      </div>

      {/* 🔍 أيقونة العدسة بدون دائرة */}
      {isScanning && (
        <>
          <div className="magnifier-icon-animated">
            <Search size={60} className="magnifier-icon-inner" />
            <div className="icon-beam"></div>
          </div>
          
          {/* تأثيرات المسح الأساسية */}
          <div className="zoom-effect"></div>
          <div className="scan-path">
            {scanPoints.map((_, i) => <div key={i} className="scan-point"></div>)}
          </div>
          <div className="active-scan-lines">
            {activeLines.map((_, i) => <div key={i} className="active-scan-line"></div>)}
          </div>
          <div className="text-reading-container">
            {textEffects.map((_, i) => <div key={i} className="text-reading-effect"></div>)}
          </div>
          
          {/* تأثيرات إلكترونية متطورة */}
          <div className="digital-scan-container">
            <div className="data-grid"></div>
            {dataPoints.map((_, i) => (
              <div key={`point-${i}`} className="data-point"></div>
            ))}
            {dataStreams.map((_, i) => (
              <div key={`stream-${i}`} className="data-stream"></div>
            ))}
            <div className="circular-scan"></div>
            <div className="electron-pulse"></div>
          </div>
        </>
      )}

      {/* Drag State */}
      {isDragging && !isScanning && !file && (
        <div className="drag-overlay">
          <div className="drag-icon">📄</div>
          <span>{t("إسقاط السيرة الذاتية هنا")}</span>
        </div>
      )}

      {/* Scanning UI */}
      {isScanning ? (
        <div className="ai-scan-ui">
          <div className="file-preview">
            <FileText size={48} className="file-icon-modern" />
          </div>
        </div>
      ) : file ? (
        <div className="file-ready-ui">
          <div className="file-info">
            <p className="file-name">{file.name}</p>
            <span className="file-ready">{t("✓ اكتمل الفحص الدقيق")}</span>
            <div className="file-details">
              <small>{t("تم تحليل {count} عنصر • جاهز للتقييم", { count: Math.floor(file.size / 500) })}</small>
            </div>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder-ui">
          <UploadCloud size={44} className="upload-icon" />
          <p className="upload-title"></p>
          <span className="upload-subtitle">{t("PDF أو DOC أو DOCX")}</span>
          <div className="scan-preview-hint">
            <small>
              {t("سيتم فحص دقيق للملف باستخدام تقنيات ذكاء اصطناعي متقدمة")}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBox;