import React, { useState } from "react";
import "./RejectionModal.css";

function RejectionModal({ isOpen, onClose, applicant, onReject }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const predefinedReasons = [
    "Insufficient experience",
    "Skills not matching job requirements",
    "Found a more suitable candidate",
    "Position has been filled",
    "Budget constraints",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalReason = rejectionReason === "Other" ? customReason : rejectionReason;
    
    if (!finalReason.trim()) {
      alert("Please provide a rejection reason");
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
      alert("Failed to reject applicant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="rejection-modal">
        <div className="modal-header">
          <h2>Reject Applicant</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="applicant-info">
            <h3>{applicant.firstName} {applicant.lastName}</h3>
            <p>Position: {applicant.jobTitle}</p>
            <p className="warning-text">
              ⚠️ This action will send a rejection email to the applicant.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Rejection Reason *</label>
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
            
            {rejectionReason === "Other" && (
              <div className="form-group">
                <label htmlFor="customReason">Custom Reason *</label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify the rejection reason..."
                  rows="3"
                  required
                />
              </div>
            )}
            
            <div className="email-preview">
              <h4>Email Preview:</h4>
              <div className="preview-content">
                <p><strong>Subject:</strong> Update on Your Application for {applicant.jobTitle}</p>
                <p><strong>To:</strong> {applicant.firstName} {applicant.lastName}</p>
                <p>Dear {applicant.firstName},</p>
                <p>Thank you for your interest in the {applicant.jobTitle} position.</p>
                <p>After careful consideration, we regret to inform you that we have decided not to move forward with your application at this time.</p>
                <p><strong>Reason:</strong> {rejectionReason === "Other" ? customReason : rejectionReason}</p>
                <p>We appreciate the time you invested in your application and wish you the best in your job search.</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Reject Applicant & Send Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RejectionModal;