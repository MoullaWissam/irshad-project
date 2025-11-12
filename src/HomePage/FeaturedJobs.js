/**
 * FeaturedJobs Component
 * قسم عرض الوظائف المميزة في الصفحة الرئيسية
 * يعرض مجموعة من البطاقات باستخدام مكون JobCard
 */

import React from "react";
import JobCard from "../Components/Card/JobCard/JobCard";
import "./FeaturedJobs.css";

function FeaturedJobs() {
  // قائمة الوظائف المميزة مع الأيقونة والعنوان والوصف ونوع الوظيفة
  const jobs = [
    {
      icon: "/icon/App store.png",
      title: "Email Marketing",
      desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Figma.png",
      title: "Visual Designer",
      desc: "Work on creative projects to design amazing visuals and experiences.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Pinterest.png",
      title: "Data Analyst",
      desc: "Analyze data and generate insights to support business decisions.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Search.png",
      title: "Content Writer",
      desc: "Create engaging content for our platforms and campaigns.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Slack.png",
      title: "Product Designer",
      desc: "Design digital products and improve user experiences.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Spotify.png",
      title: "PHP/JS Developer",
      desc: "Develop scalable applications using PHP and JavaScript.",
      type: "FULL TIME",
    },
  ];

  // عرض القسم مع العنوان وشبكة البطاقات
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
