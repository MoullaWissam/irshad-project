/**
 * TipsSection Component
 * مكون يعرض قائمة النصائح داخل مستطيلات متناسقة بإطار متدرج
 */

import React from "react";
import checkicon from "../../assets/icons/check.svg"

const tips = [
  "Keep it updated and include your latest jobs and skills",
  "Add your details: Career Objective, Work Experience, Education, Skills, Certifications, Projects",
  "Use simple formatting, plain text, and clear headings",
  "Highlight your skills — they help AI match the right jobs",
  "Review the recommended jobs and tips",
];

const TipsSection = () => {
  return (
    <div className="upload-resume-tips-box">
      <h4>Tips to Improve Your AI Experience</h4>

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