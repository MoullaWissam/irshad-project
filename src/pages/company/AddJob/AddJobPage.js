import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import JobCard from "../../../Components/Card/JobCard/JobCard";
import "./AddJobPage.css";
import { useNavigate } from "react-router-dom";

function AddJobPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  // ✅ جلب user data من localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("Raw user data from localStorage:", userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser);
        
        if (parsedUser && parsedUser.id) {
          setCompanyId(parsedUser.id);
          console.log("Company ID set:", parsedUser.id);
        } else {
          console.error("User data doesn't contain id:", parsedUser);
          setError(t("User data is missing ID. Please login again."));
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError(t("Failed to parse user data. Please login again."));
      }
    } else {
      console.error("No user data found in localStorage");
      setError(t("No user data found. Please login first."));
    }
  }, [t]);

  // ✅ جلب token من cookies
  const getTokenFromCookies = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    const token = match ? match[2] : null;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    return token;
  };

  useEffect(() => {
    if (companyId) {
      const token = getTokenFromCookies();
      if (token) {
        fetchCompanyJobs(companyId, token);
      } else {
        setError(t("No authentication token found. Please login again."));
        setLoading(false);
      }
    }
  }, [companyId, t]);

  const fetchCompanyJobs = async (id, token) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching jobs for company ID: ${id} with token: ${token.substring(0, 20)}...`);
      
      const response = await fetch(
        `http://localhost:3000/company-management/${id}/jobs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t("Unauthorized. Please login again."));
        }
        if (response.status === 404) {
          throw new Error(t("Company with ID {id} not found.", { id: id }));
        }
        const errorText = await response.text();
        throw new Error(`${t("Failed to fetch jobs:")} ${response.status} ${response.statusText}. ${errorText}`);
      }

      const jobsData = await response.json();
      console.log("Jobs data received:", jobsData);
      
      // معالجة البيانات للفرونت
      const processedJobs = jobsData.map(job => ({
        ...job,
        hasQuestions: job.questions && job.questions.length > 0,
        formattedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : "N/A"
      }));
      
      setJobs(processedJobs);
    } catch (err) {
      console.error("Error fetching company jobs:", err);
      setError(err.message || t("Failed to load jobs. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (companyId) {
      navigate(`/company/${companyId}/add-job`);
    } else {
      alert(t("Please login first"));
    }
  };

  const handleViewJobDetails = (jobId) => {
    if (companyId && jobId) {
      navigate(`/company/${companyId}/job/${jobId}/details`);
    }
  };

  const handleRetry = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.id) {
          const token = getTokenFromCookies();
          if (token) {
            fetchCompanyJobs(parsedUser.id, token);
          } else {
            alert(t("Token missing. Please login again."));
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Error parsing user data on retry:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const truncateDescription = (description) => {
    if (!description) return t("No description available");
    const maxLength = 120;
    return description.length > maxLength 
      ? `${description.substring(0, maxLength)}...` 
      : description;
  };

  const getJobTypeDisplay = (employmentType) => {
    if (!employmentType) return t("Full-time");
    switch(employmentType.toLowerCase()) {
      case 'part-time': return t('Part-time');
      case 'full-time': return t('Full-time');
      case 'on-site': return t('On-site');
      case 'remote': return t('Remote');
      default: return employmentType;
    }
  };

  if (loading) {
    return (
      <div className="add-job-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t("Loading your jobs...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-job-page">
        <div className="error-state">
          <h3>❌ {t("Error Loading Jobs")}</h3>
          <p>{error}</p>
          <p className="debug-info">
            {t("Company ID:")} {companyId || t("Not found")}<br/>
            {t("Token:")} {getTokenFromCookies() ? t("Found") : t("Not found")}<br/>
            {t("User Data:")} {localStorage.getItem("user") ? t("Exists") : t("Not found")}
          </p>
          <button className="retry-button" onClick={handleRetry}>
            {t("Try Again")}
          </button>
          <button 
            className="login-button" 
            onClick={() => navigate("/login")}
          >
            {t("Go to Login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-job-page">
      <header className="page-header">
        <h1 className="page-title">📋 {t("Your Company Jobs")}</h1>
        <p className="page-subtitle">{t("Manage and track all your job postings in one place")}</p>
        <p className="company-info">
          {t("Company ID:")} <strong>{companyId}</strong> | 
          {t("Total Jobs:")} <strong>{jobs.length}</strong>
        </p>
      </header>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number">{jobs.length}</span>
          <span className="stat-label">{t("Total Jobs")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {jobs.filter(job => job.questions?.length > 0).length}
          </span>
          <span className="stat-label">{t("With Screening Test")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {jobs.filter(job => job.image).length}
          </span>
          <span className="stat-label">{t("With Images")}</span>
        </div>
      </div>

      {/* Add Job Button */}
      <div className="add-job-section">
        <button className="add-job-button" onClick={handleAddClick}>
          <span className="button-icon">+</span>
          <div className="button-text">
            <span className="button-main-text">{t("Add New Job")}</span>
            <span className="button-sub-text">{t("Create a new job posting with optional screening test")}</span>
          </div>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-container">
        <h2 className="section-title">{t("Your Job Postings")} ({jobs.length})</h2>
        
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>{t("No Jobs Yet")}</h3>
            <p>{t("You haven't created any job postings yet. Start by creating your first job!")}</p>
            <button className="create-first-job" onClick={handleAddClick}>
              {t("Create Your First Job")}
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {/* Add Job Card */}
            <div className="add-card-container" onClick={handleAddClick}>
              <div className="add-card-content">
                <div className="add-icon">+</div>
                <h3>{t("Add New Job")}</h3>
                <p>{t("Create a new job posting with optional screening test")}</p>
              </div>
            </div>

            {/* Job Cards */}
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="job-card-container"
                onClick={() => handleViewJobDetails(job.id)}
              >
                <JobCard
                  id={job.id}
                  icon={job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"}
                  title={job.title || "Untitled Job"}
                  desc={truncateDescription(job.description)}
                  type={getJobTypeDisplay(job.employmentType)}
                />
                
                {/* Additional Job Info */}
                <div className="job-extra-info">
                  <span className="job-location">📍 {job.location || t("Not specified")}</span>
                  {job.hasQuestions && (
                    <span className="has-test-badge">🧪 {t("Has Test")}</span>
                  )}
                  <span className="job-date">📅 {job.formattedDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddJobPage;