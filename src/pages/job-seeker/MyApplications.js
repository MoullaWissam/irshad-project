import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./MyApplications.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // مصفوفة التبويبات
  const tabs = [
    { id: "pending", label: "Pending", color: "#ffa500", key: "pending" },
    { id: "accepted", label: "Approved", color: "#2ecc71", key: "accepted" },
    { id: "rejected", label: "Rejected", color: "#e74c3c", key: "rejected" },
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

  // جلب إحصائيات التطبيقات
  const fetchApplicationStats = async () => {
    try {
      
      const response = await fetch('http://localhost:3000/auth/my-applications/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Application stats:', data);
      
      if (data.success) {
        setStats({
          pending: data.pending || 0,
          accepted: data.accepted || 0,
          rejected: data.rejected || 0
        });
      }
    } catch (error) {
      console.error('Error fetching application stats:', error);
      toast.error('Failed to load application statistics', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  // جلب التطبيقات من API
  const fetchApplications = async () => {
    setLoading(true);
    
    try {
      const apiStatus = getApiStatus(status);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      console.log(`Fetching ${apiStatus} applications...`);
      
      const response = await fetch(`http://localhost:3000/auth/my-applications/${apiStatus}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      // تحويل البيانات من API إلى الشكل المطلوب للمكون
      const formattedApplications = Array.isArray(data) ? data.map((job, index) => ({
        id: job.id || index,
        jobId: job.id,
        title: job.title || "No Title",
        description: job.description || "No description available",
        employmentType: job.employmentType || "Not specified",
        companyLogo: job.image || "https://via.placeholder.com/50/cccccc/ffffff?text=CO",
        companyName: job.companyName || "Unknown Company",
        location: job.location || "Location not specified",
        salary: job.salary || "Salary not specified",
        appliedDate: job.createdAt || new Date().toISOString(),
        status: apiStatus,
        skills: job.skills || "Not specified",
        experience: job.experience || "Not specified",
        education: job.education ? JSON.parse(job.education) : [],
        hasTest: job.hasTest || false,
        // إضافة تواريخ افتراضية بناءً على الحالة
        ...(apiStatus === 'accepted' && { 
          approvedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() 
        }),
        ...(apiStatus === 'rejected' && { 
          rejectedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          feedback: "Based on our evaluation of your application and qualifications..."
        })
      })) : [];
      
      console.log('Formatted applications:', formattedApplications);
      setApplications(formattedApplications);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      toast.error(`Failed to load ${status} applications`, {
        position: "top-center",
        autoClose: 3000,
      });
      
      // استخدام بيانات تجريبية في حالة فشل API
      const mockData = {
        pending: [
          { 
            id: 1, 
            jobId: "101", 
            title: "Frontend React Developer", 
            description: "Join our team to build cutting-edge web applications", 
            employmentType: "Full-time", 
            companyLogo: "https://via.placeholder.com/50/007bff/ffffff?text=FB",
            companyName: "Facebook",
            location: "Remote",
            salary: "$85,000 - $110,000",
            appliedDate: "2024-01-15",
            status: "pending"
          }
        ],
        accepted: [],
        rejected: []
      };
      
      setApplications(mockData[status] || []);
      
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

  // دالة لمعالجة النقر على علامة التبويب
  const handleTabClick = (tabId) => {
    navigate(`/applications/${tabId}`);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date error";
    }
  };

  // إزالة الاقتباسات المزدوجة من التعليم
  const parseEducation = (educationString) => {
    try {
      if (!educationString) return ["Not specified"];
      
      // محاولة تحليل JSON
      const parsed = JSON.parse(educationString);
      
      // إذا كان مصفوفة، قم بتسطيحها وإزالة الاقتباسات الزائدة
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') {
            // إزالة الاقتباسات المزدوجة والرموز الزائدة
            return item.replace(/\\"/g, '').replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
          }
          return String(item);
        });
      }
      
      return [String(parsed)];
    } catch (error) {
      console.error('Error parsing education:', error);
      return ["Education details"];
    }
  };

  // جلب عدد التطبيقات للتبويب
  const getTabCount = (tabKey) => {
    return stats[tabKey] || 0;
  };

  return (
    <div className="my-applications-page">
      {/* عنوان الصفحة بنفس تنسيق MatchesPage */}
      <h2 className="my-applications-title">
        My <span>Applications</span>
      </h2>

      <div className="my-applications-header">
        <p className="my-applications-subtitle">
          Track the status of your job applications in real-time
        </p>
        <div className="my-applications-stats">
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{stats.pending}</span>
            <span className="my-applications-stat-label">Pending</span>
          </div>
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{stats.accepted}</span>
            <span className="my-applications-stat-label">Approved</span>
          </div>
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{stats.rejected}</span>
            <span className="my-applications-stat-label">Rejected</span>
          </div>
        </div>
      </div>

      {/* نظام التبويبات */}
      <div className="my-applications-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`my-applications-tab ${selectedTab === tab.id ? "my-applications-tab-active" : ""}`}
            style={{ "--my-applications-active-color": tab.color }}
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
            <p>Loading your applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <>
            <div className="my-applications-results">
              Showing {applications.length} {status} application{applications.length !== 1 ? 's' : ''}
            </div>
            <div className="my-applications-grid">
              {applications.map((app) => {
                // تحليل التعليم للعرض الصحيح
                const educationArray = parseEducation(app.education);
                const educationText = educationArray.join(", ");
                
                return (
                  <div className="my-applications-card-wrapper" key={`${app.id}-${app.jobId}`}>
                    <div className={`my-applications-status-badge my-applications-status-${status}`}>
                      {status.toUpperCase()}
                    </div>
                    <div className="my-applications-meta">
                      <span className="my-applications-applied-date">
                        Applied: {formatDate(app.appliedDate)}
                      </span>
                      {app.approvedDate && (
                        <span className="my-applications-approved-date">
                          Approved: {formatDate(app.approvedDate)}
                        </span>
                      )}
                      {app.rejectedDate && (
                        <span className="my-applications-rejected-date">
                          Rejected: {formatDate(app.rejectedDate)}
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
                      // إضافة خصائص إضافية إذا كانت موجودة في JobCard
                      {...(app.skills && { skills: app.skills })}
                      {...(app.experience && { experience: app.experience })}
                      {...(educationText && { education: educationText })}
                    />
                    {app.feedback && status === "rejected" && (
                      <div className="my-applications-feedback">
                        <strong>Feedback:</strong> {app.feedback}
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
            <h3>No {status} applications found</h3>
            <p>You haven't received any updates for this category yet.</p>
            <button 
              onClick={() => navigate("/jobs")} 
              className="my-applications-browse-btn"
            >
              Browse Available Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;