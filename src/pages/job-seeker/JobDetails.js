import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasTest, setHasTest] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => { 
    const fetchJob = async () => {
      try {
        setLoading(true);
        
        // جلب البيانات من API الحقيقي مع credentials
        const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch job: ${response.status}`);
        }
        
        const data = await response.json();
        setJob(data);
        setHasTest(data.hasTest || false);
        
      } catch (error) {
        console.error("Failed to load job:", error);
        
        toast.error("❌ Failed to load job details", {
          position: "top-right",
          autoClose: 3000,
        });
        
        // استخدام بيانات تجريبية في حالة فشل API
        const mockJobs = {
          1: {
            id: 1,
            title: "Email Marketing Specialist",
            type: "FULL TIME",
            location: "Damascus",
            companyName: "Tech Solutions Inc.",
            description: "We are seeking a skilled Email Marketing Specialist to join our dynamic marketing team. You will be responsible for creating and executing email marketing campaigns, analyzing performance metrics, and optimizing strategies for maximum engagement.",
            skills: "Email Marketing, Copywriting, Analytics, CRM Tools, A/B Testing",
            experience: "3+ years in digital marketing",
            education: "Bachelor's degree in Marketing or related field",
            hasTest: true,
            testDuration: 5,
          },
          2: {
            id: 2,
            title: "Frontend Developer",
            type: "FULL TIME",
            location: "Remote",
            companyName: "WebTech Co.",
            description: "Looking for a skilled frontend developer with React experience. You will be responsible for building user interfaces, implementing responsive designs, and collaborating with backend developers.",
            skills: "React, JavaScript, HTML5, CSS3, Git, Responsive Design",
            experience: "2+ years in frontend development",
            education: "Computer Science or equivalent",
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
  }, [jobId]);

  const handleApply = () => {
  if (hasTest) {
    // إذا كان هناك اختبار، انتقل مباشرة إلى صفحة الاختبار
    navigate(`/job/${jobId}/test`, { state: { jobData: job } });
  } else {
    // إذا لم يكن هناك اختبار، اعرض نافذة التأكيد
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Application submitted:", result);
    
    toast.success("✅ Application submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
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
    toast.error("❌ Failed to submit application", {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setIsApplying(false);
    setShowConfirmation(false);
  }
};


  const cancelApply = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="jobdetails-container">
        <ToastContainer />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jobdetails-container">
        <ToastContainer />
        <div className="error-message">
          <h2>Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/jobs')}>Back to Jobs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="jobdetails-container">
      <ToastContainer />
      
      <div className="jobdetails-content">
        {/* Header */}
        <div className="job-header">
          <div>
            <h1 className="job-title">{job.title || "Untitled Job"}</h1>
            <p className="job-meta">
              {job.type || "FULL TIME"} <span> | </span> Location: {job.location || "Not specified"}
            </p>
          </div>

          <button 
            className="apply-btn" 
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? "Applying..." : (hasTest ? "Apply & Start Test" : "Apply Now")}
          </button>
        </div>

        {/* Company Section */}
        <div className="company-box">
          <div className="company-icon">
            <div className="company-avatar">
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>
          <h3>{job.companyName || "Unknown Company"}</h3>
        </div>

        {/* Job Image if available */}
        {job.image && (
          <div className="job-image-section">
            <img 
              src={job.image} 
              alt={job.title}
              className="job-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Sections */}
        <div className="job-section">
          <h4>Job Description</h4>
          <p>{job.description || "No description available"}</p>
        </div>

        <div className="job-section">
          <h4>Required Skills</h4>
          <p>{job.skills || "Not specified"}</p>
        </div>

        <div className="job-section">
          <h4>Required Experience</h4>
          <p>{job.experience || "Not specified"}</p>
        </div>

        <div className="job-section">
          <h4>Required Education</h4>
          <p>{job.education || "Not specified"}</p>
        </div>

        {/* Additional Information */}
        {job.employmentType && (
          <div className="job-section">
            <h4>Employment Type</h4>
            <p>{job.employmentType}</p>
          </div>
        )}

        {job.createdAt && (
          <div className="job-section">
            <h4>Posted Date</h4>
            <p>{new Date(job.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        )}

        {/* Test Information if available */}
        {hasTest && (
          <div className="job-section test-info">
            <h4>📝 Test Information</h4>
            <p>This job requires a screening test.</p>
            <p>Estimated time: {job.testDuration || 5} minutes</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal for jobs without test */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Application</h3>
            <p>Are you sure you want to apply for this position?</p>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={cancelApply}>
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={confirmApplyWithoutTest}
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Yes, Apply Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}