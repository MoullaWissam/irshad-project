/**
 * Home Page Component
 * مسؤول عن عرض الوظائف المطابقة للمستخدم مع ترتيبها حسب الرانك
 */

import React from "react";
import JobCard from "../../components/Card/JobCard/JobCard";
import RankedCardWrapper from "./RankedCardWrapper";
import "./MatchesPage.css";

// قائمة الوظائف (بيانات ثابتة مؤقتًا)
const jobs = [
  {
    title: "Email Marketing",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/email.png",
  },
  {
    title: "Visual Designer",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/design.png",
  },
  {
    title: "Data Analyst",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/data.png",
  },
  {
    title: "Product Designer",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/product.png",
  },
  {
    title: "PHP/JS Developer",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/code.png",
  },
  {
    title: "Plugin Developer",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/plugin.png",
  },
];

function Home() {
  return (
    <div className="home-container">
      {/* عنوان الصفحة */}
      <h2>
        Best Matched <span>Jobs</span>
      </h2>

      {/* شبكة عرض الوظائف */}
      <div className="job-grid">
        {jobs.map((job, index) => (
          // تغليف البطاقة بوسام الترتيب حسب الرانك
          <RankedCardWrapper key={job.id} rank={index + 1}>
            {/* إضافة class للبطاقة حسب الرانك */}
            <div className={`job-card-wrapper rank-${index + 1}`}>
              {/* عرض بطاقة الوظيفة */}
              <JobCard
                icon={job.icon}
                title={job.title}
                desc={job.desc}
                type={job.type}
              />
            </div>
          </RankedCardWrapper>
        ))}
      </div>
    </div>
  );
}

export default Home;
