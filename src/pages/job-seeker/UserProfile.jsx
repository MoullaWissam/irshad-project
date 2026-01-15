import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import "./UserProfilePage.css";

// استيراد أيقونات محسنة
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaBirthdayCake,
  FaUserCheck,
  FaUserClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaSync,
  FaBriefcase,
  FaIdCard,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaGraduationCap,
  FaSuitcase,
  FaLanguage,
  FaCertificate,
  FaInfoCircle
} from "react-icons/fa";

function UserProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasShownToast = useRef(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("userData");

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);

          if (!hasShownToast.current) {
            toast.success(t("User profile loaded successfully"));
            hasShownToast.current = true;
          }
        } else {
          await fetchUserFromAPI();
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error(t("Failed to load user profile"));
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();

    return () => {
      hasShownToast.current = false;
    };
  }, [t]);

  const fetchUserFromAPI = async () => {
    try {
      const response = await fetch("https://irshad-ovo6.onrender.com/auth/profile", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);

      if (!hasShownToast.current) {
        toast.success(t("User profile loaded from server"));
        hasShownToast.current = true;
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("Could not load user data from server"));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("Not specified");
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const getFullProfileImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith("http")) return path;
    return `https://irshad-ovo6.onrender.com/${path.replace(/\\/g, "/")}`;
  };

  const handleEditProfile = () => {
    if (user && user.id) {
      navigate(`/user/profile/edit/${user.id}`);
    } else {
      toast.warning(t("Cannot edit profile: User ID not found"));
    }
  };

  const handleRefreshData = () => {
    localStorage.removeItem("userData");
    toast.info(t("Clearing local data, refreshing..."));

    setTimeout(() => {
      fetchUserFromAPI();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t("Loading user profile...")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">😕</div>
          <h2>{t("User Profile Not Found")}</h2>
          <p>
            {t(
              "We couldn't load your profile information. Please try again later."
            )}
          </p>
          <button onClick={fetchUserFromAPI} className="btn-retry">
            <FaSync /> {t("Retry Loading")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
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

      {/* Header مع صورة المستخدم في الأعلى */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-user-info">
            <div className="user-avatar-header">
              <img
                src={getFullProfileImageUrl(user.profileImage)}
                alt={`${user.firstName} ${user.lastName}`}
                className="avatar-image-header"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <div className="header-text-info">
              <h1>{user.firstName} {user.lastName}</h1>
              <div className="header-user-email">
                <FaEnvelope /> {user.email}
              </div>
              <div className="user-role">
                <FaBriefcase /> {t("Job Seeker")}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleEditProfile} className="btn-edit-profile">
              <FaEdit /> <span className="edit-text">{t("Edit Profile")}</span>
            </button>
            <button
              onClick={handleRefreshData}
              className="btn-refresh"
              title={t("Refresh Profile Data")}
            >
              <FaSync />
            </button>
          </div>
        </div>
      </div>

      {/* كل المعلومات في قسم واحد */}
      <div className="personal-info-container">
        <h2 className="section-title">
          <FaUser /> {t("Personal Information")}
        </h2>

        <div className="info-grid">
          {/* العمود الأول: المعلومات الأساسية */}
          <div className="info-column">
            <div className="info-card">
              <h3><FaInfoCircle /> {t("Basic Details")}</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">
                    <FaUser /> {t("Full Name")}:
                  </span>
                  <span className="info-value">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    <FaEnvelope /> {t("Email")}:
                  </span>
                  <span className="info-value">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaPhone /> {t("Phone")}:
                    </span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaMapMarkerAlt /> {t("Address")}:
                    </span>
                    <span className="info-value">{user.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <h3><FaCalendarAlt /> {t("Account Information")}</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">
                    <FaCalendarAlt /> {t("Member Since")}:
                  </span>
                  <span className="info-value">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                {user.birthDate && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaBirthdayCake /> {t("Birth Date")}:
                    </span>
                    <span className="info-value">{formatDate(user.birthDate)}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">
                    <FaIdCard /> {t("Age")}:
                  </span>
                  <span className="info-value">
                    {user.age || t("Not specified")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الثاني: معلومات إضافية */}
          <div className="info-column">
            <div className="info-card">
              <h3><FaSuitcase /> {t("Professional Information")}</h3>
              <div className="info-list">
                {user.jobTitle && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaSuitcase /> {t("Current Position")}:
                    </span>
                    <span className="info-value">{user.jobTitle}</span>
                  </div>
                )}
                {user.company && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaBriefcase /> {t("Company")}:
                    </span>
                    <span className="info-value">{user.company}</span>
                  </div>
                )}
                {user.experienceYears && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaCalendarAlt /> {t("Experience")}:
                    </span>
                    <span className="info-value">
                      {user.experienceYears} {t("years")}
                    </span>
                  </div>
                )}
                {user.education && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaGraduationCap /> {t("Education")}:
                    </span>
                    <span className="info-value">{user.education}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <h3><FaGlobe /> {t("Additional Information")}</h3>
              <div className="info-list">
                {user.gender && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaVenusMars /> {t("Gender")}:
                    </span>
                    <span className="info-value">{user.gender}</span>
                  </div>
                )}
                {user.nationality && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaGlobe /> {t("Nationality")}:
                    </span>
                    <span className="info-value">{user.nationality}</span>
                  </div>
                )}
                {user.languages && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaLanguage /> {t("Languages")}:
                    </span>
                    <span className="info-value">{user.languages}</span>
                  </div>
                )}
                {user.skills && (
                  <div className="info-item">
                    <span className="info-label">
                      <FaCertificate /> {t("Skills")}:
                    </span>
                    <span className="info-value">{user.skills}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* حالة الحساب */}
        <div className="status-section">
          <h3><FaUserCheck /> {t("Account Status")}</h3>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-content">
                <span
                  className={`status-indicator ${
                    user.isActive ? "online" : "offline"
                  }`}
                ></span>
                <div className="status-details">
                  <span className="status-title">
                    {t("Account Status")}
                  </span>
                  <span className="status-value">
                    {user.isActive ? (
                      <>
                        <FaCheckCircle /> {t("Active")}
                      </>
                    ) : (
                      <>
                        <FaTimesCircle /> {t("Inactive")}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="status-item">
              <div className="status-content">
                <span
                  className={`status-indicator ${
                    user.isVerify ? "verified" : "unverified"
                  }`}
                ></span>
                <div className="status-details">
                  <span className="status-title">
                    {t("Verification")}
                  </span>
                  <span className="status-value">
                    {user.isVerify ? (
                      <>
                        <FaCheckCircle /> {t("Verified")}
                      </>
                    ) : (
                      <>
                        <FaUserClock /> {t("Not Verified")}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;