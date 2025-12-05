import React, { useState, useEffect } from "react";
import JobCard from "../../../Components/Card/JobCard/JobCard";
import "./AddJobPage.css";
import { useNavigate } from "react-router-dom";

function AddJobPage() {
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
          setError("User data is missing ID. Please login again.");
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Failed to parse user data. Please login again.");
      }
    } else {
      console.error("No user data found in localStorage");
      setError("No user data found. Please login first.");
    }
  }, []);

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
        setError("No authentication token found. Please login again.");
        setLoading(false);
      }
    }
  }, [companyId]);

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
          throw new Error("Unauthorized. Please login again.");
        }
        if (response.status === 404) {
          throw new Error(`Company with ID ${id} not found.`);
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}. ${errorText}`);
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
      setError(err.message || "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (companyId) {
      navigate(`/company/${companyId}/add-job`);
    } else {
      alert("Please login first");
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
            alert("Token missing. Please login again.");
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
    if (!description) return "No description available";
    const maxLength = 120;
    return description.length > maxLength 
      ? `${description.substring(0, maxLength)}...` 
      : description;
  };

  const getJobTypeDisplay = (employmentType) => {
    if (!employmentType) return "Full-time";
    switch(employmentType.toLowerCase()) {
      case 'part-time': return 'Part-time';
      case 'full-time': return 'Full-time';
      case 'on-site': return 'On-site';
      case 'remote': return 'Remote';
      default: return employmentType;
    }
  };

  if (loading) {
    return (
      <div className="add-job-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-job-page">
        <div className="error-state">
          <h3>❌ Error Loading Jobs</h3>
          <p>{error}</p>
          <p className="debug-info">
            Company ID: {companyId || "Not found"}<br/>
            Token: {getTokenFromCookies() ? "Found" : "Not found"}<br/>
            User Data: {localStorage.getItem("user") ? "Exists" : "Not found"}
          </p>
          <button className="retry-button" onClick={handleRetry}>
            Try Again
          </button>
          <button 
            className="login-button" 
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-job-page">
      <header className="page-header">
        <h1 className="page-title">📋 Your Company Jobs</h1>
        <p className="page-subtitle">Manage and track all your job postings in one place</p>
        <p className="company-info">
          Company ID: <strong>{companyId}</strong> | 
          Total Jobs: <strong>{jobs.length}</strong>
        </p>
      </header>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number">{jobs.length}</span>
          <span className="stat-label">Total Jobs</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {jobs.filter(job => job.questions?.length > 0).length}
          </span>
          <span className="stat-label">With Screening Test</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {jobs.filter(job => job.image).length}
          </span>
          <span className="stat-label">With Images</span>
        </div>
      </div>

      {/* Add Job Button */}
      <div className="add-job-section">
        <button className="add-job-button" onClick={handleAddClick}>
          <span className="button-icon">+</span>
          <div className="button-text">
            <span className="button-main-text">Add New Job</span>
            <span className="button-sub-text">Create a new job posting with optional screening test</span>
          </div>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-container">
        <h2 className="section-title">Your Job Postings ({jobs.length})</h2>
        
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Jobs Yet</h3>
            <p>You haven't created any job postings yet. Start by creating your first job!</p>
            <button className="create-first-job" onClick={handleAddClick}>
              Create Your First Job
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {/* Add Job Card */}
            <div className="add-card-container" onClick={handleAddClick}>
              <div className="add-card-content">
                <div className="add-icon">+</div>
                <h3>Add New Job</h3>
                <p>Create a new job posting with optional screening test</p>
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
                  <span className="job-location">📍 {job.location || "Not specified"}</span>
                  {job.hasQuestions && (
                    <span className="has-test-badge">🧪 Has Test</span>
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