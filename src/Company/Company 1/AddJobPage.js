import React from "react";
import JobCard from "../Components/Card/JobCard/JobCard";
import "./AddJobPage.css";

function AddJobPage() {
  const jobs = [
    {
      icon: "/icon/Telegram.png",
      title: "Product Designer",
      desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Spotify.png",
      title: "Product Designer",
      desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
      type: "FULL TIME",
    },
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
      icon: "/icon/Telegram.png",
      title: "Product Designer",
      desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
      type: "FULL TIME",
    },
    {
      icon: "/icon/Spotify.png",
      title: "Product Designer",
      desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
      type: "FULL TIME",
    },
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
    // أضف المزيد حسب الحاجة
  ];

  const handleAddClick = () => {
    console.log("Open Add Job Form");
    // ممكن تفتح مودال أو تنتقل لصفحة جديدة
  };

  return (
    <div className="add-job-page">
      <h2 className="page-title">Add new Job application</h2>

      <div className="job-grid">
        {/* بطاقة الإضافة */}
        <div className="add-card" onClick={handleAddClick}>
          <span className="plus-icon">＋</span>
          <p>Add new job</p>
        </div>

        {/* بطاقات الوظائف */}
        {jobs.map((job, index) => (
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

export default AddJobPage;
