// import React, { useState, useEffect } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import ApplicantCard from "../../Components/Card/ApplicantCard/ApplicantCard";
// import "./ApplicantsGrid.css";

// function ApplicantsGrid() {
//   const { jobId } = useParams(); // الحصول على jobId من الـ URL
//   const location = useLocation();
//   const [applicants, setApplicants] = useState([]);
//   const [selectedJobTitle, setSelectedJobTitle] = useState("");

//   // بيانات الوظائف التجريبية (ستأتي من API لاحقاً)
//   const jobsData = [
//     { id: 1, title: "Frontend Developer", company: "Tech Corp" },
//     { id: 2, title: "Backend Developer", company: "Data Systems" },
//     { id: 3, title: "UI/UX Designer", company: "Creative Studio" },
//     { id: 4, title: "Project Manager", company: "Management Plus" },
//   ];

//   // بيانات المتقدمين التجريبية (ستأتي من API لاحقاً)
//   const allApplicants = [
//     {
//       id: 1,
//       name: "Ali",
//       description: "3 years experience in React",
//       avatar: "/avatars/ali.png",
//       rank: 1,
//       jobId: 1,
//       jobTitle: "Frontend Developer",
//       status: "new",
//     },
//     {
//       id: 2,
//       name: "Sara",
//       description: "Frontend specialist with Vue.js",
//       avatar: "/avatars/sara.png",
//       rank: 2,
//       jobId: 1,
//       jobTitle: "Frontend Developer",
//       status: "reviewed",
//     },
//     {
//       id: 3,
//       name: "Omar",
//       description: "Backend developer with Node.js",
//       avatar: "/avatars/omar.png",
//       rank: 3,
//       jobId: 2,
//       jobTitle: "Backend Developer",
//       status: "new",
//     },
//     {
//       id: 4,
//       name: "Lina",
//       description: "UI/UX Designer with Figma expertise",
//       avatar: "/avatars/lina.png",
//       rank: 4,
//       jobId: 3,
//       jobTitle: "UI/UX Designer",
//       status: "reviewed",
//     },
//   ];

//   useEffect(() => {
//     // تحديد أي المتقدمين يعرض بناءً على jobId والمسار
//     const path = location.pathname;
    
//     if (jobId) {
//       // الحالة 1: هناك jobId في الـ URL - عرض المتقدمين لهذه الوظيفة فقط
//       const jobIdNum = parseInt(jobId);
//       const job = jobsData.find(j => j.id === jobIdNum);
      
//       if (job) {
//         setSelectedJobTitle(job.title);
//         const filteredApplicants = allApplicants.filter(app => app.jobId === jobIdNum);
//         setApplicants(filteredApplicants);
//       } else {
//         // لم يتم العثور على الوظيفة
//         setSelectedJobTitle("");
//         setApplicants([]);
//       }
//     } else {
//       // الحالة 2: لا يوجد jobId - نعرض حسب المسار
//       setSelectedJobTitle("");
      
//       if (path.includes("/company/applicants/all")) {
//         setApplicants(allApplicants);
//       } else if (path.includes("/company/applicants/new")) {
//         setApplicants(allApplicants.filter(app => app.status === "new"));
//       } else if (path.includes("/company/applicants/reviewed")) {
//         setApplicants(allApplicants.filter(app => app.status === "reviewed"));
//       } else if (path.includes("/company/applicants")) {
//         // إذا كان المسار /company/applicants بدون jobId
//         // نعرض جميع المتقدمين (يمكن تغييره لاحقاً)
//         setApplicants(allApplicants);
//       } else if (path.includes("/company/dashboard")) {
//         // لعرض في dashboard
//         setApplicants(allApplicants.slice(0, 4)); // أول 4 متقدمين فقط للdashboard
//       } else {
//         setApplicants(allApplicants);
//       }
//     }
//   }, [jobId, location.pathname]);

//   // تحديد عنوان الصفحة
//   const getPageTitle = () => {
//     if (selectedJobTitle) {
//       return `Applicants for ${selectedJobTitle}`;
//     }
    
//     const path = location.pathname;
//     if (path.includes("/company/applicants/new")) {
//       return "New Applicants";
//     } else if (path.includes("/company/applicants/reviewed")) {
//       return "Reviewed Applicants";
//     } else if (path.includes("/company/applicants/all")) {
//       return "All Applicants";
//     } else if (path.includes("/company/applicants")) {
//       return "Applicants";
//     } else if (path.includes("/company/dashboard")) {
//       return "Dashboard - Recent Applicants";
//     }
    
//     return "Applicants";
//   };

//   return (
//     <div className="applicants-grid-container">
//       {/* العنوان فقط - لن أغير أي شيء آخر في الـ UI */}
//       <h1>{getPageTitle()}</h1>
      
//       {/* سيتم عرض نفس الـ UI الموجود بدون تغيير */}
//       <div className="applicants-grid">
//         {applicants.length > 0 ? (
//           applicants.map((applicant) => (
//             <ApplicantCard 
//               key={applicant.id}
//               name={applicant.name}
//               description={applicant.description}
//               avatar={applicant.avatar}
//               rank={applicant.rank}
//             />
//           ))
//         ) : (
//           <div className="no-applicants">
//             <p>No applicants found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ApplicantsGrid;



import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ApplicantsGrid.css";
import ApplicantsTable from "./ApplicantsTable";
import InterviewModal from "./InterviewModal";
import RejectionModal from "./RejectionModal";
import ConfirmationModal from "./ConfirmationModal";

function ApplicantsGrid() {
  const { jobId } = useParams();
  const location = useLocation();
  const [applicants, setApplicants] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [jobs, setJobs] = useState([]);

  // بيانات الوظائف التجريبية
  const mockJobs = [
    { id: 1, title: "Frontend Developer", company: "Tech Corp" },
    { id: 2, title: "Backend Developer", company: "Data Systems" },
    { id: 3, title: "UI/UX Designer", company: "Creative Studio" },
    { id: 4, title: "Project Manager", company: "Management Plus" },
  ];

  // بيانات المتقدمين مع التصنيف وحالة المقابلة
  const mockApplicants = [
    {
      id: 1,
      firstName: "Ali",
      lastName: "Ahmed",
      email: "ali@example.com",
      phone: "0991234567",
      appliedAt: "2024-01-15T10:30:00Z",
      ranking: "gold", // gold, silver, bronze
      interviewStatus: "none", // none, sent, scheduled, rejected
      interviewDate: null,
      rejectionReason: "",
      jobId: 1,
      jobTitle: "Frontend Developer",
      resume: {
        summary: "3 years experience in React and modern frontend frameworks",
        extracted_skills: ["React", "JavaScript", "HTML5", "CSS3", "Redux", "Git"],
        education: ["Bachelor in Computer Science - University of Damascus"],
        experience_years: 3,
        location: "Damascus, Syria",
        file_path: "/resumes/ali_cv.pdf"
      },
      coverLetter: "I am excited to apply for the Frontend Developer position. With 3 years of experience in React and modern web technologies, I believe I can contribute effectively to your team.",
      testScore: 92,
      testAnswers: [
        { question: "What is React?", answer: "A JavaScript library for building user interfaces" },
        { question: "What is JSX?", answer: "JavaScript XML syntax extension" }
      ]
    },
    {
      id: 2,
      firstName: "Sara",
      lastName: "Mohammed",
      email: "sara@example.com",
      phone: "0999876543",
      appliedAt: "2024-01-14T14:20:00Z",
      ranking: "silver",
      interviewStatus: "sent", // تم إرسال طلب مقابلة
      interviewDate: null,
      rejectionReason: "",
      jobId: 1,
      jobTitle: "Frontend Developer",
      resume: {
        summary: "Frontend specialist with Vue.js and TypeScript experience",
        extracted_skills: ["Vue.js", "TypeScript", "JavaScript", "SCSS", "Webpack"],
        education: ["Software Engineering - Al-Sham Private University"],
        experience_years: 2,
        location: "Damascus, Syria",
        file_path: "/resumes/sara_cv.pdf"
      },
      coverLetter: "As a passionate frontend developer with expertise in Vue.js, I am eager to join your innovative team and contribute to building amazing user experiences.",
      testScore: 85,
      testAnswers: [
        { question: "What is Vue.js?", answer: "A progressive JavaScript framework" },
        { question: "What is Vuex?", answer: "State management pattern + library for Vue.js" }
      ]
    },
    {
      id: 3,
      firstName: "Omar",
      lastName: "Khaled",
      email: "omar@example.com",
      phone: "0995551234",
      appliedAt: "2024-01-13T09:15:00Z",
      ranking: "bronze",
      interviewStatus: "rejected", // تم الرفض
      interviewDate: null,
      rejectionReason: "Insufficient experience for senior position",
      jobId: 1,
      jobTitle: "Frontend Developer",
      resume: {
        summary: "Backend developer with Node.js and Python experience",
        extracted_skills: ["Node.js", "Express", "Python", "Django", "MongoDB", "PostgreSQL"],
        education: ["Computer Science - Syrian Virtual University"],
        experience_years: 4,
        location: "Damascus, Syria",
        file_path: "/resumes/omar_cv.pdf"
      },
      coverLetter: "With extensive experience in backend development using Node.js and Python, I am confident in my ability to build scalable and efficient systems.",
      testScore: 78,
      testAnswers: []
    },
    {
      id: 4,
      firstName: "Lina",
      lastName: "Hassan",
      email: "lina@example.com",
      phone: "0993334444",
      appliedAt: "2024-01-12T16:45:00Z",
      ranking: "silver",
      interviewStatus: "scheduled", // تم تحديد موعد المقابلة
      interviewDate: "2024-02-10T14:30:00Z",
      rejectionReason: "",
      jobId: 2,
      jobTitle: "Backend Developer",
      resume: {
        summary: "UI/UX Designer with Figma expertise and user-centered design approach",
        extracted_skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
        education: ["Graphic Design - Fine Arts College"],
        experience_years: 3,
        location: "Damascus, Syria",
        file_path: "/resumes/lina_cv.pdf"
      },
      coverLetter: "As a creative UI/UX designer with a strong focus on user experience, I aim to create intuitive and beautiful designs that solve real user problems.",
      testScore: null,
      testAnswers: []
    }
  ];

  useEffect(() => {
    // محاكاة جلب البيانات من API
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // محاكاة API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setJobs(mockJobs);
        
        // تحديد أي المتقدمين يعرض بناءً على jobId والمسار
        const path = location.pathname;
        
        if (jobId) {
          // الحالة 1: هناك jobId في الـ URL
          const jobIdNum = parseInt(jobId);
          const job = mockJobs.find(j => j.id === jobIdNum);
          
          if (job) {
            setSelectedJobTitle(job.title);
            const filteredApplicants = mockApplicants.filter(app => app.jobId === jobIdNum);
            // ترتيب حسب التصنيف: ذهبي ← فضي ← برونزي
            const sortedApplicants = filteredApplicants.sort((a, b) => {
              const rankingOrder = { gold: 1, silver: 2, bronze: 3 };
              return rankingOrder[a.ranking] - rankingOrder[b.ranking];
            });
            setApplicants(sortedApplicants);
          } else {
            setSelectedJobTitle("");
            setApplicants([]);
          }
        } else {
          // الحالة 2: لا يوجد jobId
          setSelectedJobTitle("");
          
          // ترتيب جميع المتقدمين حسب التصنيف
          const sortedAllApplicants = mockApplicants.sort((a, b) => {
            const rankingOrder = { gold: 1, silver: 2, bronze: 3 };
            return rankingOrder[a.ranking] - rankingOrder[b.ranking];
          });
          
          if (path.includes("/company/applicants/all")) {
            setApplicants(sortedAllApplicants);
          } else if (path.includes("/company/applicants/none")) {
            setApplicants(sortedAllApplicants.filter(app => app.interviewStatus === "none"));
          } else if (path.includes("/company/applicants/sent")) {
            setApplicants(sortedAllApplicants.filter(app => app.interviewStatus === "sent"));
          } else if (path.includes("/company/applicants/rejected")) {
            setApplicants(sortedAllApplicants.filter(app => app.interviewStatus === "rejected"));
          } else if (path.includes("/company/applicants")) {
            setApplicants(sortedAllApplicants);
          } else if (path.includes("/company/dashboard")) {
            setApplicants(sortedAllApplicants.slice(0, 4));
          } else {
            setApplicants(sortedAllApplicants);
          }
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, location.pathname]);

  const handleSendInterviewRequest = (applicant) => {
    setSelectedApplicant(applicant);
    setConfirmationData({
      title: "Send Interview Request",
      message: `Are you sure you want to send an interview request to ${applicant.firstName} ${applicant.lastName}?`,
      confirmText: "Send Request",
      onConfirm: () => {
        // تغيير الحالة إلى "sent"
        setApplicants(prev => prev.map(a => 
          a.id === applicant.id 
            ? { ...a, interviewStatus: "sent" }
            : a
        ));
        
        // محاكاة إرسال طلب المقابلة إلى السيرفر
        console.log(`Sending interview request to ${applicant.email}`);
        
        // هنا سيتم استدعاء API حقيقي
        // await sendInterviewRequestAPI(applicant.id);
      }
    });
    setShowConfirmationModal(true);
  };

  const handleScheduleInterview = (applicant) => {
    setSelectedApplicant(applicant);
    setShowInterviewModal(true);
  };

  const handleRejectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowRejectionModal(true);
  };

  const handleInterviewScheduled = (dateTime, notes) => {
    if (!selectedApplicant) return;
    
    // تحديث حالة المتقدم وتاريخ المقابلة
    setApplicants(prev => prev.map(a => 
      a.id === selectedApplicant.id 
        ? { 
            ...a, 
            interviewStatus: "scheduled",
            interviewDate: dateTime,
            interviewNotes: notes
          }
        : a
    ));
    
    // محاكاة إرسال الإيميل إلى المتقدم
    console.log(`Interview scheduled for ${selectedApplicant.email} at ${dateTime}`);
    console.log(`Email sent to: ${selectedApplicant.email}`);
    console.log(`Interview details: ${notes}`);
    
    // هنا سيتم استدعاء API حقيقي لإرسال الإيميل
    // await scheduleInterviewAPI(selectedApplicant.id, dateTime, notes);
    
    setShowInterviewModal(false);
  };

  const handleRejectionConfirmed = (reason) => {
    if (!selectedApplicant) return;
    
    // تحديث حالة المتقدم وسبب الرفض
    setApplicants(prev => prev.map(a => 
      a.id === selectedApplicant.id 
        ? { 
            ...a, 
            interviewStatus: "rejected",
            rejectionReason: reason
          }
        : a
    ));
    
    // محاكاة إرسال الإيميل إلى المتقدم
    console.log(`Applicant ${selectedApplicant.email} rejected. Reason: ${reason}`);
    
    // هنا سيتم استدعاء API حقيقي لإرسال الإيميل
    // await rejectApplicantAPI(selectedApplicant.id, reason);
    
    setShowRejectionModal(false);
  };

  const handleUndoRejection = (applicant) => {
    setSelectedApplicant(applicant);
    setConfirmationData({
      title: "Undo Rejection",
      message: `Are you sure you want to undo the rejection for ${applicant.firstName} ${applicant.lastName}?`,
      confirmText: "Undo Rejection",
      onConfirm: () => {
        // إعادة الحالة إلى "none"
        setApplicants(prev => prev.map(a => 
          a.id === applicant.id 
            ? { ...a, interviewStatus: "none", rejectionReason: "" }
            : a
        ));
        
        console.log(`Undo rejection for ${applicant.email}`);
      }
    });
    setShowConfirmationModal(true);
  };

  const getPageTitle = () => {
    if (selectedJobTitle) {
      return `Applicants for ${selectedJobTitle}`;
    }
    
    const path = location.pathname;
    if (path.includes("/company/applicants/none")) {
      return "Applicants - No Interview Sent";
    } else if (path.includes("/company/applicants/sent")) {
      return "Applicants - Interview Request Sent";
    } else if (path.includes("/company/applicants/rejected")) {
      return "Applicants - Rejected";
    } else if (path.includes("/company/applicants/all")) {
      return "All Applicants";
    } else if (path.includes("/company/applicants")) {
      return "Applicants";
    } else if (path.includes("/company/dashboard")) {
      return "Dashboard - Recent Applicants";
    }
    
    return "Applicants";
  };

  const getApplicantsCountByStatus = () => {
    const counts = {
      all: applicants.length,
      none: applicants.filter(a => a.interviewStatus === "none").length,
      sent: applicants.filter(a => a.interviewStatus === "sent").length,
      rejected: applicants.filter(a => a.interviewStatus === "rejected").length,
      scheduled: applicants.filter(a => a.interviewStatus === "scheduled").length
    };
    
    return counts;
  };

  return (
    <div className="applicants-grid-container">
      <div className="applicants-header">
        <h1>{getPageTitle()}</h1>
        {selectedJobTitle && (
          <div className="job-info-badge">
            <span>Job: {selectedJobTitle}</span>
            <span className="applicants-count">{applicants.length} applicants</span>
          </div>
        )}
      </div>
      
      {/* Status Filters */}
      <div className="status-filters">
        <a 
          href="/company/applicants/all" 
          className={`status-filter-btn ${location.pathname.includes('/all') || (!location.pathname.includes('/none') && !location.pathname.includes('/sent') && !location.pathname.includes('/rejected')) ? 'active' : ''}`}
        >
          All ({getApplicantsCountByStatus().all})
        </a>
        <a 
          href="/company/applicants/none" 
          className={`status-filter-btn ${location.pathname.includes('/none') ? 'active' : ''}`}
        >
          No Interview Sent ({getApplicantsCountByStatus().none})
        </a>
        <a 
          href="/company/applicants/sent" 
          className={`status-filter-btn ${location.pathname.includes('/sent') ? 'active' : ''}`}
        >
          Interview Request Sent ({getApplicantsCountByStatus().sent})
        </a>
        <a 
          href="/company/applicants/rejected" 
          className={`status-filter-btn ${location.pathname.includes('/rejected') ? 'active' : ''}`}
        >
          Rejected ({getApplicantsCountByStatus().rejected})
        </a>
      </div>
      
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading applicants...</p>
        </div>
      ) : applicants.length > 0 ? (
        <ApplicantsTable
          applicants={applicants}
          onSendInterviewRequest={handleSendInterviewRequest}
          onScheduleInterview={handleScheduleInterview}
          onRejectApplicant={handleRejectApplicant}
          onUndoRejection={handleUndoRejection}
        />
      ) : (
        <div className="no-applicants">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applicants found</h3>
            <p>There are no applicants for this selection.</p>
          </div>
        </div>
      )}
      
      {/* Modals */}
      {selectedApplicant && (
        <>
          <InterviewModal
            isOpen={showInterviewModal}
            onClose={() => setShowInterviewModal(false)}
            applicant={selectedApplicant}
            onSchedule={handleInterviewScheduled}
          />
          
          <RejectionModal
            isOpen={showRejectionModal}
            onClose={() => setShowRejectionModal(false)}
            applicant={selectedApplicant}
            onReject={handleRejectionConfirmed}
          />
        </>
      )}
      
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmationData?.onConfirm}
        title={confirmationData?.title}
        message={confirmationData?.message}
        confirmText={confirmationData?.confirmText}
      />
    </div>
  );
}

export default ApplicantsGrid;