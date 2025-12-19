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

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleBack = () => {
    if (customBackPath) {
      navigate(customBackPath); 
    } else {
      navigate(-1); 
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${animate ? "fade-slide-in" : ""}`}>
        {showBackButton && (
          <button className="back-btn" onClick={handleBack} type="button">
            « Back
          </button>
        )}

        <h2>{title}</h2>

        {subtitle && <p className="subtitle">{subtitle}</p>}

        <form onSubmit={onSubmit}>
          {fields &&
            fields.map((field, index) => (
              <div className="input-group" key={index}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value || ""}
                  onChange={field.onChange}
                  required
                  disabled={field.disabled}
                />
              </div>
            ))}

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