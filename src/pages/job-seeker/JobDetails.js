import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasTest, setHasTest] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // بيانات تجريبية للاختبار - يمكنك إضافة API حقيقي هنا
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
            hasTest: true, // هذه الوظيفة بها اختبار
            testDuration: 5, // مدة الاختبار بالدقائق
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
            hasTest: false // هذه الوظيفة بدون اختبار
          }
        };
        
        const data = mockJobs[jobId] || mockJobs[1];
        setJob(data);
        setHasTest(data.hasTest || false);
      } catch (error) {
        console.error("Failed to load job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = () => {
    if (hasTest) {
      // إذا كان هناك اختبار، انتقل إلى صفحة الاختبار
      navigate(`/job/${jobId}/test`, { state: { jobData: job } });
    } else {
      // إذا لم يكن هناك اختبار، عرض تأكيد
      setShowConfirmation(true);
    }
  };

  const confirmApplyWithoutTest = () => {
    // محاكاة إرسال الطلب مباشرة للوظائف بدون اختبار
    const applicationData = {
      jobId,
      jobDetails: job,
      appliedAt: new Date().toISOString(),
      status: "submitted"
    };
    
    console.log("Submitting application (no test):", applicationData);
    
    // تخزين في localStorage لإظهار رسالة النجاح
    localStorage.setItem(`application_submitted_${jobId}`, "true");
    
    // إعادة توجيه إلى صفحة النجاح
    navigate(`/job/${jobId}/application-success`, { 
      state: { 
        jobData: job,
        testCompleted: false
      } 
    });
  };

  const cancelApply = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="jobdetails-container">
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
      <div className="jobdetails-content">
        {/* Header */}
        <div className="job-header">
          <div>
            <h1 className="job-title">{job.title}</h1>
            <p className="job-meta">
              FULL TIME <span> | </span> Location: {job.location}
            </p>
          </div>

          <button className="apply-btn" onClick={handleApply}>
            {hasTest ? "Apply & Start Test" : "Apply Now"}
          </button>
        </div>

        {/* Company Section */}
        <div className="company-box">
          <div className="company-icon">
            <div className="company-avatar">{job.companyName.charAt(0)}</div>
          </div>
          <h3>{job.companyName}</h3>
        </div>

        {/* Sections */}
        <div className="job-section">
          <h4>Job Description</h4>
          <p>{job.description}</p>
        </div>

        <div className="job-section">
          <h4>Required Skills</h4>
          <p>{job.skills}</p>
        </div>

        <div className="job-section">
          <h4>Required Experience</h4>
          <p>{job.experience}</p>
        </div>

        <div className="job-section">
          <h4>Required Education</h4>
          <p>{job.education}</p>
        </div>
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
              <button className="confirm-btn" onClick={confirmApplyWithoutTest}>
                Yes, Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}