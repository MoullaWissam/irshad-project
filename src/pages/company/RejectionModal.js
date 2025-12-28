import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "./RejectionModal.css";

function RejectionModal({ isOpen, onClose, applicant, onReject }) {
  const { t } = useTranslation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const predefinedReasons = [
    t("Insufficient experience"),
    t("Skills not matching job requirements"),
    t("Found a more suitable candidate"),
    t("Position has been filled"),
    t("Budget constraints"),
    t("Other")
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalReason = rejectionReason === t("Other") ? customReason : rejectionReason;
    
    if (!finalReason.trim()) {
      alert(t("Please provide a rejection reason"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onReject(finalReason);
      setRejectionReason("");
      setCustomReason("");
      onClose();
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      alert(t("Failed to reject applicant. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="rejection-modal">
        <div className="modal-header">
          <h2>{t("Reject Applicant")}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="applicant-info">
            <h3>{applicant.firstName} {applicant.lastName}</h3>
            <p>{t("Position")}: {applicant.jobTitle}</p>
            <div className="warning-box">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <p className="warning-title">{t("Important Notice")}</p>
                <p className="warning-text">{t("This action will:")}</p>
                <ul className="action-list">
                  <li>{t('Change applicant status to "Rejected"')}</li>
                  <li><strong>{t("Send a rejection email to the applicant")}</strong></li>
                  <li>{t("Remove them from active candidate lists")}</li>
                  <li>{t("Cancel any scheduled interviews")}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("Select Rejection Reason *")}</label>
              <div className="reasons-list">
                {predefinedReasons.map((reason, index) => (
                  <div key={index} className="reason-option">
                    <input
                      type="radio"
                      id={`reason-${index}`}
                      name="rejectionReason"
                      value={reason}
                      checked={rejectionReason === reason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <label htmlFor={`reason-${index}`}>{reason}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {rejectionReason === t("Other") && (
              <div className="form-group">
                <label htmlFor="customReason">{t("Custom Reason *")}</label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t("Please specify the rejection reason...")}
                  rows="3"
                  required
                />
              </div>
            )}
            
            <div className="email-preview">
              <h4>{t("Email Preview:")}</h4>
              <div className="preview-content">
                <p><strong>{t("Subject")}:</strong> {t("Update on Your Application for")} {applicant.jobTitle}</p>
                <p><strong>{t("To")}:</strong> {applicant.firstName} {applicant.lastName}</p>
                <p>{t("Dear")} {applicant.firstName},</p>
                <p>{t("Thank you for your interest in the")} {applicant.jobTitle} {t("position")}.</p>
                <p>{t("After careful consideration, we regret to inform you that we have decided not to move forward with your application at this time.")}</p>
                <p><strong>{t("Reason")}:</strong> {rejectionReason === t("Other") ? customReason : rejectionReason}</p>
                <p>{t("We appreciate the time you invested in your application and wish you the best in your job search.")}</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                {t("Cancel")}
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? t("Processing...") : t("Reject Applicant & Send Email")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RejectionModal;