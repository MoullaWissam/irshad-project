// HowItWorks.js - بعد التعديل
import React from "react";
import { useTranslation } from 'react-i18next';
import "./HowItWorks.css";

// 👇 استيراد الأيقونات الثلاث
import uploadIcon from "../../assets/images/upload.png";
import aiIcon from "../../assets/images/AI.png";
import getIcon from "../../assets/images/get.png";

function HowItWorks() {
  const { t } = useTranslation();
  
  // استخدام مفاتيح الترجمة في كائن الخطوات
  const steps = [
    {
      icon: uploadIcon,
      title: t("Upload Your Resume Title"),
      desc: t("Easily upload your CV in seconds."),
    },
    {
      icon: aiIcon,
      title: t("AI-Powered Watch"),
      desc: t("Our AI scans your skills and matches you with the best opportunities."),
    },
    {
      icon: getIcon,
      title: t("Get Hired Faster"),
      desc: t("Connect directly with top companies and land your dream job."),
    },
  ];

  return (
    <section className="hiw-section">
      {/* عنوان القسم */}
      <h2 className="hiw-title">
        {t("How It Works With Irshad")}
      </h2>
      <div className="hiw-arrow-bg">
        <div className="hiw-steps-container">
          {steps.map((step, index) => (
            <div key={index} className="hiw-step-card">
              <div className="hiw-step-number">{index + 1}</div>
              <div className="hiw-step-icon-circle">
                <img src={step.icon} alt={step.title} className="hiw-step-icon" /> 
              </div>  
              <div className="hiw-step-content">
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-description">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;