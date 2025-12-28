import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./EditJob.css";
import { useTranslation } from 'react-i18next';

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // حالة النموذج
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    requiredSkills: "",
    requiredExperience: "",
    requiredEducation: "",
    employmentType: "FULL_TIME"
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // نمط خط Roboto
  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  // جلب بيانات الوظيفة الحالية
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(t("Failed to fetch job: {status}", { status: response.status }));
        }
        
        const job = await response.json();
        
        // تعبئة النموذج بالبيانات الحالية
        setFormData({
          title: job.title || "",
          description: job.description || "",
          location: job.location || "",
          requiredSkills: Array.isArray(job.requiredSkills) 
            ? job.requiredSkills.join(', ') 
            : job.requiredSkills || "",
          requiredExperience: job.requiredExperience || "",
          requiredEducation: job.requiredEducation || "",
          employmentType: job.employmentType || "FULL_TIME"
        });
        
        if (job.image) {
          setImagePreview(job.image);
        }
        
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("❌ " + t("Failed to load job details"));
        
        // استخدام بيانات من location.state إذا كانت موجودة
        if (location.state?.jobData) {
          const job = location.state.jobData;
          setFormData({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            requiredSkills: job.requiredSkills || "",
            requiredExperience: job.requiredExperience || "",
            requiredEducation: job.requiredEducation || "",
            employmentType: job.employmentType || "FULL_TIME"
          });
          if (job.image) setImagePreview(job.image);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, location, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // إنشاء preview للصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("❌ " + t("Job title is required"));
      return;
    }
    
    setSaving(true);
    
    try {
      const formDataToSend = new FormData();
      
      // إضافة بيانات النموذج
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('requiredSkills', formData.requiredSkills);
      formDataToSend.append('requiredExperience', formData.requiredExperience);
      formDataToSend.append('requiredEducation', formData.requiredEducation);
      formDataToSend.append('employmentType', formData.employmentType);
      
      // إضافة الصورة إذا كانت جديدة
      if (imageFile) {
        formDataToSend.append('img', imageFile);
      }
      
      const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: 'PUT',
        body: formDataToSend,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("Update failed: {status}", { status: response.status }));
      }
      
      const result = await response.json();
      
      toast.success("✅ " + t("Job updated successfully!"));
      
      // الانتقال إلى صفحة تفاصيل الوظيفة بعد التحديث
      setTimeout(() => {
        navigate(`/job/${jobId}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
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
      
      toast.success("✅ " + t("Job deleted successfully!"));
      
      // الانتقال إلى صفحة إدارة الوظائف
      setTimeout(() => {
        navigate('/job-management');
      }, 1500);
      
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="edit-job-container" dir={isRTL ? 'rtl' : 'ltr'} style={robotoStyle}>
        <ToastContainer 
          position={isRTL ? "top-left" : "top-right"}
          rtl={isRTL}
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p style={robotoStyle}>{t("Loading job details...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-job-container" dir={isRTL ? 'rtl' : 'ltr'} style={robotoStyle}>
      <ToastContainer 
        position={isRTL ? "top-left" : "top-right"}
        rtl={isRTL}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      />
      
      <div className="edit-job-header" style={{ textAlign: isRTL ? 'right' : 'left' }}>
        <h1 style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>{t("Edit Job")}</h1>
        <button 
          className="delete-job-btn"
          onClick={handleDelete}
          style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
        >
          {t("Delete Job")}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="edit-job-form">
        {/* صورة الوظيفة */}
        <div className="form-group image-upload">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Job Image")}
          </label>
          <div className="image-preview-container">
            {imagePreview ? (
              <img src={imagePreview} alt={t("Preview")} className="image-preview" />
            ) : (
              <div className="no-image-placeholder" style={{ fontFamily: "'Roboto', sans-serif" }}>
                {t("No Image")}
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <small style={{ fontFamily: "'Roboto', sans-serif" }}>
            {t("Upload new image (optional)")}
          </small>
        </div>
        
        {/* عنوان الوظيفة */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Job Title *")}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("Enter job title")}
            required
            style={robotoStyle}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* نوع التوظيف */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Employment Type")}
          </label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleInputChange}
            style={robotoStyle}
          >
            <option value="full-time">{t("Full Time")}</option>
            <option value="part-time">{t("Part Time")}</option>
            <option value="remote">{t("Remote")}</option>
            <option value="on-site">{t("On Site")}</option>
          </select>
        </div>
        
        {/* الموقع */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Location")}
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder={t("Enter job location")}
            style={robotoStyle}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* الوصف */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Job Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t("Enter job description")}
            rows="5"
            style={robotoStyle}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* المهارات المطلوبة */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Required Skills")}
          </label>
          <textarea
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleInputChange}
            placeholder={t("Enter required skills (comma separated)")}
            rows="3"
            style={robotoStyle}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <small style={{ fontFamily: "'Roboto', sans-serif" }}>
            {t("Separate skills with commas: JavaScript, React, Node.js")}
          </small>
        </div>
        
        {/* الخبرة المطلوبة */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Required Experience")}
          </label>
          <input
            type="text"
            name="requiredExperience"
            value={formData.requiredExperience}
            onChange={handleInputChange}
            placeholder={t("e.g., 3+ years in software development")}
            style={robotoStyle}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* التعليم المطلوب */}
        <div className="form-group">
          <label style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            {t("Required Education")}
          </label>
          <input
            type="text"
            name="requiredEducation"
            value={formData.requiredEducation}
            onChange={handleInputChange}
            placeholder={t("e.g., Bachelor's degree in Computer Science")}
            style={robotoStyle}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        
        {/* أزرار الإجراءات */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(`/job/${jobId}`)}
            style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="save-btn"
            disabled={saving}
            style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
          >
            {saving ? t("Saving...") : t("Save Changes")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditJob;