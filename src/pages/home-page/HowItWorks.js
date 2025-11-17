import React from "react";
import "./HowItWorks.css";

// 👇 استيراد الأيقونات الثلاث
import uploadIcon from "../../assets/images/upload.png";
import aiIcon from "../../assets/images/AI.png";
import getIcon from "../../assets/images/get.png";

function HowItWorks() {
  const steps = [
    {
      icon: uploadIcon, // 👈 استخدام المتغير
      title: "Upload Your Resume",
      desc: "Easily upload your CV in seconds.",
    },
    {
      icon: aiIcon, // 👈 استخدام المتغير
      title: "AI-Powered Watch",
      desc: "Our AI scans your skills and matches you with the best opportunities.",
    },
    {
      icon: getIcon, // 👈 استخدام المتغير
      title: "Get Hired Faster",
      desc: "Connect directly with top companies and land your dream job.",
    },
  ];

  return (
    <section className="how">
      <h2 className="how-title">
        How It Works <br /> With Irshad
      </h2>
      <div className="arrow-bg">
        <div className="how-steps">
          {steps.map((step, index) => (
            <div key={index} className="circle-card">
              <div className="circle">
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