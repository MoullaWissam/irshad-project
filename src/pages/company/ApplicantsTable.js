import React, { useState } from "react";
import "./ApplicantsTable.css";

function ApplicantsTable({ 
  applicants, 
  onSendInterviewRequest, 
  onScheduleInterview, 
  onRejectApplicant,
  onUndoRejection 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplicants = applicants.filter(applicant => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        applicant.firstName.toLowerCase().includes(searchLower) ||
        applicant.lastName.toLowerCase().includes(searchLower) ||
        applicant.email.toLowerCase().includes(searchLower) ||
        (applicant.resume?.extracted_skills?.some(skill => 
          skill.toLowerCase().includes(searchLower)
        ) || false)
      );
    }
    return true;
  });

  const getRankingBadge = (ranking) => {
    const config = {
      gold: { label: "Gold", className: "ranking-gold", icon: "🥇" },
      silver: { label: "Silver", className: "ranking-silver", icon: "🥈" },
      bronze: { label: "Bronze", className: "ranking-bronze", icon: "🥉" }
    };
    
    const rank = config[ranking] || { label: ranking, className: "ranking-unknown", icon: "" };
    
    return (
      <div className={`ranking-badge ${rank.className}`}>
        <span className="ranking-icon">{rank.icon}</span>
        <span className="ranking-label">{rank.label}</span>
      </div>
    );
  };

  const getInterviewStatusBadge = (status, date) => {
    const config = {
      none: { label: "No Interview Sent", className: "status-none" },
      sent: { label: "Interview Request Sent", className: "status-sent" },
      scheduled: { 
        label: date ? `Scheduled: ${new Date(date).toLocaleDateString()}` : "Interview Scheduled", 
        className: "status-scheduled" 
      },
      rejected: { label: "Rejected", className: "status-rejected" }
    };
    
    const statusConfig = config[status] || { label: status, className: "status-unknown" };
    
    return <span className={`interview-status-badge ${statusConfig.className}`}>{statusConfig.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getActionsForApplicant = (applicant) => {
    switch (applicant.interviewStatus) {
      case "none":
        return (
          <>
            <button 
              className="btn-action btn-interview-request"
              onClick={() => onSendInterviewRequest(applicant)}
              title="Send interview request"
            >
              Send Interview Request
            </button>
            <button 
              className="btn-action btn-reject"
              onClick={() => onRejectApplicant(applicant)}
              title="Reject applicant"
            >
              Reject
            </button>
          </>
        );
      
      case "sent":
        return (
          <>
            <button 
              className="btn-action btn-schedule"
              onClick={() => onScheduleInterview(applicant)}
              title="Schedule interview"
            >
              Schedule Interview
            </button>
            <button 
              className="btn-action btn-reject"
              onClick={() => onRejectApplicant(applicant)}
              title="Reject applicant"
            >
              Reject
            </button>
          </>
        );
      
      case "scheduled":
        return (
          <div className="interview-scheduled-info">
            <span className="interview-date">
              {applicant.interviewDate ? new Date(applicant.interviewDate).toLocaleString() : "Date not set"}
            </span>
            <button 
              className="btn-action btn-reject"
              onClick={() => onRejectApplicant(applicant)}
              title="Reject applicant"
            >
              Reject
            </button>
          </div>
        );
      
      case "rejected":
        return (
          <div className="rejected-info">
            <span className="rejection-reason">
              {applicant.rejectionReason || "No reason provided"}
            </span>
            <button 
              className="btn-action btn-undo"
              onClick={() => onUndoRejection(applicant)}
              title="Undo rejection"
            >
              Undo Rejection
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="applicants-table-container">
      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="results-count">
          Showing {filteredApplicants.length} of {applicants.length} applicants
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Skills</th>
              <th>Applied</th>
              <th>Test Score</th>
              <th>Interview Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map(applicant => (
              <tr key={applicant.id} className="applicant-row">
                <td>
                  {getRankingBadge(applicant.ranking)}
                </td>
                <td>
                  <div className="applicant-name">
                    <strong>{applicant.firstName} {applicant.lastName}</strong>
                    <div className="applicant-experience">
                      {applicant.resume?.experience_years || 0} years experience
                    </div>
                  </div>
                </td>
                <td>
                  <div className="applicant-contact">
                    <div className="contact-email">{applicant.email}</div>
                    <div className="contact-phone">{applicant.phone}</div>
                  </div>
                </td>
                <td>
                  <div className="applicant-skills">
                    {applicant.resume?.extracted_skills?.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    )) || "No skills listed"}
                    {applicant.resume?.extracted_skills?.length > 3 && (
                      <span className="skill-more">+{applicant.resume.extracted_skills.length - 3} more</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="applicant-date">
                    {formatDate(applicant.appliedAt)}
                  </div>
                </td>
                <td>
                  <div className="test-score">
                    {applicant.testScore ? (
                      <span className={`score-badge ${applicant.testScore >= 80 ? 'score-high' : applicant.testScore >= 60 ? 'score-medium' : 'score-low'}`}>
                        {applicant.testScore}%
                      </span>
                    ) : (
                      <span className="score-na">N/A</span>
                    )}
                  </div>
                </td>
                <td>
                  {getInterviewStatusBadge(applicant.interviewStatus, applicant.interviewDate)}
                </td>
                <td>
                  <div className="applicant-actions">
                    {getActionsForApplicant(applicant)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplicantsTable;