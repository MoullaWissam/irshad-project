/**
 * TipsSection Component
 * مكون يعرض قائمة النصائح داخل مستطيلات متناسقة بإطار متدرج
 */

import React from "react";

const tips = [
  "Keep it updated and include your latest jobs and skills",
  "Add your details: Career Objective, Work Experience, Education, Skills, Certifications, Projects",
  "Use simple formatting, plain text, and clear headings",
  "Highlight your skills — they help AI match the right jobs",
  "Review the recommended jobs and tips",
];

const TipsSection = () => {
  return (
    <div className="tips-box">
      <h4>Tips to Improve Your AI Experience</h4>

      {/* قائمة النصائح */}
      <ul>
        {tips.map((text, index) => (
          <li
            className="tip-card"
            key={index}
            style={{ display: "inline-flex" }}
          >
            <img src="/Vector.png" alt="icon" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipsSection;
