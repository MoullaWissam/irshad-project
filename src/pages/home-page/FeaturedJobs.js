// FeaturedJobs.js - بعد التعديل

import React from "react";
import JobCard from "../../components/Card/JobCard/JobCard";
import { useTranslation } from 'react-i18next'; // 👈 استيراد الخطاف
import "./FeaturedJobs.css";

// تأكد من أن هذه الأيقونات موجودة في المسار المحدد
// إذا لم تكن موجودة، استخدم أيقونات بديلة أو روابط خارجية
const appStoreIcon = "https://cdn-icons-png.flaticon.com/512/6124/6124997.png";
const figmaIcon = "https://cdn-icons-png.flaticon.com/512/5968/5968705.png";
const pinterestIcon = "https://cdn-icons-png.flaticon.com/512/145/145808.png";
const slackIcon = "https://cdn-icons-png.flaticon.com/512/2111/2111615.png";
const spotifyIcon = "https://cdn-icons-png.flaticon.com/512/174/174872.png";
const searchIcon = "https://cdn-icons-png.flaticon.com/512/482/482631.png";

function FeaturedJobs() {
  const { t } = useTranslation(); // 👈 استخدام الخطاف

  // استخدام مفاتيح الترجمة في كائن الوظائف
  const jobs = [
    {
      icon: appStoreIcon,
      title: t("Email Marketing Specialist"),
      desc: t("Join our team as an Email Marketing specialist and help us reach millions of customers."),
      type: t("FULL TIME"),
    },
    {
      icon: figmaIcon,
      title: t("Visual Designer"),
      desc: t("Work on creative projects for top brands using the latest design tools."),
      type: t("FULL TIME"),
    },
    {
      icon: pinterestIcon,
      title: t("Social Media Manager"),
      desc: t("Manage social media accounts and create engaging content for our community."),
      type: t("PART TIME"),
    },
    {
      icon: slackIcon,
      title: t("Product Manager"),
      desc: t("Lead product development and collaborate with cross-functional teams."),
      type: t("FULL TIME"),
    },
    {
      icon: spotifyIcon,
      title: t("Content Writer"),
      desc: t("Create compelling content for our blog and marketing materials."),
      type: t("FREELANCE"),
    },
    {
      icon: searchIcon,
      title: t("Data Analyst"),
      desc: t("Analyze user data and provide insights to drive business decisions."),
      type: t("FULL TIME"),
    },
  ];

  return (
    <section className="featured">
      <h2 className="featured-title">
        {/* عنوان القسم */}
        {t("Featured Jobs Title")} 
      </h2>
      <div className="jobs-grid">
        {jobs.map((job, index) => (
          <JobCard 
            key={index} 
            icon={job.icon}
            title={job.title} // يستخدم النص المترجم بالفعل من كائن الوظيفة
            desc={job.desc} // يستخدم النص المترجم بالفعل من كائن الوظيفة
            type={job.type} // يستخدم النص المترجم بالفعل من كائن الوظيفة
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;