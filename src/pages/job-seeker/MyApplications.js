import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./MyApplications.css";

const MyApplications = () => {
  const { status } = useParams(); // يجلب الحالة من الرابط (pending, approved, rejected)
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // مصفوفة التبويبات لتسهيل التنقل
  const tabs = [
    { id: "pending", label: "Pending", color: "#ffa500" },
    { id: "approved", label: "Approved", color: "#2ecc71" },
    { id: "rejected", label: "Rejected", color: "#e74c3c" },
  ];

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        // ملاحظة: قم بتغيير الرابط للرابط الحقيقي الخاص بالـ API لديك
        const response = await fetch(`http://localhost:3000/my-applications?status=${status}`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          // بيانات تجريبية في حال فشل الاتصال (لأغراض العرض فقط)
          setApplications([]); 
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [status]);

  return (
    <div className="my-apps-container">
      <div className="my-apps-header">
        <h2 className="my-apps-title">
          My <span>Applications</span>
        </h2>
        <p className="my-apps-subtitle">Track the status of your job applications in real-time</p>
      </div>

      {/* نظام التبويبات (Tabs) */}
      <div className="apps-tabs-container">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`/applications/${tab.id}`}
            className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}
            style={({ isActive }) => ({
                "--active-color": tab.color
            })}
          >
            {tab.label}
            {/* يمكنك هنا إضافة عداد للطلبات لاحقاً */}
          </NavLink>
        ))}
      </div>

      {/* منطقة عرض البطاقات */}
      <div className="apps-content-area">
        {loading ? (
          <div className="loading-state">Loading your applications...</div>
        ) : applications.length > 0 ? (
          <div className="apps-grid">
            {applications.map((app) => (
              <div className="app-card-wrapper" key={app.id}>
                <div className={`status-badge ${status}`}>{status}</div>
                <JobCard
                  id={app.jobId}
                  title={app.title}
                  desc={app.description}
                  type={app.employmentType}
                  icon={app.companyLogo}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No {status} applications found</h3>
            <p>You haven't received any updates for this category yet.</p>
            <button onClick={() => navigate("/jobs")} className="browse-jobs-btn">
              Browse Available Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;