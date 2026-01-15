import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./MyApplications.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

// ✅ Icons
import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MyApplications = () => {
  const { status = "pending" } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(status);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const tabs = [
    { id: "pending", label: t("Pending"), color: "#ffa500", key: "pending" },
    { id: "accepted", label: t("Approved"), color: "#2ecc71", key: "accepted" },
    { id: "rejected", label: t("Rejected"), color: "#e74c3c", key: "rejected" },
  ];

  const getApiStatus = (tabId) => {
    switch (tabId) {
      case "pending":
        return "pending";
      case "accepted":
        return "accepted";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const [pendingRes, acceptedRes, rejectedRes] = await Promise.allSettled([
        fetch("https://irshad-ovo6.onrender.com/auth/my-applications/pending", {
          credentials: "include",
        }),
        fetch("https://irshad-ovo6.onrender.com/auth/my-applications/accepted", {
          credentials: "include",
        }),
        fetch("https://irshad-ovo6.onrender.com/auth/my-applications/rejected", {
          credentials: "include",
        }),
      ]);

      const getCount = async (res) =>
        res.status === "fulfilled" && res.value.ok
          ? (await res.value.json()).length
          : 0;

      setStats({
        pending: await getCount(pendingRes),
        accepted: await getCount(acceptedRes),
        rejected: await getCount(rejectedRes),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const apiStatus = getApiStatus(status);
      console.log(apiStatus);
      
      const response = await fetch(
        `https://irshad-ovo6.onrender.com/auth/my-applications/${apiStatus}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      console.log(data[0]);
      console.log(data[0].rejectionFeedback);
      
      const formatted = Array.isArray(data)
        ? data.map((job, index) => ({
            id: job.id || index,
            jobId: job.id,
            title: job.title || t("No Title"),
            description: job.description || t("No description available"),
            employmentType: job.employmentType || t("Not specified"),
            companyLogo:
              job.image ||
              "https://via.placeholder.com/50/cccccc/ffffff?text=CO",
            companyName: job.companyName || t("Unknown Company"),
            location: job.location || t("Location not specified"),
            salary: job.salary || t("Salary not specified"),
            appliedDate: job.createdAt,
            status: apiStatus,
            skills: job.skills,
            experience: job.experience,
            education: job.education,
            ...(apiStatus === "accepted" && {
              approvedDate: new Date().toISOString(),
            }),
            ...(apiStatus === "rejected" && {
              rejectedDate: new Date().toISOString(),
              feedback:job.rejectionFeedback || t(
                "Based on our evaluation of your application and qualifications..."
              ),
            }),
          }))
        : [];

      setApplications(formatted);
    } catch {
      toast.error(t("Failed to load applications"));
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationStats();
    fetchApplications();
    setSelectedTab(status);
  }, [status]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      i18n.language === "ar" ? "ar-SA" : "en-US"
    );

  return (
    <div className="my-applications-page" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="my-applications-title">
        {t("My Applications")}
      </h2>

      <div className="my-applications-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`my-applications-tab ${
              selectedTab === tab.id ? "my-applications-tab-active" : ""
            }`}
            style={{ "--my-applications-active-color": tab.color, "font-family": "'Tajawal', sans-serifmy-applications-title" }}
            onClick={() => navigate(`/applications/${tab.id}`)}
          >
            {tab.label}
            <span className="my-applications-tab-count">
              {stats[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="my-applications-content">
        {loading ? (
          <p>{t("Loading your applications...")}</p>
        ) : applications.length ? (
          <div className="my-applications-grid">
            {applications.map((app) => (
              <div key={app.id} className="my-applications-card-wrapper">
                <div className="my-applications-meta">
                  <span>
                    <FaClock /> {t("Applied")}: {formatDate(app.appliedDate)}
                  </span>

                  {app.approvedDate && (
                    <span className="approved">
                      <FaCheckCircle /> {t("Approved")}:{" "}
                      {formatDate(app.approvedDate)}
                    </span>
                  )}

                  {app.rejectedDate && (
                    <span className="rejected">
                      <FaTimesCircle /> {t("Rejected")}:{" "}
                      {formatDate(app.rejectedDate)}
                    </span>
                  )}
                </div>

                <JobCard
                  id={app.jobId}
                  title={app.title}
                  desc={app.description}
                  type={app.employmentType}
                  icon={app.companyLogo}
                  company={app.companyName}
                  location={app.location}
                  salary={app.salary}
                />

                {app.feedback && (
                  <div className="my-applications-feedback">
                    <strong>{t("Feedback")}:</strong> {app.feedback} 
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="my-applications-empty">
            <div className="my-applications-empty-icon">📁</div>
            <h3>{t("No applications found")}</h3>
            <p>{t("You haven't received any updates for this category yet.")}</p>
            <button onClick={() => navigate("/jobs")}>
              {t("Browse Available Jobs")}
            </button>
          </div>
        )}
      </div>
          
    </div>
  );
};

export default MyApplications;
