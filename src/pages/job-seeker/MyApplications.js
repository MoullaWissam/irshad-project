import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./MyApplications.css";

const MyApplications = () => {
  const { status = "pending" } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(status);

  // بيانات تجريبية واقعية
  const mockApplications = {
    pending: [
      { 
        id: 1, 
        jobId: "101", 
        title: "Frontend React Developer", 
        description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. Minimum 2 years experience required.", 
        employmentType: "Full-time", 
        companyLogo: "https://via.placeholder.com/50/007bff/ffffff?text=FB",
        companyName: "Facebook",
        location: "Remote",
        salary: "$85,000 - $110,000",
        appliedDate: "2024-01-15",
        status: "pending"
      },
      { 
        id: 2, 
        jobId: "102", 
        title: "UX/UI Designer", 
        description: "Design beautiful and intuitive user interfaces for mobile and web applications. Proficiency in Figma and Adobe Creative Suite required.", 
        employmentType: "Contract", 
        companyLogo: "https://via.placeholder.com/50/28a745/ffffff?text=AD",
        companyName: "Adobe Inc.",
        location: "San Francisco, CA",
        salary: "$70,000 - $95,000",
        appliedDate: "2024-01-10",
        status: "pending"
      },
      { 
        id: 3, 
        jobId: "103", 
        title: "Backend Node.js Engineer", 
        description: "Develop scalable server-side applications and APIs using Node.js, Express, and MongoDB. Experience with AWS is a plus.", 
        employmentType: "Full-time", 
        companyLogo: "https://via.placeholder.com/50/17a2b8/ffffff?text=AMZ",
        companyName: "Amazon",
        location: "Seattle, WA",
        salary: "$95,000 - $130,000",
        appliedDate: "2024-01-05",
        status: "pending"
      }
    ],
    approved: [
      { 
        id: 4, 
        jobId: "201", 
        title: "Full Stack Developer", 
        description: "Work on both frontend and backend development using React and Python/Django. Great opportunity to work on diverse projects.", 
        employmentType: "Full-time", 
        companyLogo: "https://via.placeholder.com/50/ffc107/000000?text=GO",
        companyName: "Google",
        location: "Mountain View, CA",
        salary: "$105,000 - $140,000",
        appliedDate: "2023-12-20",
        approvedDate: "2024-01-12",
        status: "approved"
      },
      { 
        id: 5, 
        jobId: "202", 
        title: "DevOps Engineer", 
        description: "Manage cloud infrastructure and CI/CD pipelines. Experience with Docker, Kubernetes, and Terraform required.", 
        employmentType: "Full-time", 
        companyLogo: "https://via.placeholder.com/50/6f42c1/ffffff?text=MS",
        companyName: "Microsoft",
        location: "Redmond, WA",
        salary: "$90,000 - $125,000",
        appliedDate: "2023-12-15",
        approvedDate: "2024-01-08",
        status: "approved"
      }
    ],
    rejected: [
      { 
        id: 6, 
        jobId: "301", 
        title: "Senior Product Manager", 
        description: "Lead product strategy and development for our SaaS platform. Minimum 5 years of product management experience required.", 
        employmentType: "Full-time", 
        companyLogo: "https://via.placeholder.com/50/dc3545/ffffff?text=AP",
        companyName: "Apple",
        location: "Cupertino, CA",
        salary: "$120,000 - $160,000",
        appliedDate: "2023-12-01",
        rejectedDate: "2023-12-20",
        status: "rejected",
        feedback: "Position requires more senior-level experience"
      },
      { 
        id: 7, 
        jobId: "302", 
        title: "Data Scientist", 
        description: "Apply machine learning algorithms to solve complex business problems. Proficiency in Python and TensorFlow required.", 
        employmentType: "Contract", 
        companyLogo: "https://via.placeholder.com/50/20c997/ffffff?text=IB",
        companyName: "IBM",
        location: "Remote",
        salary: "$80,000 - $110,000",
        appliedDate: "2023-11-25",
        rejectedDate: "2023-12-10",
        status: "rejected",
        feedback: "Looking for candidates with specific domain expertise"
      }
    ]
  };

  // مصفوفة التبويبات
  const tabs = [
    { id: "pending", label: "Pending", color: "#ffa500", count: mockApplications.pending.length },
    { id: "approved", label: "Approved", color: "#2ecc71", count: mockApplications.approved.length },
    { id: "rejected", label: "Rejected", color: "#e74c3c", count: mockApplications.rejected.length },
  ];

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchApplications = () => {
      setLoading(true);
      
      setTimeout(() => {
        const data = mockApplications[status] || [];
        setApplications(data);
        setSelectedTab(status);
        setLoading(false);
      }, 800);
    };

    fetchApplications();
  }, [status]);

  // دالة لمعالجة النقر على علامة التبويب
  const handleTabClick = (tabId) => {
    navigate(`/applications/${tabId}`);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
            <span className="my-applications-stat-number">{mockApplications.pending.length}</span>
            <span className="my-applications-stat-label">Pending</span>
          </div>
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{mockApplications.approved.length}</span>
            <span className="my-applications-stat-label">Approved</span>
          </div>
          <div className="my-applications-stat-item">
            <span className="my-applications-stat-number">{mockApplications.rejected.length}</span>
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
            <span className="my-applications-tab-count">{tab.count}</span>
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
              {applications.map((app) => (
                <div className="my-applications-card-wrapper" key={app.id}>
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
                  />
                  {app.feedback && status === "rejected" && (
                    <div className="my-applications-feedback">
                      <strong>Feedback:</strong> {app.feedback}
                    </div>
                  )}
                </div>
              ))}
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