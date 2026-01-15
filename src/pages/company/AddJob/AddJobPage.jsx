import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import JobCard from "../../../Components/Card/JobCard/JobCard";
import "./AddJobPage.css";
import { useNavigate } from "react-router-dom";

function AddJobPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const isRTL = i18n.language === 'ar';

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
          setCompanyName(parsedUser.companyName || parsedUser.name || "");
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
        `https://irshad-ovo6.onrender.com/company-management/${id}/jobs`,
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
      
      // ✅ تحويل البيانات إلى نفس تنسيق واجهة الباحث عن العمل
      const processedJobs = jobsData.map(job => ({
        id: job.id || Date.now() + Math.random(),
        title: job.title || t("Untitled Job"),
        type: job.employmentType ? job.employmentType.toUpperCase() : t("FULL TIME"),
        desc: job.description || t("No description available"),
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        company: String(companyName || job.companyName || (job.company && job.company.companyName) || t("Your Company")),
        location: String(job.location || t("Location not specified")),
        salary: String(job.salary || t("Salary not specified")),
        skills: job.skills || (job.requiredSkills && (Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : String(job.requiredSkills))) || t("Not specified"),
        experience: String(job.experience || job.requiredExperience || t("Not specified")),
        education: String(job.education || job.requiredEducation || t("Not specified")),
        originalJob: job,
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

  if (loading) {
    return (
      <div className="company-jobs-page" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="company-jobs-loading">
          <div className="company-jobs-spinner"></div>
          <p>{t("Loading your jobs...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-jobs-page" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="company-jobs-error">
          <h3>{t("Error Loading Jobs")}</h3>
          <p>{error}</p>
          <p className="company-jobs-debug">
            {t("Company ID:")} {companyId || t("Not found")}<br/>
            {t("Token:")} {getTokenFromCookies() ? t("Found") : t("Not found")}<br/>
            {t("User Data:")} {localStorage.getItem("user") ? t("Exists") : t("Not found")}
          </p>
          <div className="company-jobs-error-buttons">
            <button className="company-jobs-retry" onClick={handleRetry}>
              {t("Try Again")}
            </button>
            <button 
              className="company-jobs-login" 
              onClick={() => navigate("/login")}
            >
              {t("Go to Login")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-jobs-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="company-jobs-header">
        <h1 className="company-jobs-title">📋 {t("Your Company Jobs")}</h1>
        <p className="company-jobs-subtitle">{t("Manage and track all your job postings in one place")}</p>
        <p className="company-jobs-info">
          {t("Company:")} <strong>{companyName}</strong> | 
          {t("Total Jobs:")} <strong>{jobs.length}</strong>
        </p>
      </header>

      {/* Statistics */}
      <div className="company-jobs-stats">
        <div className="company-jobs-stat">
          <span className="company-jobs-stat-number">{jobs.length}</span>
          <span className="company-jobs-stat-label">{t("Total Jobs")}</span>
        </div>
        <div className="company-jobs-stat">
          <span className="company-jobs-stat-number">
            {jobs.filter(job => job.hasQuestions).length}
          </span>
          <span className="company-jobs-stat-label">{t("With Screening Test")}</span>
        </div>
        <div className="company-jobs-stat">
          <span className="company-jobs-stat-number">
            {jobs.filter(job => job.icon && job.icon !== "https://cdn-icons-png.flaticon.com/512/3067/3067256.png").length}
          </span>
          <span className="company-jobs-stat-label">{t("With Images")}</span>
        </div>
      </div>

      {/* Add Job Button */}
      <div className="company-jobs-add-section">
        <button className="company-jobs-add-button" onClick={handleAddClick}>
          <span className="company-jobs-add-icon">+</span>
          <div className="company-jobs-add-text">
            <span className="company-jobs-add-main">{t("Add New Job")}</span>
            <span className="company-jobs-add-sub">{t("Create a new job posting with optional screening test")}</span>
          </div>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="company-jobs-container">
        <h2 className="company-jobs-section-title">{t("Your Job Postings")} ({jobs.length})</h2>
        
        {jobs.length === 0 ? (
          <div className="company-jobs-empty">
            <div className="company-jobs-empty-icon">📭</div>
            <h3>{t("No Jobs Yet")}</h3>
            <p>{t("You haven't created any job postings yet. Start by creating your first job!")}</p>
            <button className="company-jobs-empty-button" onClick={handleAddClick}>
              {t("Create Your First Job")}
            </button>
          </div>
        ) : (
          <div className="company-jobs-grid">
            {/* Add Job Card */}
            <div className="company-jobs-add-card" onClick={handleAddClick}>
              <div className="company-jobs-add-card-content">
                <div className="company-jobs-plus-icon">+</div>
                <h3>{t("Add New Job")}</h3>
                <p>{t("Create a new job posting with optional screening test")}</p>
              </div>
            </div>

            {/* Job Cards */}
            {jobs.map((job) => {
              if (!job || !job.id) {
                console.warn("Invalid job data:", job);
                return null;
              }
              
              return (
                <div 
                  key={job.id} 
                  className="company-jobs-card-wrapper"
                  onClick={() => handleViewJobDetails(job.id)}
                >
                  <JobCard
                    id={job.id}
                    icon={job.icon}
                    title={job.title}
                    desc={job.desc}
                    type={job.type}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    skills={job.skills}
                    experience={job.experience}
                    education={job.education}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddJobPage;