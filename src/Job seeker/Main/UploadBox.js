/**
 * UploadBox Component
 * مسؤول عن مربع رفع الملف وتغيير نصه عند اختيار ملف
 */

import React from "react";

const UploadBox = ({ onUpload, file }) => {
  return (
    <label className="upload-box">
      {/* حقل الإدخال (مخفي فعليًا ويُستخدم عند الضغط على المربع) */}
      <input type="file" accept=".pdf,.doc,.docx" onChange={onUpload} hidden />
      {/* عرض اسم الملف أو نص افتراضي */}
      {file ? <p>{file.name}</p> : <p>Upload your ATS CV here</p>}
    </label>
  );
};

export default UploadBox;
