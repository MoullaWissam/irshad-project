// AboutPage.js - بعد التعديل

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTranslation } from 'react-i18next'; // 👈 استيراد الخطاف
import './AboutPage.css';

function AboutPage() {
  const { t } = useTranslation(); // 👈 استخدام الخطاف
  
  return (
    <div>
      <Navbar />
      <div className="about-page">
        <section className="page-header">
          {/* العنوان الرئيسي */}
          <h1>{t("About Irshad")}</h1>
          <p className="subtitle">{t("Your AI-driven career companion and recruitment platform")}</p>
        </section>

        <div className="content-container">
          <section className="content-section">
            {/* مهمتنا */}
            <h2>{t("Our Mission")}</h2>
            <p>
              {t("At Irshad, we're revolutionizing the way people find jobs and companies find talent. Our AI-powered platform bridges the gap between skilled professionals and forward-thinking organizations.")}
            </p>
            <p>
              {t("We believe that everyone deserves a fulfilling career and every company deserves the right talent to grow. That's why we've built an intelligent matching system that goes beyond keywords to understand true potential.")}
            </p>
          </section>

          <section className="content-section">
            {/* ماذا نقدم */}
            <h2>{t("What We Do")}</h2>
            <ul className="simple-list">
              <li>{t("AI-powered job matching for precise career placement")}</li>
              <li>{t("Resume analysis and optimization tools")}</li>
              <li>{t("Personalized career guidance and roadmaps")}</li>
              <li>{t("Recruitment solutions for companies")}</li>
              <li>{t("Interview preparation and skill development")}</li>
            </ul>
          </section>

          <section className="content-section">
            {/* قيمنا */}
            <h2>{t("Our Values")}</h2>
            <div className="values-container">
              <div className="value-item">
                <h3>{t("Precision")}</h3>
                <p>{t("Accurate AI matching for better career outcomes")}</p>
              </div>
              <div className="value-item">
                <h3>{t("Efficiency")}</h3>
                <p>{t("Streamlined processes that save time and effort")}</p>
              </div>
              <div className="value-item">
                <h3>{t("Trust")}</h3>
                <p>{t("Transparent and secure platform for all users")}</p>
              </div>
              <div className="value-item">
                <h3>{t("Innovation")}</h3>
                <p>{t("Continuous improvement through technology")}</p>
              </div>
            </div>
          </section>

          <section className="content-section">
            {/* فريقنا */}
            <h2>{t("Our Team")}</h2>
            <p>
              {t("Our team consists of experienced HR professionals, AI experts, and software developers dedicated to creating the best recruitment experience. We combine industry knowledge with cutting-edge technology to deliver exceptional results.")}
            </p>
          </section>

          <section className="content-section stats-section">
            {/* تأثيرنا */}
            <h2>{t("Our Impact")}</h2>
            <div className="stats-container">
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>{t("Successful Matches")}</p>
              </div>
              <div className="stat-item">
                <h3>500+</h3>
                <p>{t("Partner Companies")}</p>
              </div>
              <div className="stat-item">
                <h3>95%</h3>
                <p>{t("Satisfaction Rate")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;