import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import "./CompanyProfilePage.css";
import {
  FiEdit2,
  FiCalendar,
  FiUsers,
  FiGlobe,
  FiMapPin,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
} from "react-icons/fi";

function CompanyProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const storedCompany = localStorage.getItem("companyData");

        if (storedCompany) {
          const parsedData = JSON.parse(storedCompany);
          setCompanyData(parsedData);

          if (parsedData.id) {
            await fetchCompanyFromAPI(parsedData.id);
          }
        } else {
          await fetchCompanyFromAPI();
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error(t("Failed to load company profile"));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [t]);

  const fetchCompanyFromAPI = async (companyId = null) => {
    try {
      let targetId = companyId;

      if (!targetId) {
        const storedCompany = localStorage.getItem("companyData");
        if (storedCompany) {
          const parsedData = JSON.parse(storedCompany);
          targetId = parsedData.id;
        }
      }

      if (!targetId) {
        console.warn("No company ID available for API fetch");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/company-management/profile/${targetId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch company data from API");
      }

      const apiData = await response.json();
      setCompanyData(apiData);
      localStorage.setItem("companyData", JSON.stringify(apiData));
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getFullLogoUrl = (path) => {
    if (!path) return "/default-logo.png";
    if (path.startsWith("http")) return path;
    if (path.startsWith("uploads/")) {
      return `http://localhost:3000/${path}`;
    }
    return `http://localhost:3000/uploads/company-logos/${path}`;
  };

  const handleEditProfile = () => {
    if (companyData && companyData.id) {
      navigate(`/company/profile/edit/${companyData.id}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="company-loading-container">
        <div className="company-spinner"></div>
        <p>{t("Loading company profile...")}</p>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="company-no-data">
        <h2>{t("No Company Data Found")}</h2>
        <p>{t("Please login to view your company profile")}</p>
        <div className="company-action-buttons">
          <button
            onClick={() => navigate("/company/login")}
            className="company-btn-login"
          >
            {t("Go to Login")}
          </button>
          <button
            onClick={() => navigate("/company/register")}
            className="company-btn-register"
          >
            {t("Register New Company")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile-page">
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

      {/* Header Section */}
      <div className="company-profile-header">
        <div className="company-header-main">
          <div className="company-branding">
            <div className="company-logo-display">
              <img
                src={getFullLogoUrl(companyData.companyLogo)}
                alt={companyData.companyName}
                className="company-logo-large"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-logo.png";
                }}
              />
            </div>
            <div className="company-title">
              <h1>{companyData.companyName}</h1>
              <div className="company-meta">
                <span
                  className={`company-verification-badge ${
                    companyData.isVerified ? "verified" : "not-verified"
                  }`}
                >
                  {companyData.isVerified ? (
                    <>
                      <FiCheckCircle size={14} />
                      {t("Verified Company")}
                    </>
                  ) : (
                    <>
                      <FiXCircle size={14} />
                      {t("Not Verified")}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="company-header-actions">
            <button onClick={handleEditProfile} className="company-btn-edit">
              <FiEdit2 size={16} />
              {t("Edit Profile")}
            </button>
          </div>
        </div>

        <div className="company-header-stats">
          <div className="company-stat-card">
            <div className="company-stat-icon">
              <FiCalendar size={24} />
            </div>
            <div className="company-stat-content">
              <div className="company-stat-value">
                {t(formatDate(companyData.createdAt))}
              </div>
              <div className="company-stat-label">{t("Member Since")}</div>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">
              <FiUsers size={24} />
            </div>
            <div className="company-stat-content">
              <div className="company-stat-value">{t(companyData.role)}</div>
              <div className="company-stat-label">{t("Account Type")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="company-profile-content">
        <div className="company-right-column">
          {/* Company Details */}
          <div className="company-details-section">
            <h2>
              <FiUsers size={20} />
              {t("Company Details")}
            </h2>

            <div className="company-details-grid">
              <div className="company-detail-card">
                <div className="company-detail-header">
                  <span className="company-detail-icon">
                    <FiMail size={20} />
                  </span>
                  <h4>{t("Email Address")}</h4>
                </div>
                <div className="company-detail-content">
                  <p>{companyData.email}</p>
                  <small className="company-detail-hint">
                    {t("Used for login and notifications")}
                  </small>
                </div>
              </div>

              {companyData.companyWebsite && (
                <div className="company-detail-card">
                  <div className="company-detail-header">
                    <span className="company-detail-icon">
                      <FiGlobe size={20} />
                    </span>
                    <h4>{t("Website")}</h4>
                  </div>
                  <div className="company-detail-content">
                    <a
                      href={
                        companyData.companyWebsite.startsWith("http")
                          ? companyData.companyWebsite
                          : `https://${companyData.companyWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-website-link"
                    >
                      {companyData.companyWebsite}
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {companyData.companyLocation && (
                <div className="company-detail-card">
                  <div className="company-detail-header">
                    <span className="company-detail-icon">
                      <FiMapPin size={20} />
                    </span>
                    <h4>{t("Location")}</h4>
                  </div>
                  <div className="company-detail-content">
                    <p>{companyData.companyLocation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfilePage;
