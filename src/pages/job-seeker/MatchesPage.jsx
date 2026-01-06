import React, { useState, useEffect } from "react";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./MatchesPage.css";
import { useTranslation } from 'react-i18next';

function MatchesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/auth/recommended-jobs",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(t("Failed to fetch data"));
        }

        const data = await response.json();
        console.log(data);

        if (data.error && (data.error.includes("CV") || data.error.includes("resume"))) {
          setError(t("You must upload your CV/resume first"));
          setShowError(true);
          setJobs([]);
        } else {
          const formattedJobs = data.map(job => ({
            id: job.id || Date.now() + Math.random(),
            title: job.title || t("Untitled Job"),
            type: job.employmentType ? job.employmentType.toUpperCase() : t("FULL TIME"),
            desc: job.description || t("No description available"),
            icon: job.company?.companyLogo
              ? `http://localhost:3000/${job.company.companyLogo}`
              : "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
            company: String(job.company?.companyName || t("Unknown Company")),
            location: String(job.location || t("Location not specified")),
            salary: String(job.salary || t("Salary not specified")),
            skills: job.skills || (job.requiredSkills && (Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : String(job.requiredSkills))) || t("Not specified"),
            experience: String(job.experience || job.requiredExperience || t("Not specified")),
            education: String(job.education || job.requiredEducation || t("Not specified")),
            originalJob: job
          }));

          setJobs(formattedJobs);
          setShowError(false);
        }
      } catch (err) {
        setError(err.message || t("An error occurred while loading jobs"));
        setShowError(true);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [t]);

  const SimpleErrorMessage = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 6000);
      
      return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        left: "20px",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        animation: "slideIn 0.3s ease-out"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #fef3f2 0%, #fff6f6 100%)",
          borderRight: "4px solid #f04438",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 8px 24px rgba(240, 68, 56, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          maxWidth: "500px",
          width: "100%",
          border: "1px solid #ffcdd2"
        }}>
          <div style={{
            color: "#f04438",
            fontSize: "20px",
            fontWeight: "bold"
          }}>!</div>
          <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{
              color: "#b42318",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "4px"
            }}>
              {t("Important Notice")}
            </div>
            <div style={{
              color: "#d92d20",
              fontSize: "15px",
              lineHeight: 1.5
            }}>
              {message}
            </div>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              if (onClose) onClose();
            }}
            style={{
              background: "rgba(240, 68, 56, 0.1)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#f04438",
              fontSize: "20px",
              fontWeight: "bold"
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="match-container" 
      dir={isRTL ? 'rtl' : 'ltr'} 
      style={robotoStyle}
    >
      {/* عنوان الصفحة */}
      <h2 style={{ textAlign: isRTL ? 'right' : 'left' }}>
        {t("Best Matched")} <span>{t("Jobs")}</span>
      </h2>

      {/* عرض رسالة الخطأ باستخدام المكون المبسط */}
      {showError && (
        <SimpleErrorMessage 
          message={error || t("You must upload your CV/resume first")}
          onClose={() => setShowError(false)}
        />
      )}

      {/* رسالة تحميل */}
      {loading && (
        <div className="jobs-page-loading" style={robotoStyle}>
          <div className="loading-spinner-large"></div>
          <p>{t("Loading jobs...")}</p>
        </div>
      )}

      {/* إذا ما في بيانات بعد الانتهاء من التحميل */}
      {!loading && !showError && jobs.length === 0 && (
        <div className="jobs-page-no-jobs" style={robotoStyle}>
          <div className="no-jobs-icon">📭</div>
          <p className="no-jobs-text">
            {t("No recommended jobs available at the moment")}
          </p>
        </div>
      )}

      {/* شبكة عرض الوظائف - تعرض فقط إذا في بيانات */}
      {!loading && !showError && jobs.length > 0 && (
        <div className="jobs-page-job-grid">
          {jobs.map((job) => {
            if (!job || !job.id) {
              console.warn("Invalid job data:", job);
              return null;
            }
            
            return (
              <JobCard
                key={job.id}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MatchesPage;