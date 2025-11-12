/**
 * AuthCard Component
 * مكون عام لعرض واجهات التوثيق مثل نسيان كلمة المرور وتحديثها
 * يحتوي على عنوان، نص فرعي، حقول إدخال، زر تنفيذ، وسهم رجوع اختياري
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthCard.css";

function AuthCard({
  title,
  subtitle,
  fields,
  buttonText,
  onSubmit,
  showBackButton = true,
  customBackPath = null,
  children,
}) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // تفعيل التحريك عند تحميل المكون
  useEffect(() => {
    setAnimate(true);
  }, []);

  // التعامل مع زر الرجوع
  const handleBack = () => {
    if (customBackPath) {
      navigate(customBackPath); // الرجوع لمسار مخصص
    } else {
      navigate(-1); // الرجوع للصفحة السابقة
    }
  };

  return (
    <div className="auth-container">
      {/* البطاقة الأساسية مع تأثير الدخول */}
      <div className={`auth-card ${animate ? "fade-slide-in" : ""}`}>
        {/* زر الرجوع إذا مطلوب */}
        {showBackButton && (
          <button className="back-btn" onClick={handleBack}>
            ←
          </button>
        )}

        {/* عنوان الواجهة */}
        <h2>{title}</h2>

        {/* النص الفرعي إذا موجود */}
        {subtitle && <p className="subtitle">{subtitle}</p>}

        {/* نموذج الإدخال */}
        <form onSubmit={onSubmit}>
          {fields &&
            fields.map((field, index) => (
              <div className="input-group" key={index}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                />
              </div>
            ))}

          {/* محتوى إضافي مثل حقول OTP */}
          {children}

          <button type="submit" className="submit-btn">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthCard;
