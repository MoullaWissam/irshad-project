import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputField.css";

const InputField = ({ label, type, value, onChange, error, placeholder }) => {
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

  return (
    <div className="input-field-container">
      <label className="input-label">
        {label}
      </label>

      <div className="input-wrapper">
        <input
          type={type === "password" && !show ? "password" : "text"}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`custom-input ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}
          placeholder={placeholder}
        />

        {type === "password" && (
          <button 
            type="button" 
            className="eyeIcon" 
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}

        {error && showFloating && (
          <span className="error-floating">{error}</span>
        )}
      </div>
    </div>
  );
};

export default InputField;