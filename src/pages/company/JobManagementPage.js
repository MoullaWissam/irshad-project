import React, { useState, useEffect } from "react";
import JobCard from "../../Components/Card/JobCard/JobCard.js";
import "./JobManagementPage.css";
import { useNavigate } from "react-router-dom";

function JobManagementPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ جلب بيانات الشركة من localStorage
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب بيانات المستخدم من localStorage
        const companyData = localStorage.getItem("companyData");
        if (!companyData) {
          throw new Error("No company data found. Please login first.");
        }

        const company = JSON.parse(companyData);
        if (!company || !company.id) {
          throw new Error("Invalid company data. Please login again.");
        }

        const companyId = company.id;
        console.log("Company ID:", companyId);

        // جلب الوظائف من الـ API
        const response = await fetch(
          `http://localhost:3000/company-management/${companyId}/jobs`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized. Please login again.");
          }
          if (response.status === 404) {
            throw new Error(`Company with ID ${companyId} not found.`);
          }
          throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
        }

        const jobsData = await response.json();
        console.log("Jobs data received:", jobsData);

        // معالجة البيانات للواجهة
        const processedJobs = jobsData.map(job => ({
          id: job.id,
          icon: job.image || getDefaultIcon(job.title), // أيقونة حسب نوع الوظيفة
          title: job.title || "Untitled Job",
          desc: job.description 
            ? (job.description.length > 100 
                ? `${job.description.substring(0, 100)}...` 
                : job.description)
            : "No description available",
          type: getEmploymentTypeDisplay(job.employmentType),
          location: job.location,
          hasQuestions: job.questions && job.questions.length > 0,
          skills: job.requiredSkills || [],
          createdAt: job.createdAt
        }));

        setJobs(processedJobs);
      } catch (err) {
        console.error("Error fetching company jobs:", err);
        setError(err.message || "Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, []);

  // ✅ دالة للحصول على أيقونة افتراضية حسب نوع الوظيفة
  const getDefaultIcon = (jobTitle) => {
    if (!jobTitle) return "/icon/Figma.png";
    
    const title = jobTitle.toLowerCase();
    if (title.includes("design") || title.includes("ui") || title.includes("ux")) {
      return "/icon/Figma.png";
    } else if (title.includes("marketing") || title.includes("email")) {
      return "/icon/Telegram.png";
    } else if (title.includes("developer") || title.includes("programmer") || title.includes("software")) {
      return "/icon/App store.png";
    } else if (title.includes("product") || title.includes("manager")) {
      return "/icon/Spotify.png";
    } else {
      return "/icon/Figma.png";
    }
  };

  // ✅ دالة لعرض نوع التوظيف
  const getEmploymentTypeDisplay = (employmentType) => {
    if (!employmentType) return "FULL TIME";
    
    switch(employmentType.toLowerCase()) {
      case 'part-time': return 'PART TIME';
      case 'full-time': return 'FULL TIME';
      case 'on-site': return 'ON SITE';
      case 'remote': return 'REMOTE';
      default: return employmentType.toUpperCase();
    }
  };

  const handleAddClick = () => {
    const companyData = localStorage.getItem("company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (company && company.id) {
          navigate(`/company/${company.id}/add-job`);
          return;
        }
      } catch (err) {
        console.error("Error parsing company data:", err);
      }
    }
    navigate('/company/AddJob');
  };

  const handleJobClick = (jobId) => {
    const companyData = localStorage.getItem("company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (company && company.id) {
          navigate(`/company/${company.id}/job/${jobId}/details`);
          return;
        }
      } catch (err) {
        console.error("Error parsing company data:", err);
      }
    }
    navigate(`/job/${jobId}`);
  };

  // ✅ دالة لإعادة المحاولة
  const handleRetry = () => {
    window.location.reload();
  };

  // ✅ دالة للذهاب إلى صفحة تسجيل الدخول
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="add-job-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-job-page">
        <div className="error-state">
          <h3>⚠️ Error Loading Jobs</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button className="retry-btn" onClick={handleRetry}>
              Try Again
            </button>
            <button className="login-btn" onClick={handleLoginRedirect}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-job-page">
      <h2 className="page-title">Add new Job application</h2>

      <div className="job-grid">
        {/* بطاقة الإضافة */}
        <div className="add-card" onClick={handleAddClick}>
          <div className="add-card-content">
            <span className="plus-icon">＋</span>
            <h3>Add New Job</h3>
            <p>Create a new job posting</p>
          </div>
        </div>

        {/* بطاقات الوظائف */}
        {jobs.map((job, index) => (
          <div key={job.id || index} onClick={() => handleJobClick(job.id)}>
            <JobCard
              id={job.id}
              icon={job.icon}
              title={job.title}
              desc={job.desc}
              type={job.type}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobManagementPage;