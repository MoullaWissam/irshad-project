import React from "react";
import { useTranslation } from 'react-i18next';
import "./AddCompanyForm.css";

function AddCompanyForm() {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="page-title">{t("Add new Job application")}</h2>

      <div className="add-company-form">
        <form className="form-fields">
          <label>
            {t("Company Name")}
            <input type="text" placeholder={t("Enter company name")} />
          </label>

          <label>
            {t("Password")}
            <input type="password" placeholder={t("Enter password")} />
          </label>

          <label>
            {t("Company Address")}
            <input type="text" placeholder={t("Enter address")} />
          </label>

          <label>
            {t("Website")}
            <input type="text" placeholder={t("Enter website URL")} />
          </label>

          <label className="upload-label">
            {t("Upload Company Logo (optional)")}
            <div className="upload-box">
              <img src={""} alt="Upload" />
              <span>{t("Upload Logo")}</span>
            </div>
          </label>
        </form>
      </div>
    </div>
  );
}

export default AddCompanyForm;