import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ id, icon, title, desc, type }) {
  const navigate = useNavigate();
  
  const defaultIcon = "https://cdn-icons-png.flaticon.com/512/3067/3067256.png";  

  const handleCardClick = () => {
    navigate(`/job/${id}`);
  };
  
  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/job/${id}`);
  };
  
  const handleImageError = (e) => {
    e.target.src = defaultIcon;
  };

  return (
    <div className="job-card-wrapper" onClick={handleCardClick}>
      <div className="job-card-header-wrapper">
        <img 
          src={icon || defaultIcon} 
          alt={title} 
          className="job-card-icon-wrapper" 
          onError={handleImageError}
        />
        <span className="job-card-type-tag">{type}</span>
      </div>
      <h3 className="job-card-title-text">{title}</h3>
      <p className="job-card-description">{desc}</p>
      <button className="job-card-details-btn" onClick={handleDetailsClick}>
        More Details ↗
      </button>
    </div>
  );
}

export default JobCard;