import React, { useState, useEffect } from "react";
import JobCard from "../../../Components/Card/JobCard/JobCard";
import "./AddJobPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyJobs } from "../../../services/api"; // سنقوم بإنشاء هذا الملف

function AddJobPage() {
  const { companyId } = useParams(); // الحصول على companyId من URL
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyId]);

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const response = await getCompanyJobs(companyId);
      setJobs(response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching company jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    navigate(`/company/${companyId}/add-job`); // إضافة companyId في المسار
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/company/${companyId}/job/${jobId}/details`);
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="add-job-page">
      <h2 className="page-title">Your Company Jobs</h2>
      <p className="page-subtitle">Manage and track your job postings</p>

      <div className="job-stats">
        <div className="stat-card">
          <span className="stat-number">{jobs.length}</span>
          <span className="stat-label">Total Jobs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {jobs.filter(job => job.hasTest).length}
          </span>
          <span className="stat-label">With Screening Test</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
          </span>
          <span className="stat-label">Total Applications</span>
        </div>
      </div>

      <div className="job-grid">
        {/* بطاقة الإضافة */}
        <div className="add-card" onClick={handleAddClick}>
          <div className="add-card-content">
            <span className="plus-icon">＋</span>
            <h3>Add New Job</h3>
            <p>Create a new job posting with optional screening test</p>
          </div>
        </div>

        {/* بطاقات الوظائف */}
        {jobs.map((job) => (
          <div key={job.id} onClick={() => handleViewJobDetails(job.id)} className="job-card-wrapper">
            <JobCard
              icon={job.image || "/default-job-icon.png"}
              title={job.title}
              desc={job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
              type={job.employmentType || "FULL-TIME"}
              location={job.location}
              skills={job.requiredSkills?.slice(0, 3) || []}
              hasTest={job.hasTest}
              createdAt={new Date(job.createdAt).toLocaleDateString()}
            />
            
            <div className="job-actions">
              <button 
                className="view-applicants-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/company/${companyId}/job/${job.id}/applicants`);
                }}
              >
                View Applicants ({job.applications?.length || 0})
              </button>
              <button 
                className="view-test-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (job.hasTest) {
                    navigate(`/company/${companyId}/job/${job.id}/test-results`);
                  }
                }}
                disabled={!job.hasTest}
              >
                {job.hasTest ? "View Test Results" : "No Test"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddJobPage;