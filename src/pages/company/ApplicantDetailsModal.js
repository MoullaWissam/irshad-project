import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        toast.warning(t("No resume available for this applicant"));
      }
    } catch (error) {
      console.error("Error fetching resume URL:", error);
      toast.error(t("Failed to fetch resume"));
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
      
      toast.success(t("Resume downloaded successfully!"));
    } else {
      toast.warning(t("No resume available for download"));
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      toast.warning(t("No resume available to view"));
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
      case "pending": return t("Pending");
      case "sent": return t("Interview Request Sent");
      case "scheduled": return t("Interview Scheduled");
      case "rejected": return t("Rejected");
      case "accepted": return t("Accepted");
      default: return t("Unknown");
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
              {t("Schedule Interview")}
            </button>
            <button 
              className="btn-action-accept"
              onClick={() => {
                onAcceptApplicant(applicant);
                onClose();
              }}
            >
              {t("Accept Applicant")}
            </button>
          </>
        );
      
      case "scheduled":
        return (
          <div className="scheduled-info">
            <p className="interview-date">
              <strong>{t("Scheduled for")}:</strong> {applicant.interviewDate ? new Date(applicant.interviewDate).toLocaleString() : t("Date not set")}
            </p>
            <button 
              className="btn-action-accept"
              onClick={() => {
                onAcceptApplicant(applicant);
                onClose();
              }}
            >
              {t("Accept Applicant")}
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
            {t("Accept Applicant")}
          </button>
        );
      
      case "accepted":
        return (
          <div className="accepted-info">
            <p><strong>{t("Applicant Accepted")}</strong></p>
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
              <span className="job-title">{applicant.jobTitle || t("No Position")}</span>
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
              {t("Overview")}
            </button>
            <button 
              className={`tab-btn ${activeTab === "resume" ? "active" : ""}`}
              onClick={() => setActiveTab("resume")}
            >
              {t("Resume")}
            </button>
            <button 
              className={`tab-btn ${activeTab === "test" ? "active" : ""}`}
              onClick={() => setActiveTab("test")}
            >
              {t("Test Results")}
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="overview-content">
                {/* Basic Information */}
                <div className="info-section">
                  <h3>{t("Basic Information")}</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>{t("Email")}</label>
                      <p>{applicant.email}</p>
                    </div>
                    <div className="info-item">
                      <label>{t("estimated_salary")}</label>
                      <p>{applicant.estimated_salary+"$" || t("Not provided")}</p>
                    </div>
                    <div className="info-item">
                      <label>{t("Applied Date")}</label>
                      <p>{new Date(applicant.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="info-item">
                      <label>{t("Experience")}</label>
                      <p>{applicant.resume?.experience_years || 0} {t("years")}</p>
                    </div>
                    <div className="info-item">
                      <label>{t("Location")}</label>
                      <p>{applicant.resume?.location || t("Not specified")}</p>
                    </div>
                    <div className="info-item">
                      <label>{t("Test Score")}</label>
                      <p className={`test-score-detail ${applicant.testScore >= 80 ? 'high' : applicant.testScore >= 60 ? 'medium' : 'low'}`}>
                        {applicant.testScore ? `${applicant.testScore}%` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="info-section">
                  <h3>{t("Skills")}</h3>
                  <div className="skills-container">
                    {applicant.resume?.extracted_skills?.map((skill, index) => (
                      <span key={index} className="skill-tag-large">{skill}</span>
                    )) || <p className="no-data">{t("No skills listed")}</p>}
                  </div>
                </div>

                {/* Education */}
                <div className="info-section">
                  <h3>{t("Education")}</h3>
                  <div className="education-list">
                    {applicant.resume?.education?.map((edu, index) => (
                      <div key={index} className="education-item">
                        <div className="education-icon">🎓</div>
                        <div className="education-text">{edu}</div>
                      </div>
                    )) || <p className="no-data">{t("No education information")}</p>}
                  </div>
                </div>

                {/* Summary */}
                <div className="info-section">
                  <h3>{t("Resume Summary")}</h3>
                  <div className="summary-box">
                    <p>{applicant.resume?.summary || t("No summary available")}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resume" && (
              <div className="resume-content">
                {/* Cover Letter */}
                <div className="info-section">
                  <h3>{t("Cover Letter")}</h3>
                  <div className="cover-letter-box">
                    <p>{applicant.coverLetter || t("No cover letter provided")}</p>
                  </div>
                </div>

                {/* Resume Actions */}
                <div className="info-section">
                  <h3>{t("Resume Document")}</h3>
                  <div className="resume-actions">
                    {loadingResume ? (
                      <div className="loading-resume">
                        <p>{t("Loading resume...")}</p>
                      </div>
                    ) : resumeUrl ? (
                      <>
                        <button className="btn-view-resume" onClick={handleViewResume}>
                          📄 {t("View Resume")}
                        </button>
                        <button className="btn-download-resume" onClick={handleDownloadResume}>
                          ⬇️ {t("Download Resume")}
                        </button>
                      </>
                    ) : (
                      <p className="no-data">{t("No resume uploaded")}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "test" && (
              <div className="test-content">
                {/* Test Score */}
                <div className="info-section">
                  <h3>{t("Test Results")}</h3>
                  <div className="test-score-display">
                    <div className="score-circle">
                      <span className="score-percentage">
                        {applicant.testScore ? `${applicant.testScore}%` : "N/A"}
                      </span>
                    </div>
                    <div className="score-label">
                      {applicant.testScore ? (
                        applicant.testScore >= 80 ? t("Excellent") :
                        applicant.testScore >= 60 ? t("Good") : t("Needs Improvement")
                      ) : t("Not Tested")}
                    </div>
                  </div>
                </div>

                {/* Test Answers */}
                {applicant.testAnswers && applicant.testAnswers.length > 0 && (
                  <div className="info-section">
                    <h3>{t("Test Answers")}</h3>
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
                    <p>{t("No test answers available")}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rejection Details (if rejected) */}
          {applicant.interviewStatus === "rejected" && (
            <div className="rejection-section">
              <h3>{t("Rejection Details")}</h3>
              <div className="rejection-info">
                <p><strong>{t("Reason")}:</strong> {applicant.rejectionReason || t("No reason provided")}</p>
                <div className="email-notice">
                  <p><small>📧 {t("A rejection email was sent to the applicant.")}</small></p>
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
                {t("Reject Applicant")}
              </button>
            )}
          </div>
          
          <div className="footer-right">
            {getCurrentActions()}
            <button className="btn-close-modal" onClick={onClose}>
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantDetailsModal;