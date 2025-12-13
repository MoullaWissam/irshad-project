import React, { useState } from "react";
import "./InterviewModal.css";

function InterviewModal({ isOpen, onClose, applicant, onSchedule }) {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("14:30");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!interviewDate) {
      alert("Please select an interview date");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const dateTimeString = `${interviewDate}T${interviewTime}:00`;
      
      // Call parent handler
      await onSchedule(dateTimeString, notes);
      
      // Reset form
      setInterviewDate("");
      setInterviewTime("14:30");
      setNotes("");
      
      onClose();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="interview-modal">
        <div className="modal-header">
          <h2>Schedule Interview</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="applicant-info">
            <h3>{applicant.firstName} {applicant.lastName}</h3>
            <p>Email: {applicant.email} | Phone: {applicant.phone}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="interviewDate">Interview Date *</label>
              <input
                type="date"
                id="interviewDate"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={minDate}
                required
              />
              <small>Select a date (tomorrow or later)</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="interviewTime">Interview Time *</label>
              <input
                type="time"
                id="interviewTime"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                required
              />
              <small>Select interview time</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add interview details, location, or any special instructions..."
                rows="4"
              />
              <small>This will be included in the email to the applicant</small>
            </div>
            
            <div className="email-preview">
              <h4>Email Preview:</h4>
              <div className="preview-content">
                <p><strong>Subject:</strong> Interview Invitation for {applicant.jobTitle}</p>
                <p><strong>To:</strong> {applicant.firstName} {applicant.lastName}</p>
                <p>Dear {applicant.firstName},</p>
                <p>We are pleased to invite you for an interview for the position of {applicant.jobTitle}.</p>
                <p><strong>Date:</strong> {interviewDate ? new Date(interviewDate).toLocaleDateString() : "To be determined"}</p>
                <p><strong>Time:</strong> {interviewTime}</p>
                {notes && <p><strong>Additional Information:</strong> {notes}</p>}
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule Interview & Send Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InterviewModal;