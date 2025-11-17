import React from "react";
import JobCard from "./JobCard";
import "./JobList.css";

function JobList({ jobs }) {
  // ترتيب تنازلي حسب الرانك
  const sortedJobs = [...jobs].sort((a, b) => b.rank - a.rank);

  return (
    <div className="job-list-container">
      <h2 className="job-list-title">Best Matched Jobs</h2>
      <div className="job-grid">
        {sortedJobs.map((job, index) => (
          <JobCard
            key={job.id}
            icon={job.icon}
            title={job.title}
            desc={job.desc}
            type={job.type}
            highlight={index < 3} // أول 3 وظائف
          />
        ))}
      </div>
    </div>
  );
}

export default JobList;
