import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faClock, 
  faBriefcase, 
  faFileAlt, 
  faTools, 
  faBullseye, 
  faGraduationCap, 
  faStar, 
  faTasks, 
  faMoneyBillWave, 
  faPaperPlane,
  faBuilding,
  faCalendarAlt,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasTest, setHasTest] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [userType, setUserType] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  const iconStyle = {
    color: '#0b2b82',
    marginRight: '5px'
  };

  useEffect(() => { 
    const fetchJob = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(t("Failed to fetch job: {status}", { status: response.status }));
        }
        
        const data = await response.json();
        setJob(data);
        setHasTest(data.hasTest || false);
        
      } catch (error) {
        console.error("Failed to load job:", error);
        
        toast.error(t("Failed to load job details"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 3000,
          rtl: isRTL
        });
        
        const mockJobs = {
          1: {
            id: 1,
            title: t("Email Marketing Specialist"),
            type: t("FULL TIME"),
            location: t("Damascus"),
            companyName: t("Tech Solutions Inc."),
            description: t("We are seeking a skilled Email Marketing Specialist to join our dynamic marketing team. You will be responsible for creating and executing email marketing campaigns, analyzing performance metrics, and optimizing strategies for maximum engagement."),
            skills: t("Email Marketing, Copywriting, Analytics, CRM Tools, A/B Testing"),
            experience: t("3+ years in digital marketing"),
            education: t("Bachelor's degree in Marketing or related field"),
            hasTest: true,
            testDuration: 5,
          },
          2: {
            id: 2,
            title: t("Frontend Developer"),
            type: t("FULL TIME"),
            location: t("Remote"),
            companyName: t("WebTech Co."),
            description: t("Looking for a skilled frontend developer with React experience. You will be responsible for building user interfaces, implementing responsive designs, and collaborating with backend developers."),
            skills: t("React, JavaScript, HTML5, CSS3, Git, Responsive Design"),
            experience: t("2+ years in frontend development"),
            education: t("Computer Science or equivalent"),
            hasTest: false
          }
        };
        
        const mockData = mockJobs[jobId] || mockJobs[1];
        setJob(mockData);
        setHasTest(mockData.hasTest || false);
        
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, t]);

  useEffect(() => {
    const companyData = localStorage.getItem('companyData');
    const userData = localStorage.getItem('userData');
    
    if (companyData) {
      setUserType('company');
    } else if (userData) {
      setUserType('user');
    } else {
      setUserType(null);
    }
  }, []);

  const handleApply = () => {
    if (hasTest) {
      navigate(`/job/${jobId}/test`, { state: { jobData: job } });
    } else {
      setShowConfirmation(true);
    }
  };

  const confirmApplyWithoutTest = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`http://localhost:3000/jobapply/${jobId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(t("HTTP error! status: {status}", { status: response.status }));
      }
      
      const result = await response.json();
      
      toast.success(t("Application submitted successfully!"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL
      });
      
      navigate(`/job/${jobId}/application-success`, { 
        state: { 
          jobData: job,
          applicationResult: result,
          testCompleted: false
        } 
      });
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(t("Failed to submit application"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL
      });
    } finally {
      setIsApplying(false);
      setShowConfirmation(false);
    }
  };

  const handleEditJob = () => {
    navigate(`/job/${jobId}/edit`);
  };

  const handleDeleteJob = async () => {
    if (!window.confirm(t("Are you sure you want to delete this job? This action cannot be undone."))) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(t("Delete failed: {status}", { status: response.status }));
      }
      
      toast.success(t("Job deleted successfully!"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL
      });
      
      setTimeout(() => {
        navigate('/job-management');
      }, 1500);
      
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.message, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL
      });
    }
  };

  const cancelApply = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="job-details-page" dir={isRTL ? 'rtl' : 'ltr'} style={robotoStyle}>
        <ToastContainer 
          position={isRTL ? "top-left" : "top-right"}
          rtl={isRTL}
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
        <div className="job-loading-state">
          <div className="loading-spinner-animation"></div>
          <p style={robotoStyle}>{t("Loading job details...")}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page" dir={isRTL ? 'rtl' : 'ltr'} style={robotoStyle}>
        <ToastContainer 
          position={isRTL ? "top-left" : "top-right"}
          rtl={isRTL}
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
        <div className="job-error-state">
          <h2 style={robotoStyle}>{t("Job Not Found")}</h2>
          <p style={robotoStyle}>{t("The job you're looking for doesn't exist or has been removed.")}</p>
          <button 
            onClick={() => navigate('/jobs')}
            style={{  fontWeight: 500 }}
          >
            {t("Back to Jobs")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page" dir={isRTL ? 'rtl' : 'ltr'} style={robotoStyle}>
      <ToastContainer 
        position={isRTL ? "top-left" : "top-right"}
        rtl={isRTL}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      />
      
      <div className="job-details-content">
        <div className="navigation-back-link" onClick={() => navigate('/jobs')} style={robotoStyle}>
          <FontAwesomeIcon icon={faTimesCircle} style={iconStyle} />
          {t("Back to Jobs")}
        </div>
        
        <div className="job-header-section">
          <div className="job-title-area">
            <h1 className="job-main-title" style={{  fontWeight: 600 }}>
              {job.title || t("Untitled Job")}
            </h1>
            <div className="job-info-meta" style={robotoStyle}>
              <span className="job-info-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={iconStyle} />
                {job.location || t("Not specified")}
              </span>
              <span className="job-info-item">
                <FontAwesomeIcon icon={faClock} style={iconStyle} />
                {job.type || t("FULL TIME")}
              </span>
              <span className="job-info-item">
                <FontAwesomeIcon icon={faBriefcase} style={iconStyle} />
                {job.employmentType || t("Full-time")}
              </span>
            </div>
            {job.salary && (
              <div className="job-salary-tag" style={robotoStyle}>
                <FontAwesomeIcon icon={faMoneyBillWave} style={iconStyle} />
                {job.salary}
              </div>
            )}
          </div>

          <div className="apply-action-area">
            {userType === 'company' && (
              <div className="company-management-actions">
                <button 
                  className="edit-job-action"
                  onClick={handleEditJob}
                  style={{  fontWeight: 500 }}
                >
                  {t("Edit Job")}
                </button>
                <button 
                  className="delete-job-action"
                  onClick={handleDeleteJob}
                  style={{  fontWeight: 500 }}
                >
                  {t("Delete Job")}
                </button>
              </div>
            )}

            {userType === 'user' && (
              <div className="apply-action-container">
                <button 
                  className="job-apply-button" 
                  onClick={handleApply}
                  disabled={isApplying}
                  style={{  fontWeight: 500 }}
                >
                  {isApplying ? t("Applying...") : (hasTest ? t("Apply & Start Test") : t("Apply Now"))}
                </button>
                {job.createdAt && (
                  <p className="job-posted-date" style={robotoStyle}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={iconStyle} />
                    {t("Posted")}: {new Date(job.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="job-company-card">
          <div className="company-logo-avatar" style={{ 
  backgroundColor: job.image ? 'white' : '', 
  background: job.image ? 'white' : 'linear-gradient(135deg, #0b2b82 0%, #1a4dc7 100%)'
}}>
  {job.image ? (
    <img 
      src={job.image} 
      alt={job.companyName || t("Company Logo")}
      className="company-logo-image"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  ) : (
    <svg data-prefix="fas" data-icon="building" className="svg-inline--fa fa-building" role="img" viewBox="0 0 384 512" aria-hidden="true" style={{color: 'white', fontSize: '26px'}}>
      <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM176 352l32 0c17.7 0 32 14.3 32 32l0 80-96 0 0-80c0-17.7 14.3-32 32-32zM96 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM240 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM96 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"></path>
    </svg>
  )}
</div>
          <div className="company-details-info">
            <h3 className="company-title-name" style={{  fontWeight: 600 }}>
              {job.companyName || t("Unknown Company")}
            </h3>
            <p className="company-brief-description" style={robotoStyle}>
              {job.companyDescription || t("A leading company in its field")}
            </p>
            {job.companyRating && (
              <div className="company-rating-stars">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-value" style={robotoStyle}>{job.companyRating}/5</span>
              </div>
            )}
          </div>
        </div>

        {job.tags && (
          <div className="job-categories-tags">
            {job.tags.split(',').map((tag, index) => (
              <span key={index} className="category-tag" style={robotoStyle}>{tag.trim()}</span>
            ))}
          </div>
        )}

        <div className="job-sections-grid">
          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faFileAlt} style={iconStyle} />
              <h4 style={{  fontWeight: 600 }}>{t("Job Description")}</h4>
            </div>
            <p style={robotoStyle}>{job.description || t("No description available")}</p>
          </div>

          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faTools} style={iconStyle} />
              <h4 style={{  fontWeight: 600 }}>{t("Required Skills")}</h4>
            </div>
            <div className="skills-grid-container">
              {job.skills ? job.skills.split(',').map((skill, index) => (
                <div key={index} className="skill-tag-item" style={robotoStyle}>
                  <strong>{skill.trim()}</strong>
                </div>
              )) : <p style={robotoStyle}>{t("Not specified")}</p>}
            </div>
          </div>

          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faBullseye} style={iconStyle} />
              <h4 style={{  fontWeight: 600 }}>{t("Required Experience")}</h4>
            </div>
            <p style={robotoStyle}>{job.experience || t("Not specified")}</p>
          </div>

          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faGraduationCap} style={iconStyle} />
              <h4 style={{  fontWeight: 600 }}>{t("Required Education")}</h4>
            </div>
            <p style={robotoStyle}>{job.education || t("Not specified")}</p>
          </div>

          {job.benefits && (
            <div className="job-detail-card">
              <div className="detail-card-header">
                <FontAwesomeIcon icon={faStar} style={iconStyle} />
                <h4 style={{  fontWeight: 600 }}>{t("Benefits & Perks")}</h4>
              </div>
              <ul style={robotoStyle}>
                {job.benefits.split(',').map((benefit, index) => (
                  <li key={index}>{benefit.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities && (
            <div className="job-detail-card">
              <div className="detail-card-header">
                <FontAwesomeIcon icon={faTasks} style={iconStyle} />
                <h4 style={{  fontWeight: 600 }}>{t("Key Responsibilities")}</h4>
              </div>
              <ul style={robotoStyle}>
                {job.responsibilities.split(',').map((responsibility, index) => (
                  <li key={index}>{responsibility.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {hasTest && (
            <div className="job-detail-card test-info">
              <div className="detail-card-header">
                <FontAwesomeIcon icon={faFileAlt} style={iconStyle} />
                <h4 style={{  fontWeight: 600 }}>{t("Test Information")}</h4>
              </div>
              <p style={robotoStyle}>{t("This job requires a screening test.")}</p>
              <p style={robotoStyle}>{t("Estimated time: {duration} minutes", { duration: job.testDuration || 5 })}</p>
            </div>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-dialog-box">
            <div className="dialog-icon">
              <FontAwesomeIcon icon={faPaperPlane} style={{color: '#00b4d8', fontSize: '52px'}} />
            </div>
            <h3 style={{  fontWeight: 600 }}>{t("Confirm Application")}</h3>
            <p style={robotoStyle}>{t("Are you sure you want to apply for this position?")}</p>
            <p style={{...robotoStyle, fontSize: '14px', color: '#666', marginTop: '-10px'}}>
              {t("Your application will be sent directly to the employer.")}
            </p>
            <div className="dialog-action-buttons">
              <button 
                className="dialog-cancel-button" 
                onClick={cancelApply}
                style={{  fontWeight: 500 }}
              >
                {t("Cancel")}
              </button>
              <button 
                className="dialog-confirm-button" 
                onClick={confirmApplyWithoutTest}
                disabled={isApplying}
                style={{  fontWeight: 500 }}
              >
                {isApplying ? t("Applying...") : t("Yes, Apply Now")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}