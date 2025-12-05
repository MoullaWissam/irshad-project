import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ApplicationForm.css";

export default function ApplicationForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // معرفة إذا كان هناك اختبار مكتمل
  const testCompleted = location.state?.testCompleted;
  const jobData = location.state?.jobData;
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resumeFile: null,
    resumeName: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // إزالة خطأ الحقل عند البدء بالكتابة
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من نوع الملف (PDF أو DOC)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, resume: "Please upload PDF or Word files only" });
        return;
      }
      
      // التحقق من حجم الملف (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: "File size should be less than 5MB" });
        return;
      }
      
      setFormData({
        ...formData,
        resumeFile: file,
        resumeName: file.name
      });
      
      setErrors({ ...errors, resume: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required";
    if (!formData.resumeFile) newErrors.resume = "Resume is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // جلب نتيجة الاختبار من localStorage إذا كانت موجودة
      const testScore = localStorage.getItem(`test_score_${jobId}`);
      const testAnswers = localStorage.getItem(`test_answers_${jobId}`);
      
      // بناء البيانات للإرسال
      const applicationData = {
        jobId,
        applicantInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          coverLetter: formData.coverLetter,
          resumeFileName: formData.resumeName,
          // إضافة بيانات الاختبار فقط إذا كان هناك اختبار مكتمل
          ...(testCompleted && {
            testCompleted: true,
            testScore: testScore ? parseFloat(testScore) : null,
            testAnswers: testAnswers ? JSON.parse(testAnswers) : null
          })
        },
        jobDetails: jobData,
        submittedAt: new Date().toISOString()
      };
      
      console.log("Submitting job application:", applicationData);
      
      // محاكاة إرسال البيانات إلى API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تنظيف بيانات الاختبار من localStorage بعد الإرسال
      if (testCompleted) {
        localStorage.removeItem(`test_score_${jobId}`);
        localStorage.removeItem(`test_answers_${jobId}`);
      }
      
      // إظهار رسالة النجاح
      setSubmitSuccess(true);
      
      // إعادة توجيه بعد 3 ثواني
      setTimeout(() => {
        navigate(`/job/${jobId}/application-success`);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrors({ submit: "Failed to submit application. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/job/${jobId}`);
  };

  if (submitSuccess) {
    return (
      <div className="application-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Application Submitted Successfully!</h2>
          <p>Your application has been received. We will review your application and contact you soon.</p>
          <button 
            className="back-to-job-btn"
            onClick={() => navigate(`/job/${jobId}`)}
          >
            Back to Job Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-container">
      <div className="application-content">
        <div className="application-header">
          <h1 className="application-title">Job Application</h1>
          {jobData && (
            <div className="job-info-banner">
              <h3>{jobData.title}</h3>
              <p>Company: {jobData.companyName} | Location: {jobData.location}</p>
            </div>
          )}
          
          {testCompleted && (
            <div className="test-completed-banner">
              <span className="test-icon">✓</span>
              <div>
                <p><strong>Screening test completed</strong></p>
                <p>Your test answers have been recorded and will be reviewed by the employer.</p>
              </div>
            </div>
          )}
        </div>

        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? "error" : ""}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "error" : ""}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label>Resume/CV *</label>
                <div className="file-upload-container">
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                    <span className="file-upload-button">📁 Choose File</span>
                    <span className="file-name">
                      {formData.resumeName || "No file chosen"}
                    </span>
                  </label>
                </div>
                {errors.resume && <span className="error-message">{errors.resume}</span>}
                <small className="file-hint">PDF or Word only (max 5MB)</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Cover Letter</h3>
            <div className="form-group">
              <label htmlFor="coverLetter">
                Why are you suitable for this position? *
                <span className="hint"> (Tell us about your relevant skills and experience)</span>
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                className={errors.coverLetter ? "error" : ""}
                placeholder="Write your cover letter here..."
                rows="6"
              />
              {errors.coverLetter && <span className="error-message">{errors.coverLetter}</span>}
            </div>
          </div>

          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}