import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "./RejectionModal.css";

function RejectionModal({ isOpen, onClose, applicant, onReject }) {
  const { t } = useTranslation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // تعريف الأسباب المحددة مسبقاً مع النص الذي سيتم إرساله
  const predefinedReasons = [
    { 
      code: "INSUFFICIENT_EXPERIENCE", 
      label: t("Insufficient experience"),
      feedbackText: "We regret to inform you that your application was not selected due to insufficient experience for this role. We require candidates with more relevant experience in this field."
    },
    { 
      code: "SKILLS_NOT_MATCHING", 
      label: t("Skills not matching job requirements"),
      feedbackText: "Thank you for your application. After careful review, we found that your skills do not fully match the specific requirements for this position."
    },
    { 
      code: "MORE_SUITABLE_CANDIDATE", 
      label: t("Found a more suitable candidate"),
      feedbackText: "We appreciate your interest in our company. While your qualifications are impressive, we have selected another candidate whose background and experience better align with our current needs."
    },
    { 
      code: "POSITION_FILLED", 
      label: t("Position has been filled"),
      feedbackText: "We thank you for applying for this position. Unfortunately, the position has already been filled by another candidate at this time."
    },
    { 
      code: "BUDGET_CONSTRAINTS", 
      label: t("Budget constraints"),
      feedbackText: "We have reviewed your application and while we were impressed with your qualifications, due to budget constraints we are unable to proceed with your application at this time."
    },
    { 
      code: "OTHER", 
      label: t("Other"),
      feedbackText: "" // سيتم ملؤه من قبل المستخدم
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال السبب
    if (!rejectionReason) {
      alert(t("Please select a rejection reason"));
      return;
    }
    
    // البحث عن السبب المحدد
    const selectedReason = predefinedReasons.find(r => r.code === rejectionReason);
    
    // بناء نص الرفض النهائي
    let finalFeedback = "";
    
    if (rejectionReason === "OTHER") {
      // التحقق من السبب المخصص
      if (!customReason || customReason.trim().length < 5) {
        alert(t("Please provide a detailed rejection reason (at least 5 characters)"));
        return;
      }
      finalFeedback = customReason;
    } else {
      finalFeedback = selectedReason.feedbackText;
    }
    
    // التحقق من طول النص
    if (finalFeedback.trim().length < 5) {
      alert(t("Rejection reason must be at least 5 characters long"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Sending feedback to backend:", finalFeedback);
      
      // تمرير النص النهائي فقط للدالة الرئيسية
      await onReject(finalFeedback);
      
      // إعادة تعيين الحقول
      setRejectionReason("");
      setCustomReason("");
      onClose();
    } catch (error) {
      console.error("Error in rejection modal:", error);
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
                      value={reason.code}
                      checked={rejectionReason === reason.code}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <label htmlFor={`reason-${index}`}>
                      <strong>{reason.label}</strong>
                      {reason.code !== "OTHER" && (
                        <div className="reason-preview">
                          {reason.feedbackText.substring(0, 100)}...
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {rejectionReason === "OTHER" && (
              <div className="form-group">
                <label htmlFor="customReason">
                  {t("Custom Reason *")}
                  <span className="char-count">({t("Minimum 5 characters")})</span>
                </label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t("Please provide a detailed rejection reason...")}
                  rows="5"
                  minLength="5"
                  required
                />
                <div className="char-counter">
                  {customReason.length}/5 {t("characters")}
                  {customReason.length < 5 && (
                    <span className="char-warning"> ({t("Need more characters")})</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="email-preview">
              <h4>{t("Email Preview:")}</h4>
              <div className="preview-content">
                <p><strong>{t("Subject")}:</strong> {t("Update on Your Application for")} {applicant.jobTitle}</p>
                <p><strong>{t("To")}:</strong> {applicant.firstName} {applicant.lastName} &lt;{applicant.email}&gt;</p>
                <div className="email-body">
                  <p>{t("Dear")} {applicant.firstName},</p>
                  <p>{t("Thank you for your interest in the")} {applicant.jobTitle} {t("position")}.</p>
                  <p>{t("After careful consideration, we regret to inform you that we have decided not to move forward with your application at this time.")}</p>
                  <p><strong>{t("Feedback")}:</strong></p>
                  <p className="feedback-text">
                    {rejectionReason === "OTHER" 
                      ? (customReason || t("Custom feedback will appear here..."))
                      : (predefinedReasons.find(r => r.code === rejectionReason)?.feedbackText || "")
                    }
                  </p>
                  <p>{t("We appreciate the time you invested in your application and wish you the best in your job search.")}</p>
                  <p>{t("Sincerely,")}<br/>{t("The Hiring Team")}</p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                {t("Cancel")}
              </button>
              <button 
                type="submit" 
                className="btn-submit" 
                disabled={isSubmitting || (rejectionReason === "OTHER" && customReason.length < 5)}
              >
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