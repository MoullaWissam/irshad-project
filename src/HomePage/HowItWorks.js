import React from "react";
import "./HowItWorks.css";

// مكوّن قسم "How It Works" – يوضح الخطوات الرئيسية
function HowItWorks() {
  // مصفوفة خطوات (الأيقونة + العنوان + الوصف)
  const steps = [
    {
      icon: "/upload.png",
      title: "Upload Your Resume",
      desc: "Easily upload your CV in seconds.",
    },
    {
      icon: "/AI.png",
      title: "AI-Powered Watch",
      desc: "Our AI scans your skills and matches you with the best opportunities.",
    },
    {
      icon: "/get.png",
      title: "Get Hired Faster",
      desc: "Connect directly with top companies and land your dream job.",
    },
  ];

  return (
    <section className="how">
      {/* عنوان القسم */}
      <h2 className="how-title">
        How It Works <br /> With Irshad
      </h2>

      {/* خلفية السهم + الخطوات */}
      <div className="arrow-bg">
        <div className="how-steps">
          {steps.map((step, index) => (
            <div key={index} className="circle-card">
              {/* الدائرة + الأيقونة */}
              <div className="circle">
                <img src={step.icon} alt={step.title} />
              </div>

              {/* النصوص (العنوان + الوصف) */}
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
