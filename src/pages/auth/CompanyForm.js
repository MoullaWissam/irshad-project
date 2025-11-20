import React from "react";

const CompanyForm = ({ data, errors, onChange, onFileChange }) => {
  return (
    <div className="formContent show">
      {[
        { label: "Company Name", name: "companyName" },
        { label: "Password", name: "companyPassword", type: "password" },
        { label: "Company Address", name: "companyAddress" },
        { label: "email", name: "email" },
        { label: "Website", name: "website" },
      ].map((field) => (
        <div key={field.name}>
          <h4 className="info-text">{field.label}</h4>
          <div style={{ position: "relative" }}>
            <input
              name={field.name}
              type={field.type || "text"}
              value={data[field.name]}
              onChange={onChange}
            />
            {errors[field.name] && (
              <span className="error-floating">{errors[field.name]}</span>
            )}
          </div>
        </div>
      ))}

      {/* تحميل شعار الشركة */}
      <div className="upload" style={{ alignContent: "center" }}>
        <label htmlFor="companyPhoto" className="upload-label">
          <img
            src="/image- 1.png"
            alt="Upload Icon"
            style={{ verticalAlign: "middle", marginRight: "6px" }}
          />
          <span>{data.photo ? data.photo.name : "Upload Company Logo"}</span>
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
