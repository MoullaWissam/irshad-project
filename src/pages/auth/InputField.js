import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputField.css"; // تأكد من أن هذا الملف يحتوي على التنسيقات الصحيحة

const InputField = ({ label, type, value, onChange, error }) => {
  const [show, setShow] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    if (error) {
      setShowFloating(true);
      const timer = setTimeout(() => setShowFloating(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    // 1. إزالة الـ inline styles من الحاوية واستبدالها بـ className
    <div className="input-field-container">
      <label className="input-label">
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={type === "password" && !show ? "password" : "text"}
          value={value}
          onChange={onChange}
          className="custom-input" // 2. استخدام class بدلاً من style
        />

        {type === "password" && (
          <span className="eyeIcon" onClick={() => setShow(!show)}>
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}

        {error && showFloating && (
          <span className="error-floating">{error}</span>
        )}
      </div>
    </div>
  );
};

export default InputField;