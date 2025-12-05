import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApplicantCard from "../../Components/Card/ApplicantCard/ApplicantCard";
import "./ApplicantsGrid.css";

function ApplicantsGrid() {
  const location = useLocation();
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  // بيانات المتقدمين - يمكن جلبها من API لاحقاً
  const allApplicants = [
    {
      id: 1,
      name: "Ali",
      description: "3 years experience in React",
      avatar: "/avatars/ali.png",
      rank: 1,
      job: "Frontend Developer",
      status: "new",
    },
    {
      id: 2,
      name: "Sara",
      description: "Frontend specialist with Vue.js",
      avatar: "/avatars/sara.png",
      rank: 2,
      job: "Frontend Developer",
      status: "reviewed",
    },
    {
      id: 3,
      name: "Omar",
      description: "Backend developer with Node.js",
      avatar: "/avatars/omar.png",
      rank: 3,
      job: "Backend Developer",
      status: "new",
    },
    {
      id: 4,
      name: "Lina",
      description: "UI/UX Designer with Figma expertise",
      avatar: "/avatars/lina.png",
      rank: 4,
      job: "UI/UX Designer",
      status: "reviewed",
    },
  ];

  // بيانات الوظائف
  const jobs = [
    { id: 1, title: "Frontend Developer" },
    { id: 2, title: "Backend Developer" },
    { id: 3, title: "UI/UX Designer" },
    { id: 4, title: "Project Manager" },
  ];

  useEffect(() => {
    // تصفية المتقدمين حسب المسار الحالي
    const path = location.pathname;
    
    if (path.includes("/company/applicants/all")) {
      setApplicants(allApplicants);
    } else if (path.includes("/company/applicants/new")) {
      setApplicants(allApplicants.filter(app => app.status === "new"));
    } else if (path.includes("/company/applicants/reviewed")) {
      setApplicants(allApplicants.filter(app => app.status === "reviewed"));
    } else if (path.includes("/company/my-jobs")) {
      // في صفحة My Jobs، نعرض جميع المتقدمين أو ننتظر اختيار وظيفة
      setApplicants(allApplicants);
      setSelectedJob(jobs[0]?.title || "");
    } else {
      setApplicants(allApplicants);
    }
  }, [location.pathname]);

  const handleJobChange = (jobTitle) => {
    setSelectedJob(jobTitle);
    if (jobTitle) {
      setApplicants(allApplicants.filter(app => app.job === jobTitle));
    } else {
      setApplicants(allApplicants);
    }
  };

  return (
    <div className="applicants-grid-container">
      {/* في صفحة My Jobs، نعرض dropdown لاختيار الوظيفة */}
      {location.pathname.includes("/company/my-jobs") && (
        <div className="job-selector-section">
          <h3>Select Job to View Applicants</h3>
          <select 
            className="job-dropdown"
            value={selectedJob}
            onChange={(e) => handleJobChange(e.target.value)}
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.title}>
                {job.title}
              </option>
            ))}
          </select>
          {selectedJob && (
            <p className="selected-job-info">
              Showing applicants for: <strong>{selectedJob}</strong>
            </p>
          )}
        </div>
      )}
      
      <div className="applicants-grid">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicantCard key={applicant.id} {...applicant} />
          ))
        ) : (
          <div className="no-applicants">
            <p>No applicants found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantsGrid;