import React from "react";
import { useTranslation } from 'react-i18next';

function ApplicationsPage({ type }) {
  const { t } = useTranslation();

  const getTitle = () => {
    switch(type) {
      case "approved": return t("Approved Applications");
      case "pending": return t("Pending Applications");
      case "denied": return t("Denied Applications");
      default: return t("Applications");
    }
  };

  const applications = [
    {
      id: 1,
      jobTitle: "Frontend Developer",
      company: "Tech Solutions Inc.",
      date: "2024-01-15",
      status: type,
    },
    {
      id: 2,
      jobTitle: "Backend Developer",
      company: "Data Systems LLC",
      date: "2024-01-10",
      status: type,
    },
    {
      id: 3,
      jobTitle: "UI/UX Designer",
      company: "Creative Minds",
      date: "2024-01-05",
      status: type,
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "green";
      case "pending": return "orange";
      case "denied": return "red";
      default: return "gray";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", color: "#333" }}>
        {getTitle()}
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {applications.map((app) => (
          <div 
            key={app.id} 
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#007bff" }}>
              {app.jobTitle}
            </h3>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>{t("Company")}:</strong> {app.company}
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>{t("Applied on")}:</strong> {app.date}
            </p>
            <span 
              style={{
                display: "inline-block",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: getStatusColor(app.status) === "green" ? "#d4edda" : 
                               getStatusColor(app.status) === "orange" ? "#fff3cd" : "#f8d7da",
                color: getStatusColor(app.status) === "green" ? "#155724" : 
                      getStatusColor(app.status) === "orange" ? "#856404" : "#721c24"
              }}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationsPage;