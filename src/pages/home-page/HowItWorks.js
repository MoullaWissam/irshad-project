// HowItWorks.js - بعد التعديل

import React from "react";
import { useTranslation } from 'react-i18next'; // 👈 استيراد الخطاف
import "./HowItWorks.css";

// 👇 استيراد الأيقونات الثلاث
import uploadIcon from "../../assets/images/upload.png";
import aiIcon from "../../assets/images/AI.png";
import getIcon from "../../assets/images/get.png";

function HowItWorks() {
  const { t } = useTranslation(); // 👈 استخدام الخطاف
  
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
    <section className="how">
      {/* عنوان القسم */}
      <h2 className="how-title">
        {t("How It Works With Irshad")}
      </h2>
      <div className="arrow-bg">
        <div className="how-steps">
          {steps.map((step, index) => (
            <div key={index} className="circle-card">
              <div className="circle">
                {/* استخدام step.title المترجم لـ alt */}
                <img src={step.icon} alt={step.title} /> 
              </div>
              <div className="text">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;