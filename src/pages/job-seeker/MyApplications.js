import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./MyApplications.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';

const MyApplications = () => {
  const { status = "pending" } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(status);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // مصفوفة التبويبات
  const tabs = [
    { id: "pending", label: t("Pending"), color: "#ffa500", key: "pending" },
    { id: "accepted", label: t("Approved"), color: "#2ecc71", key: "accepted" },
    { id: "rejected", label: t("Rejected"), color: "#e74c3c", key: "rejected" },
  ];

  // تحويل حالة API إلى حالة مكون
  const getApiStatus = (tabId) => {
    switch(tabId) {
      case 'pending': return 'pending';
      case 'accepted': return 'accepted';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  };

  // دالة محسنة لجلب الإحصائيات - تجلب التطبيقات من كل الحالات
  const fetchApplicationStats = async () => {
    try {
      console.log('Fetching all application statistics...');
      
      // جلب جميع التطبيقات من جميع الحالات في نفس الوقت
      const [pendingRes, acceptedRes, rejectedRes] = await Promise.allSettled([
        fetch('http://localhost:3000/auth/my-applications/pending', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch('http://localhost:3000/auth/my-applications/accepted', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch('http://localhost:3000/auth/my-applications/rejected', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
      ]);

      let pendingCount = 0;
      let acceptedCount = 0;
      let rejectedCount = 0;

      // معالجة استجابة pending
      if (pendingRes.status === 'fulfilled' && pendingRes.value.ok) {
        const data = await pendingRes.value.json();
        if (Array.isArray(data)) {
          pendingCount = data.length;
        }
      }

      // معالجة استجابة accepted
      if (acceptedRes.status === 'fulfilled' && acceptedRes.value.ok) {
        const data = await acceptedRes.value.json();
        if (Array.isArray(data)) {
          acceptedCount = data.length;
        }
      }

      // معالجة استجابة rejected
      if (rejectedRes.status === 'fulfilled' && rejectedRes.value.ok) {
        const data = await rejectedRes.value.json();
        if (Array.isArray(data)) {
          rejectedCount = data.length;
        }
      }

      console.log('Calculated stats from API calls:', { pendingCount, acceptedCount, rejectedCount });
      
      setStats({
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount
      });

    } catch (error) {
      console.error('Error calculating application stats:', error);
    }
  };

  // جلب التطبيقات من API
  const fetchApplications = async () => {
    setLoading(true);
    
    try {
      const apiStatus = getApiStatus(status);
      
      console.log(`Fetching ${apiStatus} applications...`);
      
      const response = await fetch(`http://localhost:3000/auth/my-applications/${apiStatus}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(t("HTTP error! status: {status}", { status: response.status }));
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      // تحويل البيانات من API إلى الشكل المطلوب للمكون
      const formattedApplications = Array.isArray(data) ? data.map((job, index) => ({
        id: job.id || index,
        jobId: job.id,
        title: job.title || t("No Title"),
        description: job.description || t("No description available"),
        employmentType: job.employmentType || t("Not specified"),
        companyLogo: job.image || "https://via.placeholder.com/50/cccccc/ffffff?text=CO",
        companyName: job.companyName || t("Unknown Company"),
        location: job.location || t("Location not specified"),
        salary: job.salary || t("Salary not specified"),
        appliedDate: job.createdAt || new Date().toISOString(),
        status: apiStatus,
        skills: job.skills || t("Not specified"),
        experience: job.experience || t("Not specified"),
        education: job.education ? JSON.parse(job.education) : [],
        hasTest: job.hasTest || false,
        ...(apiStatus === 'accepted' && { 
          approvedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() 
        }),
        ...(apiStatus === 'rejected' && { 
          rejectedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          feedback: t("Based on our evaluation of your application and qualifications...")
        })
      })) : [];
      
      console.log('Formatted applications:', formattedApplications);
      setApplications(formattedApplications);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      toast.error(t("Failed to load {status} applications", { status: status }), {
        position: isRTL ? "top-center" : "top-center",
        autoClose: 3000,
        rtl: isRTL
      });
      
      setApplications([]);
      
    } finally {
      setLoading(false);
    }
  };

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const loadData = async () => {
      await fetchApplicationStats();
      await fetchApplications();
    };
    
    loadData();
    setSelectedTab(status);
  }, [status]);

  // تحديث الإحصائيات عند تغيير التطبيقات
  useEffect(() => {
    if (applications.length > 0) {
      console.log(`Applications for ${status}: ${applications.length}`);
    }
  }, [applications, status]);

  // دالة لمعالجة النقر على علامة التبويب
  const handleTabClick = (tabId) => {
    navigate(`/applications/${tabId}`);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return t("Date not available");
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return t("Invalid date");
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return t("Date error");
    }
  };

  // إزالة الاقتباسات المزدوجة من التعليم
  const parseEducation = (educationString) => {
    try {
      if (!educationString) return [t("Not specified")];
      
      const parsed = JSON.parse(educationString);
      
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') {
            return item.replace(/\\"/g, '').replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
          }
          return String(item);
        });
      }
      
      return [String(parsed)];
    } catch (error) {
      console.error('Error parsing education:', error);
      return [t("Education details")];
    }
  };

  // جلب عدد التطبيقات للتبويب
  const getTabCount = (tabKey) => {
    return stats[tabKey] || 0;
  };

  // نمط خط Roboto
  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  return (
    <div 
      className="my-applications-page" 
      dir={isRTL ? 'rtl' : 'ltr'} 
      style={robotoStyle}
    >
      {/* عنوان الصفحة */}
      <h2 
        className="my-applications-title"
        style={{ textAlign: isRTL ? 'right' : 'left' }}
      >
        {t("My")} <span>{t("Applications")}</span>
      </h2>

      <div className="my-applications-header">
        <p 
          className="my-applications-subtitle"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {t("Track the status of your job applications in real-time")}
        </p>
        <div className="my-applications-stats">
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{stats.pending}</span>
            <span className="my-applications-stat-label">{t("Pending")}</span>
          </div>
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{stats.accepted}</span>
            <span className="my-applications-stat-label">{t("Approved")}</span>
          </div>
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{stats.rejected}</span>
            <span className="my-applications-stat-label">{t("Rejected")}</span>
          </div>
        </div>
      </div>

      {/* نظام التبويبات */}
      <div className="my-applications-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`my-applications-tab ${selectedTab === tab.id ? "my-applications-tab-active" : ""}`}
            style={{ 
              "--my-applications-active-color": tab.color,
              "--my-applications-active-color-rgb": tab.color === "#ffa500" ? "255, 165, 0" : 
                                                  tab.color === "#2ecc71" ? "46, 204, 113" : 
                                                  "231, 76, 60",
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
            <span className="my-applications-tab-count">{getTabCount(tab.key)}</span>
          </button>
        ))}
      </div>

      {/* منطقة عرض البطاقات */}
      <div className="my-applications-content">
        {loading ? (
          <div className="my-applications-loading">
            <div className="my-applications-spinner"></div>
            <p style={robotoStyle}>{t("Loading your applications...")}</p>
          </div>
        ) : applications.length > 0 ? (
          <>
            <div 
              className="my-applications-results"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              <span style={{color: '#161616ff', fontSize: '15px', fontFamily: "'Roboto', sans-serif"}}>
                {t("Total: {count} applications", { count: stats.pending + stats.accepted + stats.rejected })}
              </span>
            </div>
            <div className="my-applications-grid">
              {applications.map((app) => {
                const educationArray = parseEducation(app.education);
                const educationText = educationArray.join(", ");
                
                return (
                  <div className="my-applications-card-wrapper" key={`${app.id}-${app.jobId}`}>
                    <div className={`my-applications-status-badge my-applications-status-${status}`}>
                      {t(status.toUpperCase())}
                    </div>
                    <div className="my-applications-meta">
                      <span className="my-applications-applied-date">
                        {t("Applied")}: {formatDate(app.appliedDate)}
                      </span>
                      {app.approvedDate && (
                        <span className="my-applications-approved-date">
                          {t("Approved")}: {formatDate(app.approvedDate)}
                        </span>
                      )}
                      {app.rejectedDate && (
                        <span className="my-applications-rejected-date">
                          {t("Rejected")}: {formatDate(app.rejectedDate)}
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
                      {...(app.skills && { skills: app.skills })}
                      {...(app.experience && { experience: app.experience })}
                      {...(educationText && { education: educationText })}
                    />
                    {app.feedback && status === "rejected" && (
                      <div className="my-applications-feedback">
                        <strong>{t("Feedback")}:</strong> {app.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="my-applications-empty">
            <div className="my-applications-empty-icon">📁</div>
            <h3 style={robotoStyle}>
              {t("No {status} applications found", { status: t(status) })}
            </h3>
            <p style={robotoStyle}>
              {t("You haven't received any updates for this category yet.")}
            </p>
            <button 
              onClick={() => navigate("/jobs")} 
              className="my-applications-browse-btn"
              style={robotoStyle}
            >
              {t("Browse Available Jobs")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;