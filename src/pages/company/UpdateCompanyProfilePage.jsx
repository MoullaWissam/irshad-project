// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import { useTranslation } from 'react-i18next';
// import "react-toastify/dist/ReactToastify.css";
// import "./UpdateCompanyProfilePage.css";
// import {
//   FiEdit2,
//   FiUpload,
//   FiTrash2,
//   FiEye,
//   FiEyeOff,
//   FiSave,
//   FiX,
//   FiRefreshCw,
//   FiInfo,
//   FiAlertCircle,
//   FiGlobe,
//   FiMapPin,
//   FiMail,
//   FiBriefcase,
//   FiLock,
//   FiCheckCircle,
//   FiXCircle
// } from "react-icons/fi";

// function UpdateCompanyProfilePage() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     companyName: "",
//     companyWebsite: "",
//     companyLocation: "",
//     companyLogo: "",
//     isVerified: false
//   });
  
//   const [originalData, setOriginalData] = useState({});
//   const [logoPreview, setLogoPreview] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       setLoading(true);
//       try {
//         let targetId = id;
        
//         if (!targetId) {
//           const storedCompany = localStorage.getItem('companyData');
//           if (storedCompany) {
//             const companyData = JSON.parse(storedCompany);
//             targetId = companyData.id;
//           }
//         }

//         if (!targetId) {
//           throw new Error("Company ID not found");
//         }

//         const response = await fetch(`https://irshad-ovo6.onrender.com/company-management/profile/${targetId}`, {
//           credentials: "include"
//         });
        
//         if (!response.ok) throw new Error("Failed to fetch company data");
        
//         const companyData = await response.json();
        
//         const companyFormData = {
//           email: companyData.email || "",
//           password: "",
//           companyName: companyData.companyName || "",
//           companyWebsite: companyData.companyWebsite || "",
//           companyLocation: companyData.companyLocation || "",
//           companyLogo: companyData.companyLogo || "",
//           isVerified: companyData.isVerified || false
//         };
        
//         setFormData(companyFormData);
//         setOriginalData(companyFormData);
        
//         if (companyData.companyLogo) {
//           const fullUrl = getFullLogoUrl(companyData.companyLogo);
//           setLogoPreview(fullUrl);
//         }
        
//         if (!id && companyData.id) {
//           window.history.replaceState(null, '', `/company/profile/edit/${companyData.id}`);
//         }
        
//       } catch (error) {
//         console.error("Error fetching company data:", error);
        
//         const storedCompany = localStorage.getItem('companyData');
//         if (storedCompany) {
//           try {
//             const companyData = JSON.parse(storedCompany);
            
//             const companyFormData = {
//               email: companyData.email || "",
//               password: "",
//               companyName: companyData.companyName || "",
//               companyWebsite: companyData.companyWebsite || "",
//               companyLocation: companyData.companyLocation || "",
//               companyLogo: companyData.companyLogo || "",
//               isVerified: companyData.isVerified || false
//             };
            
//             setFormData(companyFormData);
//             setOriginalData(companyFormData);
            
//             if (companyData.companyLogo) {
//               const fullUrl = getFullLogoUrl(companyData.companyLogo);
//               setLogoPreview(fullUrl);
//             }
//           } catch (localError) {
//             console.error("Error loading from localStorage:", localError);
//             toast.error(t("Failed to load company data"));
//           }
//         } else {
//           toast.error(t("Failed to load company data"));
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanyData();
//   }, [id, t]);

//   const getFullLogoUrl = (path) => {
//     if (!path) return "/default-logo.png";
//     if (path.startsWith('http')) return path;
//     if (path.startsWith('uploads/')) {
//       return `https://irshad-ovo6.onrender.com/${path}`;
//     }
//     return `https://irshad-ovo6.onrender.com/uploads/company-logos/${path}`;
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(t("File size must be less than 5MB"));
//       return;
//     }
    
//     if (!file.type.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
//       toast.error(t("Only image files are allowed"));
//       return;
//     }
    
//     setSelectedFile(file);
    
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setLogoPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveLogo = () => {
//     setLogoPreview("");
//     setFormData(prev => ({
//       ...prev,
//       companyLogo: ""
//     }));
//     setSelectedFile(null);
//     toast.info(t("Logo will be removed when you save changes"));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
    
//     try {
//       if (!formData.email.trim()) {
//         toast.error(t("Email is required"));
//         setSaving(false);
//         return;
//       }
      
//       if (!formData.companyName.trim()) {
//         toast.error(t("Company name is required"));
//         setSaving(false);
//         return;
//       }
      
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         toast.error(t("Please enter a valid email address"));
//         setSaving(false);
//         return;
//       }
      
//       const targetId = id || JSON.parse(localStorage.getItem('companyData'))?.id;
      
//       if (!targetId) {
//         throw new Error("Company ID not found");
//       }
      
//       const formDataToSend = new FormData();
      
//       formDataToSend.append('email', formData.email.trim());
//       formDataToSend.append('companyName', formData.companyName.trim());
      
//       if (formData.password && formData.password.trim() !== '') {
//         formDataToSend.append('password', formData.password);
//       }
      
//       if (formData.companyWebsite) {
//         formDataToSend.append('companyWebsite', formData.companyWebsite.trim());
//       }
      
//       if (formData.companyLocation) {
//         formDataToSend.append('companyLocation', formData.companyLocation.trim());
//       }
      
//       if (selectedFile) {
//         formDataToSend.append('companyLogo', selectedFile);
//       } else if (formData.companyLogo === "") {
//         formDataToSend.append('companyLogo', "");
//       }
      
//       const response = await fetch(`https://irshad-ovo6.onrender.com/company-management/update/${targetId}`, {
//         method: 'PUT',
//         body: formDataToSend,
//         credentials: 'include'
//       });
      
//       const responseData = await response.json();
      
//       if (!response.ok) {
//         throw new Error(responseData.message || "Failed to update company profile");
//       }
      
//       const updatedCompany = {
//         ...originalData,
//         ...formData,
//         companyLogo: responseData.companyLogo || formData.companyLogo,
//         isVerified: responseData.isVerified !== undefined ? responseData.isVerified : formData.isVerified
//       };
      
//       localStorage.setItem('companyData', JSON.stringify(updatedCompany));
      
//       toast.success(t("Company profile updated successfully!"));
      
//       setTimeout(() => {
//         navigate('/company/profile');
//       }, 1500);
      
//     } catch (error) {
//       console.error("Error updating company profile:", error);
//       toast.error(`${t("Failed to update company profile")}: ${error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm(t("Are you sure you want to cancel? All changes will be lost."))) {
//       navigate('/company/profile');
//     }
//   };

//   const isFormChanged = () => {
//     return JSON.stringify(formData) !== JSON.stringify(originalData) || selectedFile;
//   };

//   if (loading) {
//     return (
//       <div className="company-update-loading">
//         <div className="company-update-spinner"></div>
//         <p>{t("Loading company data...")}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="company-update-page">
//       <ToastContainer 
//         position="top-right" 
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
      
//       <div className="company-update-header">
//         <h1>
//           <FiEdit2 size={24} />
//           {t("Edit Company Profile")}
//         </h1>
//         <p className="company-update-subtitle">{t("Update your company information")}</p>
//       </div>

//       <form onSubmit={handleSubmit} className="company-update-form">
//         <div className="company-update-content">
//           {/* Left Column - Logo & Help */}
//           <div className="company-update-left">
//             <div className="company-logo-update">
//               <h3>
//                 <FiBriefcase size={18} />
//                 {t("Company Logo")}
//               </h3>
              
//               <div className="company-logo-upload-area">
//                 <div className="company-logo-preview">
//                   {logoPreview ? (
//                     <img 
//                       src={logoPreview} 
//                       alt={t("Logo preview")}
//                       className="company-logo-image"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "/default-logo.png";
//                       }}
//                     />
//                   ) : (
//                     <div className="company-no-logo">
//                       <div className="company-no-logo-icon">🏢</div>
//                       <span className="company-no-logo-text">{t("No logo")}</span>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="company-logo-actions">
//                   <div className="company-file-upload">
//                     <input
//                       type="file"
//                       id="company-logo-upload"
//                       accept="image/*"
//                       onChange={handleFileSelect}
//                       className="company-file-input"
//                     />
//                     <label htmlFor="company-logo-upload" className="company-btn-upload">
//                       <FiUpload size={16} />
//                       {t("Select Logo")}
//                     </label>
//                   </div>
                  
//                   <button
//                     type="button"
//                     onClick={handleRemoveLogo}
//                     className="company-btn-remove-logo"
//                     disabled={!logoPreview}
//                   >
//                     <FiTrash2 size={16} />
//                     {t("Remove")}
//                   </button>
//                 </div>
                

//               </div>
//             </div>

//             <div className="company-update-help">
//               <h4>
//                 <FiInfo size={18} />
//                 {t("Upload Tips")}
//               </h4>
//               <ul className="company-help-tips">
//                 <li>✓ {t("Use a high-quality company logo")}</li>
//                 <li>✓ {t("Recommended size: 300x300 pixels")}</li>
//                 <li>✓ {t("Square logo works best")}</li>
//                 <li>✓ {t("Max file size: 5MB")}</li>
//               </ul>
//             </div>
//           </div>

//           {/* Right Column - Form Fields */}
//           <div className="company-update-right">
//             <div className="company-update-section">
//               <h3>
//                 <FiBriefcase size={20} />
//                 {t("Company Information")}
//               </h3>
              
//               <div className="company-update-grid">
//                 <div className="company-form-group">
//                   <label htmlFor="company-email" className="company-form-label required">
//                     <FiMail size={16} />
//                     {t("Email Address")}
//                   </label>
//                   <input
//                     type="email"
//                     id="company-email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="company-form-input"
//                     placeholder="company@example.com"
//                   />
//                   {formData.email !== originalData.email && (
//                     <span className="company-field-changed">✏️</span>
//                   )}
//                   <div className="company-form-hint">
//                     {t("Used for login and notifications")}
//                   </div>
//                 </div>

//                 <div className="company-form-group">
//                   <label htmlFor="company-password" className="company-form-label">
//                     <FiLock size={16} />
//                     {t("Password")}
//                   </label>
//                   <div className="company-password-group">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="company-password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="company-form-input"
//                       placeholder={t("Leave empty to keep current password")}
//                       minLength="6"
//                     />
//                     <button
//                       type="button"
//                       className="company-password-toggle"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
//                     </button>
//                   </div>
//                   {formData.password !== originalData.password && (
//                     <span className="company-field-changed">✏️</span>
//                   )}
//                   <div className="company-form-hint">
//                     {t("Minimum 6 characters. Leave empty to keep current password")}
//                   </div>
//                 </div>

//                 <div className="company-form-group">
//                   <label htmlFor="company-name" className="company-form-label required">
//                     <FiBriefcase size={16} />
//                     {t("Company Name")}
//                   </label>
//                   <input
//                     type="text"
//                     id="company-name"
//                     name="companyName"
//                     value={formData.companyName}
//                     onChange={handleInputChange}
//                     required
//                     className="company-form-input"
//                     placeholder={t("Enter your company name")}
//                   />
//                   {formData.companyName !== originalData.companyName && (
//                     <span className="company-field-changed">✏️</span>
//                   )}
//                 </div>

//                 <div className="company-form-group">
//                   <label htmlFor="company-website" className="company-form-label">
//                     <FiGlobe size={16} />
//                     {t("Company Website")}
//                   </label>
//                   <input
//                     type="url"
//                     id="company-website"
//                     name="companyWebsite"
//                     value={formData.companyWebsite}
//                     onChange={handleInputChange}
//                     className="company-form-input"
//                     placeholder="https://example.com"
//                   />
//                   {formData.companyWebsite !== originalData.companyWebsite && (
//                     <span className="company-field-changed">✏️</span>
//                   )}
//                   <div className="company-form-hint">
//                     {t("Include http:// or https://")}
//                   </div>
//                 </div>

//                 <div className="company-form-group">
//                   <label htmlFor="company-location" className="company-form-label">
//                     <FiMapPin size={16} />
//                     {t("Company Location")}
//                   </label>
//                   <input
//                     type="text"
//                     id="company-location"
//                     name="companyLocation"
//                     value={formData.companyLocation}
//                     onChange={handleInputChange}
//                     className="company-form-input"
//                     placeholder={t("Enter company location or address")}
//                   />
//                   {formData.companyLocation !== originalData.companyLocation && (
//                     <span className="company-field-changed">✏️</span>
//                   )}
//                   <div className="company-form-hint">
//                     {t("City, Country or full address")}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="company-update-notice">
//               <div className="company-notice-icon">
//                 <FiAlertCircle size={20} />
//               </div>
//               <div className="company-notice-content">
//                 <strong>{t("Important")}:</strong> {t("Changing your email will affect your login credentials. All fields marked with * are required.")}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="company-update-actions">
//           <div className="company-actions-left">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="company-btn-cancel"
//               disabled={saving}
//             >
//               <FiX size={16} />
//               {t("Cancel")}
//             </button>
//           </div>
          
//           <div className="company-actions-right">
//             <button
//               type="button"
//               onClick={() => {
//                 setFormData(originalData);
//                 setSelectedFile(null);
//                 if (originalData.companyLogo) {
//                   setLogoPreview(getFullLogoUrl(originalData.companyLogo));
//                 } else {
//                   setLogoPreview("");
//                 }
//                 toast.info(t("All changes have been reset"));
//               }}
//               className="company-btn-reset"
//               disabled={!isFormChanged() || saving}
//             >
//               <FiRefreshCw size={16} />
//               {t("Reset Changes")}
//             </button>
            
//             <button
//               type="submit"
//               className="company-btn-save"
//               disabled={(!isFormChanged() && !selectedFile) || saving}
//             >
//               {saving ? (
//                 <>
//                   <span className="company-spinner-small"></span>
//                   {t("Saving...")}
//                 </>
//               ) : (
//                 <>
//                   <FiSave size={16} />
//                   {t("Save Changes")}
//                   {isFormChanged() && <span className="company-save-badge">!</span>}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default UpdateCompanyProfilePage;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from 'react-i18next';
import "react-toastify/dist/ReactToastify.css";
import "./UpdateCompanyProfilePage.css";
import {
  FiEdit2,
  FiUpload,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSave,
  FiX,
  FiRefreshCw,
  FiInfo,
  FiAlertCircle,
  FiGlobe,
  FiMapPin,
  FiMail,
  FiBriefcase,
  FiLock,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";

function UpdateCompanyProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    companyLogo: "",
    isVerified: false
  });
  
  const [originalData, setOriginalData] = useState({});
  const [logoPreview, setLogoPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // التحقق من التوكن والمصادقة
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // البحث عن التوكن بأسماء مختلفة
        const token = localStorage.getItem('companyToken') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('authToken') ||
                     localStorage.getItem('jwtToken');
        
        // التحقق من وجود بيانات الشركة
        const companyData = localStorage.getItem('companyData');
        
        if (!token) {
          toast.error(t("Please login to access this page"));
          setTimeout(() => {
            navigate('/company/login');
          }, 1500);
          return false;
        }
        
        if (!companyData) {
          toast.warning(t("Company data not found. Please login again"));
          setTimeout(() => {
            navigate('/company/login');
          }, 1500);
          return false;
        }
        
        setAuthenticating(false);
        return true;
        
      } catch (error) {
        console.error("Authentication check error:", error);
        toast.error(t("Authentication error"));
        setTimeout(() => {
          navigate('/company/login');
        }, 1500);
        return false;
      }
    };
    
    checkAuthentication();
  }, [navigate, t]);

  useEffect(() => {
    if (authenticating) return; // انتظر حتى يتم التحقق من التوكن

    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        // الحصول على التوكن
        const token = localStorage.getItem('companyToken') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('authToken') ||
                     localStorage.getItem('jwtToken');
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        let targetId = id;
        
        if (!targetId) {
          const storedCompany = localStorage.getItem('companyData');
          if (storedCompany) {
            const companyData = JSON.parse(storedCompany);
            targetId = companyData.id;
          }
        }

        if (!targetId) {
          throw new Error("Company ID not found");
        }

        // التحقق من صحة التوكن مع الخادم (اختياري)
        try {
          const verifyResponse = await fetch('https://irshad-ovo6.onrender.com/auth/verify-token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          if (verifyResponse.status === 401) {
            // التوكن منتهي الصلاحية
            clearLocalStorage();
            throw new Error("Session expired. Please login again");
          }
        } catch (verifyError) {
          // تجاهل خطأ التحقق إذا كانت الخدمة غير متوفرة
          console.log("Token verification optional, continuing...");
        }

        const response = await fetch(`https://irshad-ovo6.onrender.com/company-management/profile/${targetId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: "include"
        });
        
        if (response.status === 401) {
          clearLocalStorage();
          throw new Error("Unauthorized - Please login again");
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        
        const companyData = await response.json();
        
        const companyFormData = {
          email: companyData.email || "",
          password: "",
          companyName: companyData.companyName || "",
          companyWebsite: companyData.companyWebsite || "",
          companyLocation: companyData.companyLocation || "",
          companyLogo: companyData.companyLogo || "",
          isVerified: companyData.isVerified || false
        };
        
        setFormData(companyFormData);
        setOriginalData(companyFormData);
        
        if (companyData.companyLogo) {
          const fullUrl = getFullLogoUrl(companyData.companyLogo);
          setLogoPreview(fullUrl);
        }
        
        if (!id && companyData.id) {
          window.history.replaceState(null, '', `/company/profile/edit/${companyData.id}`);
        }
        
      } catch (error) {
        console.error("Error fetching company data:", error);
        
        if (error.message.includes("Unauthorized") || 
            error.message.includes("No authentication") || 
            error.message.includes("Session expired")) {
          
          clearLocalStorage();
          toast.error(t("Session expired. Please login again"));
          setTimeout(() => {
            navigate('/company/login');
          }, 1500);
          return;
        }
        
        // محاولة استخدام البيانات المحفوظة محلياً كبديل
        const storedCompany = localStorage.getItem('companyData');
        if (storedCompany) {
          try {
            const companyData = JSON.parse(storedCompany);
            const token = localStorage.getItem('companyToken') || localStorage.getItem('token');
            
            if (!token) {
              throw new Error("No token found");
            }
            
            const companyFormData = {
              email: companyData.email || "",
              password: "",
              companyName: companyData.companyName || "",
              companyWebsite: companyData.companyWebsite || "",
              companyLocation: companyData.companyLocation || "",
              companyLogo: companyData.companyLogo || "",
              isVerified: companyData.isVerified || false
            };
            
            setFormData(companyFormData);
            setOriginalData(companyFormData);
            
            if (companyData.companyLogo) {
              const fullUrl = getFullLogoUrl(companyData.companyLogo);
              setLogoPreview(fullUrl);
            }
            
            toast.warning(t("Using cached data. Some features may be limited."));
          } catch (localError) {
            console.error("Error loading from localStorage:", localError);
            toast.error(t("Failed to load company data"));
          }
        } else {
          toast.error(t("Failed to load company data"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id, t, authenticating, navigate]);

  // دالة لتنظيف localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('companyData');
  };

  const getFullLogoUrl = (path) => {
    if (!path) return "/default-logo.png";
    if (path.startsWith('http')) return path;
    if (path.startsWith('uploads/')) {
      return `https://irshad-ovo6.onrender.com/${path}`;
    }
    return `https://irshad-ovo6.onrender.com/uploads/company-logos/${path}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("File size must be less than 5MB"));
      return;
    }
    
    if (!file.type.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
      toast.error(t("Only image files are allowed"));
      return;
    }
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview("");
    setFormData(prev => ({
      ...prev,
      companyLogo: ""
    }));
    setSelectedFile(null);
    toast.info(t("Logo will be removed when you save changes"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // الحصول على التوكن
      const token = localStorage.getItem('companyToken') || 
                   localStorage.getItem('token') || 
                   localStorage.getItem('authToken') ||
                   localStorage.getItem('jwtToken');
      
      if (!token) {
        toast.error(t("Session expired. Please login again"));
        clearLocalStorage();
        setTimeout(() => {
          navigate('/company/login');
        }, 1500);
        return;
      }
      
      // التحقق من البيانات الأساسية
      if (!formData.email.trim()) {
        toast.error(t("Email is required"));
        setSaving(false);
        return;
      }
      
      if (!formData.companyName.trim()) {
        toast.error(t("Company name is required"));
        setSaving(false);
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error(t("Please enter a valid email address"));
        setSaving(false);
        return;
      }
      
      const targetId = id || JSON.parse(localStorage.getItem('companyData'))?.id;
      
      if (!targetId) {
        throw new Error("Company ID not found");
      }
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('companyName', formData.companyName.trim());
      
      if (formData.password && formData.password.trim() !== '') {
        formDataToSend.append('password', formData.password);
      }
      
      if (formData.companyWebsite) {
        formDataToSend.append('companyWebsite', formData.companyWebsite.trim());
      }
      
      if (formData.companyLocation) {
        formDataToSend.append('companyLocation', formData.companyLocation.trim());
      }
      
      if (selectedFile) {
        formDataToSend.append('companyLogo', selectedFile);
      } else if (formData.companyLogo === "") {
        formDataToSend.append('companyLogo', "");
      }
      
      // إرسال الطلب مع التوكن في الهيدر
      const response = await fetch(`https://irshad-ovo6.onrender.com/company-management/update/${targetId}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.status === 401) {
        clearLocalStorage();
        throw new Error("Unauthorized - Session expired");
      }
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update company profile");
      }
      
      // تحديث البيانات المحلية
      const updatedCompany = {
        ...originalData,
        ...formData,
        companyLogo: responseData.companyLogo || formData.companyLogo,
        isVerified: responseData.isVerified !== undefined ? responseData.isVerified : formData.isVerified
      };
      
      localStorage.setItem('companyData', JSON.stringify(updatedCompany));
      
      toast.success(t("Company profile updated successfully!"));
      
      setTimeout(() => {
        navigate('/company/profile');
      }, 1500);
      
    } catch (error) {
      console.error("Error updating company profile:", error);
      
      if (error.message.includes("Unauthorized") || error.message.includes("Session expired")) {
        toast.error(t("Session expired. Please login again"));
        clearLocalStorage();
        setTimeout(() => {
          navigate('/company/login');
        }, 1500);
        return;
      }
      
      toast.error(`${t("Failed to update company profile")}: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm(t("Are you sure you want to cancel? All changes will be lost."))) {
      navigate('/company/profile');
    }
  };

  const isFormChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData) || selectedFile;
  };

  // عرض حالة التحقق من المصادقة
  if (authenticating) {
    return (
      <div className="company-update-loading">
        <div className="company-update-spinner"></div>
        <p>{t("Checking authentication...")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="company-update-loading">
        <div className="company-update-spinner"></div>
        <p>{t("Loading company data...")}</p>
      </div>
    );
  }

  return (
    <div className="company-update-page">
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
      
      <div className="company-update-header">
        <h1>
          <FiEdit2 size={24} />
          {t("Edit Company Profile")}
        </h1>
        <p className="company-update-subtitle">{t("Update your company information")}</p>
      </div>

      <form onSubmit={handleSubmit} className="company-update-form">
        <div className="company-update-content">
          {/* Left Column - Logo & Help */}
          <div className="company-update-left">
            <div className="company-logo-update">
              <h3>
                <FiBriefcase size={18} />
                {t("Company Logo")}
              </h3>
              
              <div className="company-logo-upload-area">
                <div className="company-logo-preview">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt={t("Logo preview")}
                      className="company-logo-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-logo.png";
                      }}
                    />
                  ) : (
                    <div className="company-no-logo">
                      <div className="company-no-logo-icon">🏢</div>
                      <span className="company-no-logo-text">{t("No logo")}</span>
                    </div>
                  )}
                </div>
                
                <div className="company-logo-actions">
                  <div className="company-file-upload">
                    <input
                      type="file"
                      id="company-logo-upload"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="company-file-input"
                    />
                    <label htmlFor="company-logo-upload" className="company-btn-upload">
                      <FiUpload size={16} />
                      {t("Select Logo")}
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="company-btn-remove-logo"
                    disabled={!logoPreview}
                  >
                    <FiTrash2 size={16} />
                    {t("Remove")}
                  </button>
                </div>
              </div>
            </div>

            <div className="company-update-help">
              <h4>
                <FiInfo size={18} />
                {t("Upload Tips")}
              </h4>
              <ul className="company-help-tips">
                <li>✓ {t("Use a high-quality company logo")}</li>
                <li>✓ {t("Recommended size: 300x300 pixels")}</li>
                <li>✓ {t("Square logo works best")}</li>
                <li>✓ {t("Max file size: 5MB")}</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="company-update-right">
            <div className="company-update-section">
              <h3>
                <FiBriefcase size={20} />
                {t("Company Information")}
              </h3>
              
              <div className="company-update-grid">
                <div className="company-form-group">
                  <label htmlFor="company-email" className="company-form-label required">
                    <FiMail size={16} />
                    {t("Email Address")}
                  </label>
                  <input
                    type="email"
                    id="company-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="company-form-input"
                    placeholder="company@example.com"
                  />
                  {formData.email !== originalData.email && (
                    <span className="company-field-changed">✏️</span>
                  )}
                  <div className="company-form-hint">
                    {t("Used for login and notifications")}
                  </div>
                </div>

                <div className="company-form-group">
                  <label htmlFor="company-password" className="company-form-label">
                    <FiLock size={16} />
                    {t("Password")}
                  </label>
                  <div className="company-password-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="company-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="company-form-input"
                      placeholder={t("Leave empty to keep current password")}
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="company-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {formData.password !== originalData.password && (
                    <span className="company-field-changed">✏️</span>
                  )}
                  <div className="company-form-hint">
                    {t("Minimum 6 characters. Leave empty to keep current password")}
                  </div>
                </div>

                <div className="company-form-group">
                  <label htmlFor="company-name" className="company-form-label required">
                    <FiBriefcase size={16} />
                    {t("Company Name")}
                  </label>
                  <input
                    type="text"
                    id="company-name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="company-form-input"
                    placeholder={t("Enter your company name")}
                  />
                  {formData.companyName !== originalData.companyName && (
                    <span className="company-field-changed">✏️</span>
                  )}
                </div>

                <div className="company-form-group">
                  <label htmlFor="company-website" className="company-form-label">
                    <FiGlobe size={16} />
                    {t("Company Website")}
                  </label>
                  <input
                    type="url"
                    id="company-website"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    className="company-form-input"
                    placeholder="https://example.com"
                  />
                  {formData.companyWebsite !== originalData.companyWebsite && (
                    <span className="company-field-changed">✏️</span>
                  )}
                  <div className="company-form-hint">
                    {t("Include http:// or https://")}
                  </div>
                </div>

                <div className="company-form-group">
                  <label htmlFor="company-location" className="company-form-label">
                    <FiMapPin size={16} />
                    {t("Company Location")}
                  </label>
                  <input
                    type="text"
                    id="company-location"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleInputChange}
                    className="company-form-input"
                    placeholder={t("Enter company location or address")}
                  />
                  {formData.companyLocation !== originalData.companyLocation && (
                    <span className="company-field-changed">✏️</span>
                  )}
                  <div className="company-form-hint">
                    {t("City, Country or full address")}
                  </div>
                </div>
              </div>
            </div>

            <div className="company-update-notice">
              <div className="company-notice-icon">
                <FiAlertCircle size={20} />
              </div>
              <div className="company-notice-content">
                <strong>{t("Important")}:</strong> {t("Changing your email will affect your login credentials. All fields marked with * are required.")}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="company-update-actions">
          <div className="company-actions-left">
            <button
              type="button"
              onClick={handleCancel}
              className="company-btn-cancel"
              disabled={saving}
            >
              <FiX size={16} />
              {t("Cancel")}
            </button>
          </div>
          
          <div className="company-actions-right">
            <button
              type="button"
              onClick={() => {
                setFormData(originalData);
                setSelectedFile(null);
                if (originalData.companyLogo) {
                  setLogoPreview(getFullLogoUrl(originalData.companyLogo));
                } else {
                  setLogoPreview("");
                }
                toast.info(t("All changes have been reset"));
              }}
              className="company-btn-reset"
              disabled={!isFormChanged() || saving}
            >
              <FiRefreshCw size={16} />
              {t("Reset Changes")}
            </button>
            
            <button
              type="submit"
              className="company-btn-save"
              disabled={(!isFormChanged() && !selectedFile) || saving}
            >
              {saving ? (
                <>
                  <span className="company-spinner-small"></span>
                  {t("Saving...")}
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  {t("Save Changes")}
                  {isFormChanged() && <span className="company-save-badge">!</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateCompanyProfilePage;