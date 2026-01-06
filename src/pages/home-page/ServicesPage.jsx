// ServicesPage.js - بعد التعديل

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTranslation } from 'react-i18next'; // 👈 استيراد الخطاف
import './ServicesPage.css';

function ServicesPage() {
  const { t } = useTranslation(); // 👈 استخدام الخطاف

  // استخدام مفاتيح الترجمة في كائن الخدمات
  const services = [
    {
      id: 1,
      title: t('AI Job Matching'),
      description: t('Our advanced AI algorithms analyze your skills and match you with the perfect job opportunities based on compatibility, culture fit, and career growth.'),
    },
    {
      id: 2,
      title: t('Resume Analysis & Optimization'),
      description: t('Get detailed feedback on your resume with AI-powered suggestions to improve formatting, keywords, and content for better visibility.'),
    },
    {
      id: 3,
      title: t('Career Guidance'),
      description: t('Personalized career advice and roadmaps based on your skills, interests, and market demand.'),
    },
    {
      id: 4,
      title: t('Company Recruitment Solutions'),
      description: t('For employers: AI-powered candidate screening, automated scheduling, and analytics dashboard.'),
    },
    {
      id: 5,
      title: t('Interview Preparation'),
      description: t('Mock interviews with AI feedback, common questions, and industry-specific preparation.'),
    },
    {
      id: 6,
      title: t('Skill Development'),
      description: t('Recommended courses and learning paths to bridge skill gaps and enhance employability.'),
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="services-page">
        <section className="page-header">
          {/* عنوان الصفحة */}
          <h1>{t("Our Services")}</h1>
          <p className="subtitle">{t("Discover how Irshad can help you advance your career or find the perfect talent")}</p>
        </section>

        <div className="content-container">
          <section className="intro-section">
            <p>
              {t("We offer a comprehensive suite of services designed to connect talent with opportunity. Whether you're looking for your next career move or searching for the perfect candidate, our AI-driven solutions make the process efficient and effective.")}
            </p>
          </section>

          <div className="services-grid">
            {services.map(service => (
              <div className="service-item" key={service.id}>
                <div className="service-number">{service.id}</div>
                {/* استخدام النصوص المترجمة من الكائن */}
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>

          <section className="cta-section">
            {/* قسم الدعوة للعمل */}
            <h2>{t("Ready to Get Started?")}</h2>
            <p>{t("Choose the service that fits your needs and begin your journey today")}</p>
            <div className="cta-buttons">
              <a href="/register" className="cta-button seeker">{t("Join as Job Seeker")}</a>
              <a href="/register" className="cta-button company">{t("Join as Company")}</a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ServicesPage;