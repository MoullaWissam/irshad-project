// AddCompanyForm.js
import React from "react";
import "./AddCompanyForm.css";

// import uploadIcon from "/upload.png";

function AddCompanyForm() {
  return (
    <div>
      <h2 className="page-title">Add new Job application</h2>

      <div className="add-company-form">
        <form className="form-fields">
          <label>
            Company Name
            <input type="text" placeholder="Enter company name" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Enter password" />
          </label>

          <label>
            Company Address
            <input type="text" placeholder="Enter address" />
          </label>

          <label>
            Website
            <input type="text" placeholder="Enter website URL" />
          </label>

          <label className="upload-label">
            Upload Company Logo (optional)
            <div className="upload-box">
              <img src={""} alt="Upload" />
              <span>Upload Logo</span>
            </div>
          </label>
        </form>
      </div>
    </div>
  );
}

export default AddCompanyForm;
