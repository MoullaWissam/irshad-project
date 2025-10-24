import React from "react";
import "./JobCard.css";

function JobCard({ icon, title, desc, type }) {
  return (
    <div className="job-card">
      <div className="job-header">
        <img src={icon} alt={title} className="job-icon" />
        <span className="job-type">{type}</span>
      </div>
      <h3 className="job-title">{title}</h3>
      <p className="job-desc">{desc}</p>
      <a href="#" className="job-link">
        More Details ↗
      </a>
    </div>
  );
}

export default JobCard;
