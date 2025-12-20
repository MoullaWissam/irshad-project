// UploadBox.jsx
import React, { useState } from "react";
import { FileText, UploadCloud, Check, Search } from "lucide-react";
import RobotAvatar from "../../assets/images/Murshed.png";

const UploadBox = ({ onUpload, file, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    startScan();
    onUpload(e);
  };

  const startScan = () => {
    setIsScanning(true);
    
    // ✅ الأنميشن أقصر (4 ثوانٍ بدلاً من 6)
    setTimeout(() => {
      setIsScanning(false);
      if (onScanComplete) {
        onScanComplete(); // إعلام المكون الرئيسي بانتهاء المسح
      }
    }, 4000);
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

  const scanPoints = Array.from({ length: 6 });
  const textEffects = Array.from({ length: 4 });
  const activeLines = Array.from({ length: 4 });
  const dataPoints = Array.from({ length: 6 });
  const dataStreams = Array.from({ length: 5 });

  return (
    <label 
      className={`upload-resume-upload-box ai-box ${isScanning ? "scanning" : ""} ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        hidden
        disabled={isScanning}
        onChange={handleFileSelect}
      />

      {/* 🤖 الروبوت الثابت في الأعلى */}
      <div className="robot-head-space">
        <div className="robot-head static">
          <img src={RobotAvatar} alt="AI Assistant" />
        </div>
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
          <span>إسقاط السيرة الذاتية هنا</span>
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
          <div className="success-icon-wrapper">
            <Check size={40} className="file-icon-success" />
          </div>
          <p className="file-name">{file.name}</p>
          <span className="file-ready">✓ اكتمل الفحص الدقيق</span>
          <div className="file-details">
            <small>تم تحليل {Math.floor(file.size / 500)} عنصر • جاهز للتقييم</small>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder-ui">
          <UploadCloud size={44} className="upload-icon" />
          <p className="upload-title">  </p>
          <span className="upload-subtitle">PDF أو DOC أو DOCX</span>
          <div className="scan-preview-hint">
            <small>
              سيتم فحص دقيق للملف باستخدام تقنيات ذكاء اصطناعي متقدمة
            </small>
          </div>
        </div>
      )}
    </label>
  );
};

export default UploadBox;