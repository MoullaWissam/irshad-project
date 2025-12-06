// Hero.js - بعد التعديل
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Hero.css";
import heroImage from "../../assets/images/mainHomeImage.png";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-section-text">
        <h1 className="hero-section-title">
          {t("Find Your Future with Irshad")}
        </h1>
        <p className="hero-section-description">
          {t("An AI-driven pathway to professional excellence, connecting talented employees with great companies.")}
        </p>
        <div className="hero-section-buttons">
          <Link to="/register?userType=employee">
            <button className="hero-btn hero-btn-purple">
              {t("I am a job seeker")}
            </button>
          </Link>
          <Link to="/register?userType=company">
            <button className="hero-btn hero-btn-blue">
              {t("I am a company")}
            </button>
          </Link>
        </div>
      </div>

      <div className="hero-section-image">
        <img
          src={heroImage}
          alt="Hero illustration"
          className="hero-section-img"
        />
      </div>
    </section>
  );
}

export default Hero;