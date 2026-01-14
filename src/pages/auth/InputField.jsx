import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next'; // إضافة الترجمة
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputField.css";

const InputField = ({ label, type, value, onChange, error, placeholder }) => {
  const { t } = useTranslation(); // استدعاء الترجمة
  const [show, setShow] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (error) {
      setShowFloating(true);
      const timer = setTimeout(() => setShowFloating(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const translatedLabel = t(label);
  const translatedPlaceholder = placeholder ? t(placeholder) : placeholder;

  return (
    <div className="input-field-container">
      <label className="input-label">
        {translatedLabel}
      </label>

      <div className="input-wrapper">
        <input
          type={type === "password" && !show ? "password" : "text"}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`custom-input ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}
          placeholder={translatedPlaceholder}
        />

        {type === "password" && (
          <button 
            type="button" 
            className="eyeIcon" 
            onClick={() => setShow(!show)}
            aria-label={show ? t("Hide password") : t("Show password")}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}

        {error && showFloating && (
          <span className="error-floating">{t(error)}</span>
        )}
      </div>
    </div>
  );
};

export default InputField;