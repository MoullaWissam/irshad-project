import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // استقبال البيانات من location.state
  const jobData = location.state?.jobData;
  const applicationResult = location.state?.applicationResult;
  const testResult = location.state?.testResult;
  const testCompleted = location.state?.testCompleted || false;
  
  // بيانات افتراضية في حالة عدم وجود بيانات
  const defaultJob = {
    title: "Email Marketing",
    companyName: "Innovate Corp"
  };
  
  const defaultApplicationResult = {
    message: "You applied for this job successfully",
    acceptance_score: 0.008,
    salary: "350$"
  };
  
  // استخدام البيانات الفعلية أو الافتراضية
  const job = jobData || defaultJob;
  const appResult = applicationResult || defaultApplicationResult;

  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-title">Application Submitted Successfully!</h1>

        <div className="success-icon">
          <div className="check-circle">✔</div>
        </div>

        <p className="success-text">
          Thank you for applying for <span>{job.title}</span> position at {job.companyName}.
        </p>

        {testCompleted && (
          <div className="test-notice">
            <p>✅ Your screening test has been completed and submitted.</p>
          </div>
        )}

        {/* عرض تفاصيل النتيجة */}
        <div className="result-details">
          <div className="result-card">
            <h4>Application Status</h4>
            <p className="status-message">{appResult.message}</p>
            
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Acceptance Score:</span>
                <span className="result-value">{appResult.acceptance_score}</span>
              </div>
              
              <div className="result-item">
                <span className="result-label">Expected Salary:</span>
                <span className="result-value">{appResult.salary}</span>
              </div>
              
              {testCompleted && testResult && (
                <div className="result-item">
                  <span className="result-label">Test Status:</span>
                  <span className="result-value">Completed ✓</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="success-subtext">
          Your application is under review, and you'll receive an update soon.
        </p>

        <div className="buttons-row">
          <button 
            className="primary-btn"
            onClick={() => navigate("/jobs")}
          >
            Browse More Jobs
          </button>
          
          <button 
            className="secondary-btn"
            onClick={() => navigate("/applications")}
          >
            Go to My Applications
          </button>
        </div>

        <div className="floating-card">
          <div className="card-icon">
            <div className="company-avatar-small">
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>
          <p>{job.title}</p>
        </div>
      </div>
    </div>
  );
}