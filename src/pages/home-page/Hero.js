// Hero.js - بعد التعديل

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // 👈 استيراد الخطاف
import "./Hero.css";
import heroImage from "../../assets/images/mainHomeImage.png";

function Hero() {
  const { t } = useTranslation(); // 👈 استخدام الخطاف

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          {/* النص الرئيسي */}
          {t("Find Your Future with Irshad")} 
        </h1>
        <p>
          {/* الوصف */}
          {t("An AI-driven pathway to professional excellence, connecting talented employees with great companies.")}
        </p>
        <div className="hero-buttons">
          <Link to="/register?userType=employee">
            <button className="btn btn-purple">
              {/* زر الباحث عن عمل */}
              {t("I am a job seeker")}
            </button>
          </Link>
          <Link to="/register?userType=company">
            <button className="btn btn-blue">
              {/* زر الشركة */}
              {t("I am a company")}
            </button>
          </Link>
        </div>
      </div>

      <div className="hero-image">
        <img
          src={heroImage}
          alt="Hero illustration"
          className="hero-img"
        />
      </div>
    </section>
  );
}

export default Hero;