import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./ApplicantDetailsModal.css";

function ApplicantDetailsModal({ 
  isOpen, 
  onClose, 
  applicant, 
  onScheduleInterview, 
  onRejectApplicant,
  onAcceptApplicant,
  onViewResume 
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    if (applicant && activeTab === "resume") {
      fetchResumeUrl();
    }
  }, [applicant, activeTab]);

  const fetchResumeUrl = async () => {
    if (!applicant || resumeUrl || loadingResume) return;
    
    setLoadingResume(true);
    try {
      console.log("Fetching resume URL for:", applicant);
      
      const response = await fetch(
        `http://localhost:3000/company-management/job-apply/${applicant.applicationId}/resume/${applicant.userId}/path`,
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resume API response:", data);
      
      if (data.path) {
        // بناء الرابط الكامل
        let fullUrl;
        if (data.path.startsWith('http')) {
          fullUrl = data.path;
        } else {
          fullUrl = `http://localhost:3000${data.path}`;
        }
        setResumeUrl(fullUrl);
        console.log("Full resume URL:", fullUrl);
      } else {
        setResumeUrl(null);
        toast.warning("No resume available for this applicant");
      }
    } catch (error) {
      console.error("Error fetching resume URL:", error);
      toast.error("Failed to fetch resume");
      setResumeUrl(null);
    } finally {
      setLoadingResume(false);
    }
  };

  if (!isOpen || !applicant) return null;

  const handleDownloadResume = () => {
    if (resumeUrl) {
      // استخراج اسم الملف من المسار
      const fileName = resumeUrl.split('/').pop() || 'resume.pdf';
      
      // إنشاء رابط تحميل
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Resume downloaded successfully!");
    } else {
      toast.warning("No resume available for download");
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      toast.warning("No resume available to view");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "#6c757d";
      case "sent": return "#0d6efd";
      case "scheduled": return "#198754";
      case "rejected": return "#dc3545";
      case "accepted": return "#198754";
      default: return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "pending": return "Pending";
      case "sent": return "Interview Request Sent";
      case "scheduled": return "Interview Scheduled";
      case "rejected": return "Rejected";
      case "accepted": return "Accepted";
      default: return "Unknown";
    }
  };

  const getCurrentActions = () => {
    const status = applicant.interviewStatus || applicant.application_status;
    
    switch (status) {
      case "pending":
        return (
          <>
            <button 
              className="btn-action-primary"
              onClick={() => {
                onScheduleInterview(applicant);
                onClose();
              }}
            >
              Schedule Interview
            </button>
            <button 
              className="btn-action-accept"
              onClick={() => {
                onAcceptApplicant(applicant);
                onClose();
              }}
            >
              Accept Applicant
            </button>
          </>
        );
      
      case "scheduled":
        return (
          <div className="scheduled-info">
            <p className="interview-date">
              <strong>Scheduled for:</strong> {applicant.interviewDate ? new Date(applicant.interviewDate).toLocaleString() : "Date not set"}
            </p>
            <button 
              className="btn-action-accept"
              onClick={() => {
                onAcceptApplicant(applicant);
                onClose();
              }}
            >
              Accept Applicant
            </button>
          </div>
        );
      
      case "rejected":
        return (
          <button 
            className="btn-action-accept"
            onClick={() => {
              onAcceptApplicant(applicant);
              onClose();
            }}
          >
            Accept Applicant
          </button>
        );
      
      case "accepted":
        return (
          <div className="accepted-info">
            <p><strong>Applicant Accepted</strong></p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay details-modal-overlay">
      <div className="applicant-details-modal">
        <div className="modal-header">
          <div className="header-left">
            <h2>{applicant.firstName} {applicant.lastName}</h2>
            <div className="applicant-subtitle">
              <span className="job-title">{applicant.jobTitle || "No Position"}</span>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(applicant.interviewStatus) }}
              >
                {getStatusText(applicant.interviewStatus)}
              </span>
              <span className="applicant-id">ID: {applicant.id}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div className="details-tabs">
            <button 
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === "resume" ? "active" : ""}`}
              onClick={() => setActiveTab("resume")}
            >
              Resume
            </button>
            <button 
              className={`tab-btn ${activeTab === "test" ? "active" : ""}`}
              onClick={() => setActiveTab("test")}
            >
              Test Results
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="overview-content">
                {/* Basic Information */}
                <div className="info-section">
                  <h3>Basic Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Email</label>
                      <p>{applicant.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{applicant.phone || "Not provided"}</p>
                    </div>
                    <div className="info-item">
                      <label>Applied Date</label>
                      <p>{new Date(applicant.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="info-item">
                      <label>Experience</label>
                      <p>{applicant.resume?.experience_years || 0} years</p>
                    </div>
                    <div className="info-item">
                      <label>Location</label>
                      <p>{applicant.resume?.location || "Not specified"}</p>
                    </div>
                    <div className="info-item">
                      <label>Test Score</label>
                      <p className={`test-score-detail ${applicant.testScore >= 80 ? 'high' : applicant.testScore >= 60 ? 'medium' : 'low'}`}>
                        {applicant.testScore ? `${applicant.testScore}%` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="info-section">
                  <h3>Skills</h3>
                  <div className="skills-container">
                    {applicant.resume?.extracted_skills?.map((skill, index) => (
                      <span key={index} className="skill-tag-large">{skill}</span>
                    )) || <p className="no-data">No skills listed</p>}
                  </div>
                </div>

                {/* Education */}
                <div className="info-section">
                  <h3>Education</h3>
                  <div className="education-list">
                    {applicant.resume?.education?.map((edu, index) => (
                      <div key={index} className="education-item">
                        <div className="education-icon">🎓</div>
                        <div className="education-text">{edu}</div>
                      </div>
                    )) || <p className="no-data">No education information</p>}
                  </div>
                </div>

                {/* Summary */}
                <div className="info-section">
                  <h3>Resume Summary</h3>
                  <div className="summary-box">
                    <p>{applicant.resume?.summary || "No summary available"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resume" && (
              <div className="resume-content">
                {/* Cover Letter */}
                <div className="info-section">
                  <h3>Cover Letter</h3>
                  <div className="cover-letter-box">
                    <p>{applicant.coverLetter || "No cover letter provided"}</p>
                  </div>
                </div>

                {/* Resume Actions */}
                <div className="info-section">
                  <h3>Resume Document</h3>
                  <div className="resume-actions">
                    {loadingResume ? (
                      <div className="loading-resume">
                        <p>Loading resume...</p>
                      </div>
                    ) : resumeUrl ? (
                      <>
                        <button className="btn-view-resume" onClick={handleViewResume}>
                          📄 View Resume
                        </button>
                        <button className="btn-download-resume" onClick={handleDownloadResume}>
                          ⬇️ Download Resume
                        </button>
                      </>
                    ) : (
                      <p className="no-data">No resume uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "test" && (
              <div className="test-content">
                {/* Test Score */}
                <div className="info-section">
                  <h3>Test Results</h3>
                  <div className="test-score-display">
                    <div className="score-circle">
                      <span className="score-percentage">
                        {applicant.testScore ? `${applicant.testScore}%` : "N/A"}
                      </span>
                    </div>
                    <div className="score-label">
                      {applicant.testScore ? (
                        applicant.testScore >= 80 ? "Excellent" :
                        applicant.testScore >= 60 ? "Good" : "Needs Improvement"
                      ) : "Not Tested"}
                    </div>
                  </div>
                </div>

                {/* Test Answers */}
                {applicant.testAnswers && applicant.testAnswers.length > 0 && (
                  <div className="info-section">
                    <h3>Test Answers</h3>
                    <div className="test-answers">
                      {applicant.testAnswers.map((answer, index) => (
                        <div key={index} className="test-answer-item">
                          <div className="test-question">
                            <strong>Q{index + 1}:</strong> {answer.question}
                          </div>
                          <div className="test-answer">
                            <strong>A:</strong> {answer.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!applicant.testAnswers || applicant.testAnswers.length === 0) && (
                  <div className="no-test-data">
                    <p>No test answers available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rejection Details (if rejected) */}
          {applicant.interviewStatus === "rejected" && (
            <div className="rejection-section">
              <h3>Rejection Details</h3>
              <div className="rejection-info">
                <p><strong>Reason:</strong> {applicant.rejectionReason || "No reason provided"}</p>
                <div className="email-notice">
                  <p><small>📧 A rejection email was sent to the applicant.</small></p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            {applicant.interviewStatus !== "rejected" && applicant.interviewStatus !== "accepted" && (
              <button 
                className="btn-reject-applicant"
                onClick={() => {
                  onRejectApplicant(applicant);
                  onClose();
                }}
              >
                Reject Applicant
              </button>
            )}
          </div>
          
          <div className="footer-right">
            {getCurrentActions()}
            <button className="btn-close-modal" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantDetailsModal;