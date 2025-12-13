import React from "react";
import "./ConfirmationModal.css";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm" }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="confirmation-icon">⚠️</div>
          <p className="confirmation-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;