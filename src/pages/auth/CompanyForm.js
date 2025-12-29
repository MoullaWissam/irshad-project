import React, { useState } from "react";
import UploadIcon from "../../assets/icons/image- 1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const CompanyForm = ({ data, errors, onChange, onFileChange }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const fields = [
    { label: t('Company Name'), name: "companyName", type: "text", placeholder: t('Enter company name') },
    { label: t('Password'), name: "companyPassword", type: "password", placeholder: t('Enter password') },
    { label: t('Company Address'), name: "companyAddress", type: "text", placeholder: t('Enter address') },
    { label: t('Email'), name: "email", type: "email", placeholder: t('Enter email') },
    { label: t('Website'), name: "website", type: "text", placeholder: t('Enter website URL') },
  ];

  return (
    <div className="formContent show">
      {fields.map((field) => (
        <div key={field.name}>
          <h4 className="info-text compact-label">{field.label}</h4>
          <div style={{ position: "relative" }}>
            <input
              name={field.name}
              type={field.name === "companyPassword" && !showPassword ? "password" : field.name === "companyPassword" && showPassword ? "text" : field.type}
              value={data[field.name]}
              onChange={onChange}
              style={
                field.name === "companyPassword"
                  ? { paddingRight: "40px", width: "100%" }
                  : { width: "100%" }
              }
              placeholder={field.placeholder}
            />
            
            {field.name === "companyPassword" && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                  fontSize: "18px",
                  zIndex: 2,
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}

            {errors[field.name] && (
              <span className="error-floating">{errors[field.name]}</span>
            )}
          </div>
        </div>
      ))}

      <div className="upload" style={{ alignContent: "center" }}>
        <label htmlFor="companyPhoto" className="upload-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "row", gap: "8px" }}>
          <img
            src={UploadIcon}
            alt="Upload Icon"
            style={{ width: "20px", height: "20px" }}
          />
          <span style={{ color: "#00b8e7", fontWeight: "600", fontSize: "14px" }}>
            {data.photo ? `✓ ${data.photo.name}` : t('Upload Company Logo (optional)')}
          </span>
        </label>
        <input
          id="companyPhoto"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default CompanyForm;