// InputField.js
import React, { useState, useEffect } from "react";
import "./InputField.css";

const InputField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  error, 
  placeholder, 
  required 
}) => {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    if (error) {
      setShowFloating(true);
      const timer = setTimeout(() => setShowFloating(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="ajp-input-field-container">
      <label className="ajp-input-label">
        {label} {required && <span className="ajp-required-star">*</span>}
      </label>

      <div className="ajp-input-wrapper">
        <input
          type={type || "text"}
          value={value}
          onChange={onChange}
          className={`ajp-input ${error ? 'ajp-input-error' : ''}`}
          placeholder={placeholder}
        />

        {error && showFloating && (
          <span className="ajp-error-floating">{error}</span>
        )}
        
        {error && (
          <div className="ajp-error-message">{error}</div>
        )}
      </div>
    </div>
  );
};

export default InputField;