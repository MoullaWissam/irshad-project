// pages/job-seeker/JobsPage.js
import React, { useState } from "react";
import JobCard from "../../components/Card/JobCard/JobCard";
import "./JobsPage.css";

// بيانات الوظائف (من API لاحقًا)
const jobsData = [
  {
    title: "Email Marketing",
    type: "FULL TIME",
    desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
    icon: "/icons/email.png",
  },
  {
    title: "Visual Designer",
    type: "FULL TIME",
    desc: "Design stunning visuals and elevate our brand identity across platforms.",
    icon: "/icons/design.png",
  },
  {
    title: "Data Analyst",
    type: "FULL TIME",
    desc: "Analyze data trends and support decision-making with actionable insights.",
    icon: "/icons/data.png",
  },
  {
    title: "Product Designer",
    type: "FULL TIME",
    desc: "Craft intuitive product experiences and collaborate with cross-functional teams.",
    icon: "/icons/product.png",
  },
  {
    title: "PHP/JS Developer",
    type: "FULL TIME",
    desc: "Build scalable web applications using modern PHP and JavaScript frameworks.",
    icon: "/icons/code.png",
  },
  {
    title: "Plugin Developer",
    type: "FULL TIME",
    desc: "Develop and maintain plugins for our CMS ecosystem.",
    icon: "/icons/plugin.png",
  },
];

function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // تصفية الوظائف حسب البحث
  const filteredJobs = jobsData.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="jobs-page-container">
      {/* عنوان الصفحة */}
      <div className="page-header">
        <h2>Search for <span>Jobs</span></h2>
      </div>

      {/* مربع البحث */}
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search for Jobs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img src="/search.png" alt="Search" className="search-icon-img" />
      </div>

      {/* شبكة عرض الوظائف */}
      <div className="job-grid">
        {filteredJobs.map((job, index) => (
          <JobCard
            key={index}
            icon={job.icon}
            title={job.title}
            desc={job.desc}
            type={job.type}
          />
        ))}
      </div>
    </div>
  );
}

export default JobsPage;