import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from 'react-i18next';
import "react-toastify/dist/ReactToastify.css";
import "./UpdateUserProfilePage.css";

// استيراد أيقونات محسنة
import {
  FaEdit,
  FaSync,
  FaUpload,
  FaTrash,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSave,
  FaUndo,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaBirthdayCake,
  FaIdCard,
  FaImage,
  FaQuestionCircle,
  FaPhone,
  FaLock
} from "react-icons/fa";

function UpdateUserProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    age: "",
    profileImage: ""
  });
  
  const [originalData, setOriginalData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        let targetId = id;
        
        if (!targetId) {
          const storedUser = localStorage.getItem('userData');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            targetId = userData.id;
          }
        }

        if (!targetId) {
          throw new Error("User ID not found");
        }

        console.log("Fetching user data for update, userId:", targetId);
        
        const response = await fetch(`https://irshad-ovo6.onrender.com/auth/profile/${targetId}`, {
          credentials: "include"
        });
        
        if (!response.ok) throw new Error("Failed to fetch user data");
        
        const userData = await response.json();
        console.log("User data from API:", userData);
        
        let formattedBirthDate = "";
        if (userData.birthDate) {
          const date = new Date(userData.birthDate);
          if (!isNaN(date.getTime())) {
            formattedBirthDate = date.toISOString().split('T')[0];
          }
        }
        
        const userFormData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          birthDate: formattedBirthDate,
          age: userData.age ? userData.age.toString() : "",
          profileImage: userData.profileImage || ""
        };
        
        setFormData(userFormData);
        setOriginalData(userFormData);
        
        if (userData.profileImage) {
          const fullUrl = getFullImageUrl(userData.profileImage);
          setImagePreview(fullUrl);
        }
        
        if (!id && userData.id) {
          window.history.replaceState(null, '', `/user/profile/edit/${userData.id}`);
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            let formattedBirthDate = "";
            if (userData.birthDate) {
              const date = new Date(userData.birthDate);
              if (!isNaN(date.getTime())) {
                formattedBirthDate = date.toISOString().split('T')[0];
              }
            }
            
            const userFormData = {
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
              birthDate: formattedBirthDate,
              age: userData.age ? userData.age.toString() : "",
              profileImage: userData.profileImage || ""
            };
            
            setFormData(userFormData);
            setOriginalData(userFormData);
            
            if (userData.profileImage) {
              const fullUrl = getFullImageUrl(userData.profileImage);
              setImagePreview(fullUrl);
            }
          } catch (localError) {
            console.error("Error loading from localStorage:", localError);
            toast.error(t("Failed to load user data"));
          }
        } else {
          toast.error(t("Failed to load user data"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, t]);

  const getFullImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith('http')) return path;
    if (path.startsWith('uploads/')) {
      return `https://irshad-ovo6.onrender.com/${path}`;
    }
    return `https://irshad-ovo6.onrender.com/uploads/profile/${path}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData(prev => ({
      ...prev,
      profileImage: ""
    }));
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!formData.firstName.trim()) {
        toast.error(t("First name is required"));
        setSaving(false);
        return;
      }
      
      if (!formData.lastName.trim()) {
        toast.error(t("Last name is required"));
        setSaving(false);
        return;
      }
      
      if (!formData.email.trim()) {
        toast.error(t("Email is required"));
        setSaving(false);
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error(t("Please enter a valid email address"));
        setSaving(false);
        return;
      }
      
      const targetId = id || JSON.parse(localStorage.getItem('userData'))?.id;
      
      if (!targetId) {
        throw new Error("User ID not found");
      }
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim());
      
      if (formData.birthDate) {
        formDataToSend.append('birthDate', formData.birthDate);
      }
      
      if (formData.age && !isNaN(parseInt(formData.age))) {
        formDataToSend.append('age', formData.age);
      }
      
      if (selectedFile) {
        formDataToSend.append('profileImage', selectedFile);
      } else if (formData.profileImage === "") {
        formDataToSend.append('profileImage', "");
      }
      
      console.log("Sending form data with file:", selectedFile ? "Yes" : "No");
      
      const response = await fetch(`https://irshad-ovo6.onrender.com/auth/update/${targetId}`, {
        method: 'PUT',
        body: formDataToSend,
        credentials: 'include'
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }
      
      console.log("Update successful:", responseData);
      
      const updatedUser = {
        ...originalData,
        ...formData,
        profileImage: responseData.profileImage || formData.profileImage
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      toast.success(t("Profile updated successfully!"));
      
      setTimeout(() => {
        navigate('/user/profile');
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`${t("Failed to update profile")}: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm(t("Are you sure you want to cancel? All changes will be lost."))) {
      navigate('/user/profile');
    }
  };

  const isFormChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData) || selectedFile;
  };

  if (loading) {
    return (
      <div className="update-profile-loading-container">
        <div className="update-profile-loading-spinner"></div>
        <p>{t("Loading user data...")}</p>
      </div>
    );
  }

  return (
    <div className="update-profile-page-container">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="update-profile-page-header">
        <h1><FaEdit /> {t("Edit Profile")}</h1>
        <p className="update-profile-page-subtitle">{t("Update your personal information")}</p>
      </div>

      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="update-profile-form-content">
          {/* Left Column - Profile Image */}
          <div className="update-profile-form-left">
            <div className="update-profile-image-section">
              <h3><FaImage /> {t("Profile Picture")}</h3>
              <div className="update-profile-image-upload-area">
                <div className="update-profile-image-preview">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt={t("Profile preview")}
                      className="update-profile-preview-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="update-profile-no-image">
                      <span className="update-profile-no-image-icon"><FaUser /></span>
                      <span className="update-profile-no-image-text">{t("No image")}</span>
                    </div>
                  )}
                </div>
                
                <div className="update-profile-image-actions">
                  <div className="update-profile-file-upload-btn">
                    <label htmlFor="image-upload" className="update-profile-btn-upload">
                      <FaUpload /> {t("Select Image")}
                    </label>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="update-profile-file-input"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="update-profile-btn-remove-image"
                    disabled={!imagePreview}
                  >
                    <FaTrash /> {t("Remove")}
                  </button>
                </div>
                
 
              </div>
            </div>
            
            <div className="update-profile-help-section">
              <h4><FaInfoCircle /> {t("Tips")}</h4>
              <ul className="update-profile-help-tips">
                <li>{t("Use a clear, professional photo")}</li>
                <li>{t("Ensure your face is visible")}</li>
                <li>{t("Recommended size: 300x300 pixels")}</li>
                <li>{t("Supported formats: JPG, PNG, GIF")}</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="update-profile-form-right">
            <div className="update-profile-form-section">
              <h3><FaUser /> {t("Personal Information")}</h3>
              
              <div className="update-profile-form-grid">
                <div className="update-profile-form-group">
                  <label htmlFor="firstName" className="required">
                    <FaUser /> {t("First Name")}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="update-profile-form-input"
                    placeholder={t("Enter your first name")}
                  />
                  {formData.firstName !== originalData.firstName && (
                    <span className="update-profile-field-changed"><FaEdit /></span>
                  )}
                </div>

                <div className="update-profile-form-group">
                  <label htmlFor="lastName" className="required">
                    <FaUser /> {t("Last Name")}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="update-profile-form-input"
                    placeholder={t("Enter your last name")}
                  />
                  {formData.lastName !== originalData.lastName && (
                    <span className="update-profile-field-changed"><FaEdit /></span>
                  )}
                </div>

                <div className="update-profile-form-group">
                  <label htmlFor="email" className="required">
                    <FaEnvelope /> {t("Email Address")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="update-profile-form-input"
                    placeholder="user@example.com"
                  />
                  {formData.email !== originalData.email && (
                    <span className="update-profile-field-changed"><FaEdit /></span>
                  )}
                  <small className="update-profile-input-hint">
                    {t("This will be used for login and notifications")}
                  </small>
                </div>

                <div className="update-profile-form-group">
                  <label htmlFor="birthDate">
                    <FaCalendarAlt /> {t("Birth Date")}
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="update-profile-form-input"
                  />
                  {formData.birthDate !== originalData.birthDate && (
                    <span className="update-profile-field-changed"><FaEdit /></span>
                  )}
                </div>

                <div className="update-profile-form-group">
                  <label htmlFor="age">
                    <FaBirthdayCake /> {t("Age")}
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="update-profile-form-input"
                    placeholder={t("Enter your age")}
                  />
                  {formData.age !== originalData.age && (
                    <span className="update-profile-field-changed"><FaEdit /></span>
                  )}
                  <small className="update-profile-input-hint">
                    {t("Leave empty if you prefer not to specify")}
                  </small>
                </div>
              </div>
            </div>

            <div className="update-profile-form-notice">
              <div className="update-profile-notice-icon"><FaExclamationTriangle /></div>
              <div className="update-profile-notice-content">
                <strong>{t("Important")}:</strong> {t("Your resume information cannot be edited here. Please use the separate resume management page for updates.")}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="update-profile-form-actions">
          <div className="update-profile-actions-left">
            <button
              type="button"
              onClick={handleCancel}
              className="update-profile-btn-cancel"
              disabled={saving}
            >
              <FaTimes /> {t("Cancel")}
            </button>
          </div>
          
          <div className="update-profile-actions-right">
            <button
              type="button"
              onClick={() => {
                setFormData(originalData);
                setSelectedFile(null);
                if (originalData.profileImage) {
                  setImagePreview(getFullImageUrl(originalData.profileImage));
                } else {
                  setImagePreview("");
                }
                toast.info(t("All changes have been reset"));
              }}
              className="update-profile-btn-reset"
              disabled={!isFormChanged() || saving}
            >
              <FaUndo /> {t("Reset Changes")}
            </button>
            
            <button
              type="submit"
              className="update-profile-btn-save"
              disabled={(!isFormChanged() && !selectedFile) || saving}
            >
              {saving ? (
                <>
                  <span className="update-profile-spinner-small"></span>
                  {t("Saving...")}
                </>
              ) : (
                <>
                  <FaSave /> {t("Save Changes")}
                  {isFormChanged() && <span className="update-profile-save-badge">!</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </form>


    </div>
  );
}

export default UpdateUserProfilePage;