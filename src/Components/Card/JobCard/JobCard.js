import React from "react";
import "./JobCard.css";

function JobCard({ icon, title, desc, type }) {
  // صورة افتراضية في حالة عدم وجود أيقونة
  const defaultIcon = "https://cdn-icons-png.flaticon.com/512/3067/3067256.png";
  
  const handleCardClick = () => {
    // هنا يمكنك إضافة منطق عند النقر على البطاقة
    console.log(`Clicked on ${title}`);
    // أو توجيه المستخدم لصفحة تفاصيل الوظيفة
    // navigate(`/job/${jobId}`);
  };
  
  const handleDetailsClick = (e) => {
    e.stopPropagation(); // منع تنفيذ حدث النقر على البطاقة
    // هنا يمكنك إضافة منطق لزر "More Details"
    alert(`More details about ${title}`);
  };
  
  const handleImageError = (e) => {
    // إذا فشل تحميل الصورة، استبدلها بصورة افتراضية
    e.target.src = defaultIcon;
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      <div className="job-header">
        <img 
          src={icon || defaultIcon} 
          alt={title} 
          className="job-icon" 
          onError={handleImageError}
        />
        <span className="job-type">{type}</span>
      </div>
      <h3 className="job-title">{title}</h3>
      <p className="job-desc">{desc}</p>
      <button className="job-link" onClick={handleDetailsClick}>
        More Details ↗
      </button>
    </div>
  );
}

export default JobCard;