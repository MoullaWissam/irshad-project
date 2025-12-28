import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "./ApplicantsTable.css";

function ApplicantsTable({ 
  applicants, 
  onScheduleInterview, 
  onRejectApplicant,
  onAcceptApplicant,
  onViewDetails,
  onViewResume 
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // تطبيق البحث
  const filteredApplicants = applicants.filter(applicant => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const firstName = applicant.firstName || "";
      const lastName = applicant.lastName || "";
      const email = applicant.email || "";
      const jobTitle = applicant.jobTitle || "";
      const skills = applicant.resume?.extracted_skills || [];
      
      return (
        firstName.toLowerCase().includes(searchLower) ||
        lastName.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        jobTitle.toLowerCase().includes(searchLower) ||
        skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const getRankingBadge = (ranking) => {
    const config = {
      gold: { label: t("Gold"), className: "ranking-gold", icon: "🥇" },
      silver: { label: t("Silver"), className: "ranking-silver", icon: "🥈" },
      bronze: { label: t("Bronze"), className: "ranking-bronze", icon: "🥉" }
    };
    
    const rank = config[ranking] || { label: ranking || t("Unranked"), className: "ranking-unknown", icon: "" };
    
    return (
      <div className={`ranking-badge ${rank.className}`}>
        <span className="ranking-icon">{rank.icon}</span>
        <span className="ranking-label">{rank.label}</span>
      </div>
    );
  };

  const getInterviewStatusBadge = (status, date) => {
    const config = {
      pending: { label: t("Pending"), className: "status-pending" },
      sent: { label: t("Interview Request Sent"), className: "status-sent" },
      scheduled: { 
        label: date ? `${t("Scheduled")}: ${new Date(date).toLocaleDateString()}` : t("Interview Scheduled"), 
        className: "status-scheduled" 
      },
      rejected: { label: t("Rejected"), className: "status-rejected" },
      accepted: { label: t("Accepted"), className: "status-accepted" }
    };
    
    const statusConfig = config[status] || { label: status || t("Unknown"), className: "status-unknown" };
    
    return <span className={`interview-status-badge ${statusConfig.className}`}>{statusConfig.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return t("Invalid Date");
    }
  };

  const getActionsForApplicant = (applicant) => {
    // تحديد حالة المتقدم
    const status = applicant.interviewStatus || applicant.application_status;
    
    switch (status) {
      case "pending":
        return (
          <div className="action-buttons">
            <button 
              className="btn-action btn-schedule"
              onClick={() => onScheduleInterview(applicant)}
              title={t("Schedule Interview")}
            >
              {t("Schedule Interview")}
            </button>
            <button 
              className="btn-action btn-accept"
              onClick={() => onAcceptApplicant(applicant)}
              title={t("Accept applicant")}
            >
              {t("Accept")}
            </button>
            <button 
              className="btn-action btn-reject"
              onClick={() => onRejectApplicant(applicant)}
              title={t("Reject applicant")}
            >
              {t("Reject")}
            </button>
          </div>
        );
      
      case "scheduled":
        return (
          <div className="scheduled-actions">
            <div className="action-buttons">
              <button 
                className="btn-action btn-accept"
                onClick={() => onAcceptApplicant(applicant)}
                title={t("Accept applicant")}
              >
                {t("Accept")}
              </button>
              <button 
                className="btn-action btn-reject"
                onClick={() => onRejectApplicant(applicant)}
                title={t("Reject applicant")}
              >
                {t("Reject")}
              </button>
            </div>
            <div className="interview-date-info">
              <small>{t("Scheduled")}: {applicant.interviewDate ? new Date(applicant.interviewDate).toLocaleDateString() : t("Date not set")}</small>
            </div>
          </div>
        );
      
      case "rejected":
        return (
          <div className="rejected-actions">
            <div className="action-buttons">
              <button 
                className="btn-action btn-accept"
                onClick={() => onAcceptApplicant(applicant)}
                title={t("Accept applicant")}
              >
                {t("Accept")}
              </button>
            </div>
            <div className="rejection-reason-info">
              <small>{t("Reason")}: {applicant.rejectionReason || t("No reason provided")}</small>
            </div>
          </div>
        );
      
      case "accepted":
        return (
          <div className="accepted-actions">
            <div className="action-buttons">
              <button 
                className="btn-action btn-reject"
                onClick={() => onRejectApplicant(applicant)}
                title={t("Reject applicant")}
              >
                {t("Reject")}
              </button>
            </div>
            <div className="acceptance-info">
              <small>{t("Accepted")}</small>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="action-buttons">
            <button 
              className="btn-action btn-schedule"
              onClick={() => onScheduleInterview(applicant)}
              title={t("Schedule Interview")}
            >
              {t("Schedule Interview")}
            </button>
            <button 
              className="btn-action btn-accept"
              onClick={() => onAcceptApplicant(applicant)}
              title={t("Accept applicant")}
            >
              {t("Accept")}
            </button>
            <button 
              className="btn-action btn-reject"
              onClick={() => onRejectApplicant(applicant)}
              title={t("Reject applicant")}
            >
              {t("Reject")}
            </button>
          </div>
        );
    }
  };

  // الحصول على المهارات للعرض في الجدول
  const getSkillsDisplay = (applicant) => {
    const skills = applicant.resume?.extracted_skills;
    
    if (!skills || skills.length === 0) {
      return (
        <div className="applicant-skills">
          <span className="no-skills">{t("No skills")}</span>
        </div>
      );
    }
    
    return (
      <div className="applicant-skills">
        {skills.slice(0, 2).map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
        {skills.length > 2 && (
          <span 
            className="skill-more" 
            title={skills.slice(2).join(", ")}
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetails) onViewDetails(applicant);
            }}
          >
            +{skills.length - 2} {t("more")}
          </span>
        )}
      </div>
    );
  };

  // الحصول على عرض درجة الاختبار
  const getTestScoreDisplay = (testScore) => {
    if (testScore === null || testScore === undefined) {
      return <span className="score-na">N/A</span>;
    }
    
    let scoreClass = 'score-medium';
    if (testScore >= 80) scoreClass = 'score-high';
    else if (testScore < 60) scoreClass = 'score-low';
    
    return (
      <span className={`score-badge ${scoreClass}`}>
        {testScore}%
      </span>
    );
  };

  return (
    <div className="applicants-table-container">
      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={t("Search by name, email, job title, or skills...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="results-count">
          <span className="count-number">{filteredApplicants.length}</span> {t("of")} <span className="count-number">{applicants.length}</span> {t("applicants")}
        </div>
      </div>
      
      {filteredApplicants.length === 0 ? (
        <div className="no-results">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h4>{t("No applicants found")}</h4>
            <p>{t("Try adjusting your search or filter criteria")}</p>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="applicants-table">
            <thead>
              <tr>
                <th className="col-ranking">{t("Ranking")}</th>
                <th className="col-name">{t("Name & Position")}</th>
                <th className="col-skills">{t("Skills")}</th>
                <th className="col-applied">{t("Applied")}</th>
                <th className="col-test">{t("Test Score")}</th>
                <th className="col-status">{t("Status")}</th>
                <th className="col-actions">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(applicant => (
                <tr key={applicant.id} className="applicant-row">
                  <td className="cell-ranking">
                    <div 
                      className="ranking-cell-content"
                      onClick={() => onViewDetails && onViewDetails(applicant)}
                      title={t("Click to view details")}
                    >
                      {getRankingBadge(applicant.ranking)}
                    </div>
                  </td>
                  <td className="cell-name">
                    <div 
                      className="name-cell-content clickable"
                      onClick={() => onViewDetails && onViewDetails(applicant)}
                    >
                      <div className="applicant-name">
                        <strong className="applicant-fullname">
                          {applicant.firstName} {applicant.lastName}
                        </strong>
                        <div className="applicant-meta">
                          <span className="applicant-experience">
                            {applicant.resume?.experience_years || 0} {t("years exp")}
                          </span>
                          <span className="applicant-position">
                            {applicant.jobTitle || t("No position")}
                          </span>
                        </div>
                        <div className="applicant-contact-info">
                          <span className="applicant-email" title={applicant.email}>
                            {applicant.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="cell-skills">
                    <div 
                      className="skills-cell-content"
                      onClick={() => onViewDetails && onViewDetails(applicant)}
                      title={t("Click to view all skills")}
                    >
                      {getSkillsDisplay(applicant)}
                    </div>
                  </td>
                  <td className="cell-applied">
                    <div className="date-cell-content">
                      {formatDate(applicant.appliedAt)}
                    </div>
                  </td>
                  <td className="cell-test">
                    <div className="test-cell-content">
                      {getTestScoreDisplay(applicant.testScore)}
                    </div>
                  </td>
                  <td className="cell-status">
                    <div className="status-cell-content">
                      {getInterviewStatusBadge(applicant.interviewStatus, applicant.interviewDate)}
                    </div>
                  </td>
                  <td className="cell-actions">
                    <div className="actions-cell-content">
                      <div className="table-actions">
                        <button 
                          className="btn-action btn-view-details"
                          onClick={() => onViewDetails && onViewDetails(applicant)}
                          title={t("View full details")}
                        >
                          {t("View Details")}
                        </button>
                        <button 
                          className="btn-action btn-view-resume"
                          onClick={() => onViewResume && onViewResume(applicant)}
                          title={t("Download resume")}
                        >
                          {t("Download Resume")}
                        </button>
                        {getActionsForApplicant(applicant)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApplicantsTable;