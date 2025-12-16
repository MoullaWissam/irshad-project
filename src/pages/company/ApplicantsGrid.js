import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ApplicantsGrid.css";
import ApplicantsTable from "./ApplicantsTable";
import InterviewModal from "./InterviewModal";
import RejectionModal from "./RejectionModal";
import ConfirmationModal from "./ConfirmationModal";
import ApplicantDetailsModal from "./ApplicantDetailsModal";

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]); // جميع المتقدمين بدون تصفية

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
        console.log("Current path:", path);
        console.log("Job ID from URL:", jobId);
        
        let filteredApplicants = [...mockApplicants];
        
        if (jobId) {
          // الحالة 1: هناك jobId في الـ URL
          const jobIdNum = parseInt(jobId);
          const job = mockJobs.find(j => j.id === jobIdNum);
          
          if (job) {
            setSelectedJobTitle(job.title);
            filteredApplicants = mockApplicants.filter(app => app.jobId === jobIdNum);
            console.log(`Filtered by job ID ${jobIdNum}:`, filteredApplicants.length);
          } else {
            setSelectedJobTitle("");
            console.log("Job not found");
          }
        } else {
          setSelectedJobTitle("");
          console.log("No job ID in URL");
        }
        
        // حفظ جميع المتقدمين (قبل التصفية حسب الحالة)
        setAllApplicants(filteredApplicants);
        
        // ترتيب حسب التصنيف: ذهبي ← فضي ← برونزي
        const sortedApplicants = filteredApplicants.sort((a, b) => {
          const rankingOrder = { gold: 1, silver: 2, bronze: 3 };
          return (rankingOrder[a.ranking] || 4) - (rankingOrder[b.ranking] || 4);
        });
        
        // الآن تصفية حسب المسار (حالة المقابلة)
        let finalApplicants = sortedApplicants;
        
        if (path.includes("/none")) {
          finalApplicants = sortedApplicants.filter(app => app.interviewStatus === "none");
          console.log("Filtered by status 'none':", finalApplicants.length);
        } else if (path.includes("/sent")) {
          finalApplicants = sortedApplicants.filter(app => app.interviewStatus === "sent");
          console.log("Filtered by status 'sent':", finalApplicants.length);
        } else if (path.includes("/rejected")) {
          finalApplicants = sortedApplicants.filter(app => app.interviewStatus === "rejected");
          console.log("Filtered by status 'rejected':", finalApplicants.length);
        } else if (path.includes("/scheduled")) {
          finalApplicants = sortedApplicants.filter(app => app.interviewStatus === "scheduled");
          console.log("Filtered by status 'scheduled':", finalApplicants.length);
        }
        // إذا كان المسار /all أو بدون تصفية، نعرض الجميع
        
        console.log("Final applicants to display:", finalApplicants.length);
        setApplicants(finalApplicants);
        
      } catch (error) {
        console.error("Error fetching applicants:", error);
        // عرض بعض البيانات في حالة الخطأ للاختبار
        setAllApplicants(mockApplicants);
        setApplicants(mockApplicants.slice(0, 2));
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
        
        // تحديث allApplicants أيضًا
        setAllApplicants(prev => prev.map(a => 
          a.id === applicant.id 
            ? { ...a, interviewStatus: "sent" }
            : a
        ));
        
        // محاكاة إرسال طلب المقابلة إلى السيرفر
        console.log(`Sending interview request to ${applicant.email}`);
        
        // محاكاة API call
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
    
    // تحديث allApplicants أيضًا
    setAllApplicants(prev => prev.map(a => 
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
    
    // محاكاة API call
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
            rejectionReason: reason,
            interviewDate: null // إزالة تاريخ المقابلة إذا كان موجوداً
          }
        : a
    ));
    
    // تحديث allApplicants أيضًا
    setAllApplicants(prev => prev.map(a => 
      a.id === selectedApplicant.id 
        ? { 
            ...a, 
            interviewStatus: "rejected",
            rejectionReason: reason,
            interviewDate: null
          }
        : a
    ));
    
    // محاكاة إرسال الإيميل إلى المتقدم
    console.log(`=== REJECTION EMAIL SENT ===`);
    console.log(`To: ${selectedApplicant.email}`);
    console.log(`Subject: Update on Your Application for ${selectedApplicant.jobTitle}`);
    console.log(`Reason: ${reason}`);
    console.log(`===========================`);
    
    // محاكاة API call
    // await rejectApplicantAPI(selectedApplicant.id, reason);
    
    setShowRejectionModal(false);
  };

  const handleUndoRejection = (applicant) => {
    setSelectedApplicant(applicant);
    
    // تحديد الحالة الجديدة
    let newStatus = "none";
    let statusText = "No Interview Sent";
    
    if (applicant.interviewDate) {
      const interviewDate = new Date(applicant.interviewDate);
      const now = new Date();
      if (interviewDate > now) {
        newStatus = "scheduled";
        statusText = "Interview Scheduled";
      }
    }
    
    setConfirmationData({
      title: "Undo Rejection",
      message: `Are you sure you want to undo the rejection for ${applicant.firstName} ${applicant.lastName}?
      
This will:
• Change their status to: "${statusText}"
• Send a notification email to: ${applicant.email}
• Add them back to the active candidates list
${newStatus === "scheduled" ? "• Re-instate their scheduled interview" : ""}

An email will be sent to notify them that their application is being reconsidered.`,
      confirmText: "Undo Rejection & Send Email",
      onConfirm: async () => {
        try {
          // 1. تحديث الحالة
          setApplicants(prev => prev.map(a => 
            a.id === applicant.id 
              ? { 
                  ...a, 
                  interviewStatus: newStatus,
                  rejectionReason: ""
                }
              : a
          ));
          
          setAllApplicants(prev => prev.map(a => 
            a.id === applicant.id 
              ? { 
                  ...a, 
                  interviewStatus: newStatus,
                  rejectionReason: ""
                }
              : a
          ));
          
          // 2. إرسال إيميل التراجع
          await sendUndoRejectionNotification(applicant, newStatus);
          
          console.log(`Success: Undo rejection for ${applicant.email}`);
          
        } catch (error) {
          console.error("Failed to undo rejection:", error);
        }
      }
    });
    setShowConfirmationModal(true);
  };

  // دالة محاكاة إرسال إيميل التراجع
  const sendUndoRejectionNotification = async (applicant, newStatus) => {
    // محاكاة API call
    console.log(`Sending undo rejection email to ${applicant.email}...`);
    
    // تحديد نوع الإيميل
    let emailSubject = "";
    let emailBody = "";
    
    if (newStatus === "scheduled") {
      emailSubject = `Update: Your Interview for ${applicant.jobTitle} Has Been Reinstated`;
      emailBody = `Dear ${applicant.firstName},

We are writing to inform you that we are reconsidering your application for the ${applicant.jobTitle} position.

Your previously scheduled interview has been reinstated:

Date: ${new Date(applicant.interviewDate).toLocaleDateString()}
Time: ${new Date(applicant.interviewDate).toLocaleTimeString()}

Please let us know if this time still works for you.

We apologize for any confusion and look forward to speaking with you.

Best regards,
The Hiring Team`;
    } else {
      emailSubject = `Update: Your Application for ${applicant.jobTitle} Is Being Reconsidered`;
      emailBody = `Dear ${applicant.firstName},

Thank you for your patience.

We are writing to inform you that we are reconsidering your application for the ${applicant.jobTitle} position at our company.

After further review, we would like to continue the recruitment process with you. We will be in touch shortly with next steps.

We appreciate your continued interest and look forward to reconnecting.

Best regards,
The Hiring Team`;
    }
    
    // محاكاة إرسال الإيميل
    console.log(`=== UNDO REJECTION EMAIL SENT ===`);
    console.log(`To: ${applicant.email}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);
    console.log(`=================================`);
    
    // محاكاة انتظار الإرسال
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Email sent successfully to ${applicant.email}`);
    return true;
  };

  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsModal(true);
  };

  const getPageTitle = () => {
    if (selectedJobTitle) {
      return `Applicants for ${selectedJobTitle}`;
    }
    
    const path = location.pathname;
    if (path.includes("/none")) {
      return "Applicants - No Interview Sent";
    } else if (path.includes("/sent")) {
      return "Applicants - Interview Request Sent";
    } else if (path.includes("/rejected")) {
      return "Applicants - Rejected";
    } else if (path.includes("/scheduled")) {
      return "Applicants - Scheduled";
    } else if (path.includes("/all")) {
      return "All Applicants";
    } else if (path.includes("/company/applicants")) {
      return "Applicants";
    } else if (path.includes("/company/dashboard")) {
      return "Dashboard - Recent Applicants";
    }
    
    return "Applicants";
  };

  const getApplicantsCountByStatus = () => {
    // استخدام allApplicants لحساب العدد الإجمالي لكل حالة
    const counts = {
      all: allApplicants.length,
      none: allApplicants.filter(a => a.interviewStatus === "none").length,
      sent: allApplicants.filter(a => a.interviewStatus === "sent").length,
      rejected: allApplicants.filter(a => a.interviewStatus === "rejected").length,
      scheduled: allApplicants.filter(a => a.interviewStatus === "scheduled").length
    };
    
    console.log("Applicant counts by status:", counts);
    return counts;
  };

  return (
    <div className="applicants-grid-container">
      <div className="applicants-header">
        <h1>{getPageTitle()}</h1>
        {selectedJobTitle && (
          <div className="job-info-badge">
            <span>Job: {selectedJobTitle}</span>
            <span className="applicants-count">{allApplicants.length} applicants</span>
          </div>
        )}
      </div>
      
      {/* Status Filters */}
      {!loading && (
        <div className="status-filters">
          <a 
            href={jobId ? `/company/applicants/all?jobId=${jobId}` : "/company/applicants/all"} 
            className={`status-filter-btn ${!location.pathname.includes('/none') && !location.pathname.includes('/sent') && !location.pathname.includes('/rejected') && !location.pathname.includes('/scheduled') ? 'active' : ''}`}
          >
            All ({getApplicantsCountByStatus().all})
          </a>
          <a 
            href={jobId ? `/company/applicants/none?jobId=${jobId}` : "/company/applicants/none"} 
            className={`status-filter-btn ${location.pathname.includes('/none') ? 'active' : ''}`}
          >
            No Interview Sent ({getApplicantsCountByStatus().none})
          </a>
          <a 
            href={jobId ? `/company/applicants/sent?jobId=${jobId}` : "/company/applicants/sent"} 
            className={`status-filter-btn ${location.pathname.includes('/sent') ? 'active' : ''}`}
          >
            Interview Request Sent ({getApplicantsCountByStatus().sent})
          </a>
          <a 
            href={jobId ? `/company/applicants/rejected?jobId=${jobId}` : "/company/applicants/rejected"} 
            className={`status-filter-btn ${location.pathname.includes('/rejected') ? 'active' : ''}`}
          >
            Rejected ({getApplicantsCountByStatus().rejected})
          </a>
          <a 
            href={jobId ? `/company/applicants/scheduled?jobId=${jobId}` : "/company/applicants/scheduled"} 
            className={`status-filter-btn ${location.pathname.includes('/scheduled') ? 'active' : ''}`}
          >
            Scheduled ({getApplicantsCountByStatus().scheduled})
          </a>
        </div>
      )}
      
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
          onViewDetails={handleViewApplicantDetails}
        />
      ) : (
        <div className="no-applicants">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applicants found</h3>
            <p>There are no applicants for this selection.</p>
            <div className="empty-actions">
              <a 
                href={jobId ? `/company/applicants/all?jobId=${jobId}` : "/company/applicants/all"} 
                className="btn-view-all"
              >
                View All Applicants
              </a>
            </div>
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
          
          <ApplicantDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            applicant={selectedApplicant}
            onSendInterviewRequest={handleSendInterviewRequest}
            onScheduleInterview={handleScheduleInterview}
            onRejectApplicant={handleRejectApplicant}
            onUndoRejection={handleUndoRejection}
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