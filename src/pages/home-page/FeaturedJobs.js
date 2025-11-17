import React from "react";
// تأكد من المسار الصحيح للمكون (عدلنا المسار هنا)
import JobCard from "../../components/Card/JobCard/JobCard"; 
import "./FeaturedJobs.css";

// 👇 استيراد أيقونات الوظائف
import appStore from "../../assets/icons/App store.png";
import figma from "../../assets/icons/Figma.png";
import pinterest from "../../assets/icons/Pinterest.png";
import searchIcon from "../../assets/icons/search.png"; // تأكد من الاسم في المجلد
import slack from "../../assets/icons/Slack.png";
import spotify from "../../assets/icons/Spotify.png";
// ... استورد الباقي بنفس الطريقة

function FeaturedJobs() {
  const jobs = [
    {
      icon: appStore, // 👈 استخدام المتغير
      title: "Email Marketing",
      desc: "Join our team...",
      type: "FULL TIME",
    },
    {
      icon: figma,
      title: "Visual Designer",
      desc: "Work on creative projects...",
      type: "FULL TIME",
    },
    // ... قم بتحديث باقي العناصر في المصفوفة بنفس الطريقة
  ];

  return (
    <section className="featured">
      <h2 className="featured-title">
        Featured <span>Jobs</span>
      </h2>
      <div className="jobs-grid">
        {jobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;