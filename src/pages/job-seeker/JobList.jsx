import React from "react";
import JobCard from "./JobCard";
import "./JobList.css";
import { useTranslation } from 'react-i18next';

function JobList({ jobs }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // ترتيب تنازلي حسب الرانك
  const sortedJobs = [...jobs].sort((a, b) => b.rank - a.rank);

  // نمط خط Roboto
  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  return (
    <div 
      className="job-list-container" 
      dir={isRTL ? 'rtl' : 'ltr'} 
      style={robotoStyle}
    >
      <h2 
        className="job-list-title"
        style={{ textAlign: isRTL ? 'right' : 'left' }}
      >
        {t("Best Matched Jobs")}
      </h2>
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