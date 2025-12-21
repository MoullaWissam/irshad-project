import React, { useState } from "react";
import UploadIcon from "../../assets/icons/image- 1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EmployeeForm = ({ data, errors, onChange, onFileChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const fields = [
    { label: "First Name", name: "firstName", type: "text" },
    { label: "Last Name", name: "lastName", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
    // { label: "Phone Number", name: "phone", type: "text" },
    { label: "Birth Date", name: "birthDate", type: "date" },
  ];

  return (
    <div className="formContent show">
      {fields.map((field) => (
        <div key={field.name}>
          <h4 className="info-text compact-label">{field.label}</h4>
          <div style={{ position: "relative" }}>
            <input
              name={field.name}
              type={field.name === "password" && !showPassword ? "password" : field.name === "password" && showPassword ? "text" : field.type}
              value={data[field.name]}
              onChange={onChange}
              style={
                field.name === "password"
                  ? { paddingRight: "40px", width: "100%" }
                  : { width: "100%" }
              }
            />
            
            {field.name === "password" && (
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
  <label htmlFor="employeePhoto" className="upload-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "row", gap: "8px" }}>
    <img
      src={UploadIcon}
      alt="Upload Icon"
      style={{ width: "20px", height: "20px" }}
    />
    <span style={{ color: "#00b8e7", fontWeight: "600", fontSize: "14px" }}>
      {data.photo ? `✓ ${data.photo.name}` : "Upload your photo here"}
    </span>
  </label>
  <input
    id="employeePhoto"
    type="file"
    accept="image/*"
    onChange={onFileChange}
    style={{ display: "none" }}
  />
</div>
    </div>
  );
};

export default EmployeeForm;