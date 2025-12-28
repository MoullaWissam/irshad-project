import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  ChevronRight
} from "lucide-react";
import "./JobCard.css";

function JobCard({
  id,
  icon,
  title,
  desc,
  type,
  company,
  location,
  salary,
  skills,
  experience,
  education
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultIcon =
    "https://cdn-icons-png.flaticon.com/512/3067/3067256.png";

  const truncateText = (text, max = 60) => {
    if (!text) return "";
    const str = Array.isArray(text) ? text.join(", ") : String(text);
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  const skillsArray = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
    ? skills.split(",").map(s => s.trim())
    : [];

  return (
    <div className="jc-wrapper">
      {/* Header */}
      <div className="jc-header">
        <img
          src={icon || defaultIcon}
          alt={title}
          onError={e => (e.target.src = defaultIcon)}
          className="jc-icon"
        />
        <span className="jc-type">{type || "Full Time"}</span>
      </div>

      {/* Title */}
      <h3 className="jc-title">{truncateText(title, 40)}</h3>

      {/* Company / Location / Salary */}
      <div className="jc-meta">
        {company && (
          <span>
            <Building2 size={14} /> {truncateText(company, 18)}
          </span>
        )}
        {location && (
          <span>
            <MapPin size={14} /> {truncateText(location, 16)}
          </span>
        )}
        {salary && (
          <span>
            <DollarSign size={14} /> {truncateText(salary, 14)}
          </span>
        )}
      </div>

      {/* Description */}
      {desc && (
        <p className="jc-desc">
          {isExpanded ? desc : truncateText(desc, 80)}
          {desc.length > 80 && (
            <button
              className="jc-read-more"
              onClick={e => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? " Less" : " More"}
            </button>
          )}
        </p>
      )}

      {/* Skills */}
      {skillsArray.length > 0 && (
        <div className="jc-skills">
          {skillsArray.slice(0, 6).map((skill, i) => (
            <span key={i} className="jc-skill">{truncateText(skill, 14)}</span>
          ))}
          {skillsArray.length > 6 && (
            <span className="jc-skill-more">+{skillsArray.length - 6}</span>
          )}
        </div>
      )}

      {/* Experience / Education */}
      {(experience || education) && (
        <div className="jc-req">
          {experience && (
            <span>
              <Briefcase size={14} /> {truncateText(experience, 22)}
            </span>
          )}
          {education && (
            <span>
              <GraduationCap size={14} /> {truncateText(education, 22)}
            </span>
          )}
        </div>
      )}

      {/* Button */}
      <button
        className="jc-details-btn"
        onClick={e => {
          e.stopPropagation();
          navigate(`/job/${id}`);
        }}
      >
        Details <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default JobCard;
