import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ApplicationSuccess.css";

export default function ApplicationSuccess() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const testCompleted = location.state?.testCompleted;
  const jobData = location.state?.jobData;

  return (
    <div className="application-success-container">
      <div className="success-content">
        <div className="success-icon">✓</div>
        
        <h1 className="success-title">Application Submitted Successfully!</h1>
        
        <div className="success-message">
          <p>
            Your application has been received and will be reviewed by the employer.
          </p>
          
          {testCompleted && (
            <div className="test-info">
              <p>✅ Your screening test has been submitted along with your application.</p>
            </div>
          )}
          
          <div className="application-details">
            {jobData && (
              <>
                <h3>Job Details:</h3>
                <p><strong>Position:</strong> {jobData.title}</p>
                <p><strong>Company:</strong> {jobData.companyName}</p>
                <p><strong>Location:</strong> {jobData.location}</p>
              </>
            )}
          </div>
        </div>
        
        <div className="success-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/jobs')}
          >
            Browse More Jobs
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/applications/pending')}
          >
            View My Applications
          </button>
          <button 
            className="btn-tertiary"
            onClick={() => navigate(`/job/${jobId}`)}
          >
            Back to Job Details
          </button>
        </div>
        
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>The employer will review your application</li>
            <li>You may be contacted for an interview</li>
            <li>Check your email for updates</li>
            <li>You can track your application status in "My Applications"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}