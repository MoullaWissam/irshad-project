/**
 * TipsSection Component
 * مكون يعرض قائمة النصائح داخل مستطيلات متناسقة بإطار متدرج
 */

import React from "react";
import checkicon from "../../assets/icons/check.svg"
import { useTranslation } from 'react-i18next'; // أضف هذا الاستيراد

const TipsSection = () => {
  const { t } = useTranslation(); // أضف هذا

  const tips = [
    t("Keep it updated and include your latest jobs and skills"),
    t("Add your details: Career Objective, Work Experience, Education, Skills, Certifications, Projects"),
    t("Use simple formatting, plain text, and clear headings"),
    t("Highlight your skills — they help AI match the right jobs"),
    t("Review the recommended jobs and tips"),
  ];

  return (
    <div className="upload-resume-tips-box">
      <h4>{t("Tips to Improve Your AI Experience")}</h4>

      {/* قائمة النصائح */}
      <ul>
        {tips.map((text, index) => (
          <li
            className="upload-resume-tip-card"
            key={index}
            style={{ display: "inline-flex" }}
          >
            <img src={checkicon} alt="icon" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipsSection;