import React from "react";
import UploadIcon from "../../assets/icons/image- 1.png";

const EmployeeForm = ({ data, errors, onChange, onFileChange }) => {
  return (
    <div className="formContent show">
      {[
        { label: "First Name", name: "firstName" },
        { label: "Last Name", name: "lastName" },
        { label: "Email", name: "email", type: "email" },
        { label: "Password", name: "password", type: "password" },
        { label: "Phone Number", name: "phone" },
      ].map((field) => (
        <div key={field.name}>
          <h4 className="info-text compact-label">{field.label}</h4>
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

      <div className="upload" style={{ alignContent: "center" }}>
        <label htmlFor="employeePhoto" className="upload-label">
          <img
            src={UploadIcon}
            alt="Upload Icon"
            style={{ verticalAlign: "middle", marginRight: "6px" }}
          />
          <span>{data.photo ? data.photo.name : "Upload Profile Photo"}</span>
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
