import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import JobCard from "../../Components/Card/JobCard/JobCard.jsx";
import "./JobManagementPage.css";
import { useNavigate } from "react-router-dom";

function JobManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب بيانات المستخدم من localStorage
        const companyData = localStorage.getItem("companyData");
        if (!companyData) {
          throw new Error(t("No company data found. Please login first."));
        }

        const company = JSON.parse(companyData);
        if (!company || !company.id) {
          throw new Error(t("Invalid company data. Please login again."));
        }

        const companyId = company.id;
        setCompanyName(company.name || company.companyName || ""); // حفظ اسم الشركة
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
            throw new Error(t("Unauthorized. Please login again."));
          }
          if (response.status === 404) {
            throw new Error(t("Company with ID {id} not found.", { id: companyId }));
          }
          throw new Error(`${t("Failed to fetch jobs:")} ${response.status} ${response.statusText}`);
        }

        const jobsData = await response.json();
        console.log("Jobs data received:", jobsData);

        // معالجة البيانات للواجهة مع بيانات إضافية للمكون الجديد
        const processedJobs = jobsData.map(job => ({
          id: job.id,
          icon: job.image || getDefaultIcon(job.title),
          title: job.title || "Untitled Job",
          desc: job.description || t("No description available"),
          type: getEmploymentTypeDisplay(job.employmentType),
          company: companyName, // اسم الشركة
          location: job.location || t("Location not specified"),
          skills: Array.isArray(job.requiredSkills) ? job.requiredSkills : 
                 (job.requiredSkills ? job.requiredSkills.split(",").map(s => s.trim()) : []),
          experience: job.experienceLevel || job.minimumExperience || undefined,
          education: job.educationLevel || job.requiredEducation || undefined,
          hasQuestions: job.questions && job.questions.length > 0,
          createdAt: job.createdAt
        }));

        setJobs(processedJobs);
      } catch (err) {
        console.error("Error fetching company jobs:", err);
        setError(err.message || t("Failed to load jobs. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, [t]);

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
    if (!employmentType) return t("FULL TIME");
    
    switch(employmentType.toLowerCase()) {
      case 'part-time': return t('PART TIME');
      case 'full-time': return t('FULL TIME');
      case 'on-site': return t('ON SITE');
      case 'remote': return t('REMOTE');
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

  const handleRetry = () => {
    window.location.reload();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="add-job-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t("Loading jobs...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-job-page">
        <div className="error-state">
          <h3>⚠️ {t("Error Loading Jobs")}</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button className="retry-btn" onClick={handleRetry}>
              {t("Try Again")}
            </button>
            <button className="login-btn" onClick={handleLoginRedirect}>
              {t("Go to Login")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-job-page">
      <h2 className="page-title">{t("Add new Job application")}</h2>

      <div className="job-grid">
        {/* بطاقة الإضافة */}
        <div className="add-card" onClick={handleAddClick}>
          <div className="add-card-content">
            <span className="plus-icon">＋</span>
            <h3>{t("Add New Job")}</h3>
            <p>{t("Create a new job posting")}</p>
          </div>
        </div>

        {/* بطاقات الوظائف باستخدام المكون الجديد */}
        {jobs.map((job, index) => (
          <div key={job.id || index} onClick={() => handleJobClick(job.id)}>
            <JobCard
              id={job.id}
              icon={job.icon}
              title={job.title}
              desc={job.desc}
              type={job.type}
              company={companyName} // اسم الشركة
              location={job.location}
              skills={job.skills}
              experience={job.experience}
              education={job.education}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobManagementPage;