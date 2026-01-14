import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ApplicationSuccess.css";

export default function ApplicationSuccess() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const testCompleted = location.state?.testCompleted;
  const jobData = location.state?.jobData;
  const applicationResult = location.state?.applicationResult;
  const testResult = location.state?.testResult;

  // البيانات الافتراضية في حالة عدم وجودها
  const defaultApplicationResult = {
    message: t("You applied for this job successfully"),
    acceptance_score: 0.008,
    salary: "350$"
  };

  // استخدام البيانات الواردة أو الافتراضية
  const appResult = applicationResult || defaultApplicationResult;

  return (
    <div className="application-success-container">
      <div className="success-content">
        <div className="success-icon">✓</div>
        
        <h1 className="success-title">{t("Application Submitted Successfully!")}</h1>
        
        <div className="success-message">
          <p>
            {t("Your application has been received and will be reviewed by the employer.")}
          </p>
          
          {testCompleted && (
            <div className="test-info">
              <p>{t("✅ Your screening test has been submitted along with your application.")}</p>
            </div>
          )}
          
          <div className="application-result">
            <h3>{t("Application Result:")}</h3>
            <div className="result-card">
              <div className="result-item">
                <span className="result-label">{t("Status:")}</span>
           
              </div>
              
              <div className="result-item">
                <span className="result-label">{t("Acceptance Score:")}</span>
                <span className="result-value score">{appResult.acceptance_score}</span>
              </div>
              
              <div className="result-item">
                <span className="result-label">{t("Expected Salary:")}</span>
                <span className="result-value salary">{appResult.salary}</span>
              </div>
              
              {testCompleted && (
                <div className="result-item">
                  <span className="result-label">{t("Test Status:")}</span>
                  <span className="result-value status-completed">{t("Completed")} ✓</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="application-details">
            {jobData && (
              <>
                <h3>{t("Job Details:")}</h3>
                <p><strong>{t("Position")}:</strong> {jobData.title}</p>
                <p><strong>{t("Company")}:</strong> {jobData.companyName}</p>
                <p><strong>{t("Location")}:</strong> {jobData.location}</p>
              </>
            )}
          </div>
        </div>
        
        <div className="success-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/jobs')}
          >
            {t("Browse More Jobs")}
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/applications/pending')}
          >
            {t("View My Applications")}
          </button>
          <button 
            className="btn-tertiary"
            onClick={() => navigate(`/job/${jobId}`)}
          >
            {t("Back to Job Details")}
          </button>
        </div>
        
        <div className="next-steps">
          <h3>{t("What's Next?")}</h3>
          <ul>
            <li>{t("The employer will review your application")}</li>
            <li>{t("You may be contacted for an interview")}</li>
            <li>{t("Check your email for updates")}</li>
            <li>{t("You can track your application status in \"My Applications\"")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}