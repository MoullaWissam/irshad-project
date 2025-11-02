import React from "react";
import "./ApplicantCard.css";

function ApplicantCard({ name, description, avatar, rank }) {
  // تحديد لون الإطار حسب الرانك
  const getBorderColor = () => {
    switch (rank) {
      case 1:
        return "#FFD700"; // ذهبي
      case 2:
        return "#C0C0C0"; // فضي
      case 3:
        return "#CD7F32"; // برونزي
      default:
        return "#ffffff"; // أبيض
    }
  };

  return (
    <div className="applicant-card" style={{ borderColor: getBorderColor() }}>
      <img src={avatar} alt={name} className="applicant-avatar" />
      <h3 className="applicant-name">{name}</h3>
      <p className="applicant-desc">{description}</p>
      <button className="details-btn">details</button>
    </div>
  );
}

export default ApplicantCard;
