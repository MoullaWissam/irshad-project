import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ApplicantCard from "../../Components/Card/ApplicantCard/ApplicantCard";
import "./ApplicantsGrid.css";

function ApplicantsGrid() {
  const { jobId } = useParams(); // الحصول على jobId من الـ URL
  const location = useLocation();
  const [applicants, setApplicants] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  // بيانات الوظائف التجريبية (ستأتي من API لاحقاً)
  const jobsData = [
    { id: 1, title: "Frontend Developer", company: "Tech Corp" },
    { id: 2, title: "Backend Developer", company: "Data Systems" },
    { id: 3, title: "UI/UX Designer", company: "Creative Studio" },
    { id: 4, title: "Project Manager", company: "Management Plus" },
  ];

  // بيانات المتقدمين التجريبية (ستأتي من API لاحقاً)
  const allApplicants = [
    {
      id: 1,
      name: "Ali",
      description: "3 years experience in React",
      avatar: "/avatars/ali.png",
      rank: 1,
      jobId: 1,
      jobTitle: "Frontend Developer",
      status: "new",
    },
    {
      id: 2,
      name: "Sara",
      description: "Frontend specialist with Vue.js",
      avatar: "/avatars/sara.png",
      rank: 2,
      jobId: 1,
      jobTitle: "Frontend Developer",
      status: "reviewed",
    },
    {
      id: 3,
      name: "Omar",
      description: "Backend developer with Node.js",
      avatar: "/avatars/omar.png",
      rank: 3,
      jobId: 2,
      jobTitle: "Backend Developer",
      status: "new",
    },
    {
      id: 4,
      name: "Lina",
      description: "UI/UX Designer with Figma expertise",
      avatar: "/avatars/lina.png",
      rank: 4,
      jobId: 3,
      jobTitle: "UI/UX Designer",
      status: "reviewed",
    },
  ];

  useEffect(() => {
    // تحديد أي المتقدمين يعرض بناءً على jobId والمسار
    const path = location.pathname;
    
    if (jobId) {
      // الحالة 1: هناك jobId في الـ URL - عرض المتقدمين لهذه الوظيفة فقط
      const jobIdNum = parseInt(jobId);
      const job = jobsData.find(j => j.id === jobIdNum);
      
      if (job) {
        setSelectedJobTitle(job.title);
        const filteredApplicants = allApplicants.filter(app => app.jobId === jobIdNum);
        setApplicants(filteredApplicants);
      } else {
        // لم يتم العثور على الوظيفة
        setSelectedJobTitle("");
        setApplicants([]);
      }
    } else {
      // الحالة 2: لا يوجد jobId - نعرض حسب المسار
      setSelectedJobTitle("");
      
      if (path.includes("/company/applicants/all")) {
        setApplicants(allApplicants);
      } else if (path.includes("/company/applicants/new")) {
        setApplicants(allApplicants.filter(app => app.status === "new"));
      } else if (path.includes("/company/applicants/reviewed")) {
        setApplicants(allApplicants.filter(app => app.status === "reviewed"));
      } else if (path.includes("/company/applicants")) {
        // إذا كان المسار /company/applicants بدون jobId
        // نعرض جميع المتقدمين (يمكن تغييره لاحقاً)
        setApplicants(allApplicants);
      } else if (path.includes("/company/dashboard")) {
        // لعرض في dashboard
        setApplicants(allApplicants.slice(0, 4)); // أول 4 متقدمين فقط للdashboard
      } else {
        setApplicants(allApplicants);
      }
    }
  }, [jobId, location.pathname]);

  // تحديد عنوان الصفحة
  const getPageTitle = () => {
    if (selectedJobTitle) {
      return `Applicants for ${selectedJobTitle}`;
    }
    
    const path = location.pathname;
    if (path.includes("/company/applicants/new")) {
      return "New Applicants";
    } else if (path.includes("/company/applicants/reviewed")) {
      return "Reviewed Applicants";
    } else if (path.includes("/company/applicants/all")) {
      return "All Applicants";
    } else if (path.includes("/company/applicants")) {
      return "Applicants";
    } else if (path.includes("/company/dashboard")) {
      return "Dashboard - Recent Applicants";
    }
    
    return "Applicants";
  };

  return (
    <div className="applicants-grid-container">
      {/* العنوان فقط - لن أغير أي شيء آخر في الـ UI */}
      <h1>{getPageTitle()}</h1>
      
      {/* سيتم عرض نفس الـ UI الموجود بدون تغيير */}
      <div className="applicants-grid">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicantCard 
              key={applicant.id}
              name={applicant.name}
              description={applicant.description}
              avatar={applicant.avatar}
              rank={applicant.rank}
            />
          ))
        ) : (
          <div className="no-applicants">
            <p>No applicants found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantsGrid;