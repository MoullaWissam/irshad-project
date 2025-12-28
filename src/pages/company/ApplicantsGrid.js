import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from 'react-i18next';
import "react-toastify/dist/ReactToastify.css";
import "./ApplicantsGrid.css";
import ApplicantsTable from "./ApplicantsTable";
import InterviewModal from "./InterviewModal";
import RejectionModal from "./RejectionModal";
import ConfirmationModal from "./ConfirmationModal";
import ApplicantDetailsModal from "./ApplicantDetailsModal";

function ApplicantsGrid() {
  const { t } = useTranslation();
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [allApplicants, setAllApplicants] = useState([]);

  // جلب بيانات الوظيفة والمتقدمين
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("Fetching data for jobId:", jobId);
      
      try {
        // 1. جلب تفاصيل الوظيفة من localStorage أو API
        const savedJob = localStorage.getItem(`job_${jobId}`);
        if (savedJob) {
          const jobData = JSON.parse(savedJob);
          setJobDetails(jobData);
          setSelectedJobTitle(jobData.title);
          console.log("Loaded job from localStorage:", jobData);
        }

        // 2. جلب المتقدمين للوظيفة
        console.log("Fetching applicants for job:", jobId);
        const response = await fetch(
          `http://localhost:3000/company-management/company/job/${jobId}/applicants`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const applicantsResponse = await response.json();
        console.log("Applicants API response:", applicantsResponse);
        
        // تحويل البيانات إلى التنسيق المناسب
        const formattedApplicants = applicantsResponse.map(app => {
          // حساب التصنيف بناءً على النقاط
          let ranking = "bronze";
          const rankingScore = app.ranking_score || 0;
          const testScore = app.test_score || 0;
          
          if (rankingScore > 0.7 ) ranking = "gold";
          else if (rankingScore > 0.4 ) ranking = "silver";
          
          // تحديد حالة المقابلة - نستخدم application_status مباشرة
          let interviewStatus = app.application_status;
          
          return {
            id: app.id,
            userId: app.user.id,
            applicationId: app.id,
            firstName: app.user.firstName,
            lastName: app.user.lastName,
            email: app.user.email,
            estimated_salary: app.estimated_salary || "N/A",
            appliedAt: app.createdAt,
            ranking: ranking,
            interviewStatus: interviewStatus,
            interviewDate: app.interview_date || null,
            rejectionReason: app.rejectionFeedback || "",
            jobId: app.job.id,
            jobTitle: app.job.title,
            resume: app.resume,
            application_status: app.application_status,
            interview_status: app.interview_status,
            ranking_score: app.ranking_score,
            test_score: app.test_score,
            coverLetter: app.cover_letter || "",
            testScore: app.test_score
          };
        });

        setAllApplicants(formattedApplicants);
        
        // 3. تصفية المتقدمين حسب المسار
        const path = location.pathname;
        let filteredApplicants = [...formattedApplicants];
        
        if (path.includes("/none")) {
          filteredApplicants = formattedApplicants.filter(app => app.interviewStatus === "pending");
        } else if (path.includes("/sent")) {
          filteredApplicants = formattedApplicants.filter(app => app.interviewStatus === "sent");
        } else if (path.includes("/rejected")) {
          filteredApplicants = formattedApplicants.filter(app => app.interviewStatus === "rejected");
        } else if (path.includes("/scheduled")) {
          filteredApplicants = formattedApplicants.filter(app => app.interview_status === "scheduled");
        } else if (path.includes("/accepted")) {
          filteredApplicants = formattedApplicants.filter(app => app.interviewStatus === "accepted");
        }
        
        setApplicants(filteredApplicants);
        toast.success(`${t("Loaded")} ${formattedApplicants.length} ${t("applicants")}`);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`${t("Failed to load data:")} ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId, location.pathname, t]);

  // جدولة مقابلة
  const handleScheduleInterview = (applicant) => {
    setSelectedApplicant(applicant);
    setShowInterviewModal(true);
  };

  // رفض متقدم
  const handleRejectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowRejectionModal(true);
  };

  // تأكيد جدولة المقابلة
  const handleInterviewScheduled = async (dateTime, notes, meetingUrl) => {
    if (!selectedApplicant) return;
    
    try {
      console.log("Scheduling interview for:", selectedApplicant);
      
      // إرسال طلب جدولة المقابلة 
      const response = await fetch(
        `http://localhost:3000/interview/${selectedApplicant.jobId}/applicants/${selectedApplicant.applicationId}/interview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include",
          body: JSON.stringify({
            interviewDate: dateTime.split('T')[0],
            interviewTime: dateTime.split('T')[1],
            meetingUrl: meetingUrl,
            additionalNotes: notes
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Interview scheduled response:", responseData);
      
      // تحديث الحالة محلياً
      setApplicants(prev => prev.map(a => 
        a.id === selectedApplicant.id 
          ? { 
              ...a, 
              interviewStatus: "scheduled",
              interviewDate: dateTime,
              interview_status: "scheduled",
              meetingUrl: meetingUrl
            }
          : a
      ));
      
      setAllApplicants(prev => prev.map(a => 
        a.id === selectedApplicant.id 
          ? { 
              ...a, 
              interviewStatus: "scheduled",
              interviewDate: dateTime,
              interview_status: "scheduled",
              meetingUrl: meetingUrl
            }
          : a
      ));
      
      toast.success(t("Interview scheduled successfully!"));
      setShowInterviewModal(false);
      
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error(`${t("Failed to schedule interview:")} ${error.message}`);
    }
  };

  // تأكيد رفض المتقدم
  const handleRejectionConfirmed = async (reason) => {
    if (!selectedApplicant) return;
    
    try {
      console.log("Rejecting applicant:", selectedApplicant);
      
      // إرسال طلب الرفض
      const response = await fetch(
        `http://localhost:3000/company-management/${selectedApplicant.jobId}/rejectuser/${selectedApplicant.userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include",
          body: JSON.stringify({
            rejectionFeedback: reason
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Rejection response:", responseData);
      
      // تحديث الحالة محلياً
      setApplicants(prev => prev.map(a => 
        a.id === selectedApplicant.id 
          ? { 
              ...a, 
              interviewStatus: "rejected",
              rejectionReason: reason,
              application_status: "rejected"
            }
          : a
      ));
      
      setAllApplicants(prev => prev.map(a => 
        a.id === selectedApplicant.id 
          ? { 
              ...a, 
              interviewStatus: "rejected",
              rejectionReason: reason,
              application_status: "rejected"
            }
          : a
      ));
      
      toast.success(t("Applicant rejected successfully!"));
      setShowRejectionModal(false);
      
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      toast.error(`${t("Failed to reject applicant:")} ${error.message}`);
    }
  };

  // قبول المتقدم
  const handleAcceptApplicant = async (applicant) => {
    setSelectedApplicant(applicant);
    setConfirmationData({
      title: t("Accept Applicant"),
      message: `${t("Are you sure you want to accept")} ${applicant.firstName} ${applicant.lastName} ${t("for this position?")}`,
      confirmText: t("Accept"),
      onConfirm: async () => {
        try {
          console.log("Accepting applicant:", applicant);
          
          // إرسال طلب القبول
          const response = await fetch(
            `http://localhost:3000/company-management/acceptuser/${applicant.userId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: "include"
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          console.log("Acceptance response:", responseData);
          
          // تحديث الحالة محلياً
          setApplicants(prev => prev.map(a => 
            a.id === applicant.id 
              ? { ...a, application_status: "accepted", interviewStatus: "accepted" }
              : a
          ));
          
          setAllApplicants(prev => prev.map(a => 
            a.id === applicant.id 
              ? { ...a, application_status: "accepted", interviewStatus: "accepted" }
              : a
          ));
          
          toast.success(t("Applicant accepted successfully!"));
          
        } catch (error) {
          console.error("Error accepting applicant:", error);
          toast.error(`${t("Failed to accept applicant:")} ${error.message}`);
        }
      }
    });
    setShowConfirmationModal(true);
  };

  // عرض تفاصيل المتقدم
  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsModal(true);
  };

  // عرض السيرة الذاتية
  const handleViewResume = async (applicant) => {
    try {
      console.log("Viewing resume for:", applicant);
      
      // الحصول على رابط السيرة الذاتية
      const resumePath = applicant.resume?.file_path;
      console.log(resumePath);
      
      if (resumePath) {
        // استخراج اسم الملف من المسار
        const fileName = resumePath.split('/').pop();
        
        // استخدام الرابط الصحيح
        const response = await fetch(
          `http://localhost:3000/company-management/job-apply/${applicant.applicationId}/resume/${applicant.userId}/path`,
          {
            credentials: "include"
          }
        );
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log("Blob size:", blob.size);
        
        // إنشاء رابط للملف
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName || 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // تحرير الذاكرة
        window.URL.revokeObjectURL(url);
        
        toast.success(t("Resume downloaded successfully!"));
      } else {
        toast.warning(t("No resume available for this applicant"));
      }
    } catch (error) {
      console.error("Error viewing resume:", error);
      toast.error(t("Failed to download resume"));
    }
  };

  const getPageTitle = () => {
    if (selectedJobTitle) {
      return `${t("Applicants for")} ${selectedJobTitle}`;
    }
    
    const path = location.pathname;
    if (path.includes("/none")) {
      return t("Applicants - Pending");
    } else if (path.includes("/sent")) {
      return t("Applicants - Interview Request Sent");
    } else if (path.includes("/rejected")) {
      return t("Applicants - Rejected");
    } else if (path.includes("/scheduled")) {
      return t("Applicants - Interview Scheduled");
    } else if (path.includes("/accepted")) {
      return t("Applicants - Accepted");
    } else if (path.includes("/all")) {
      return t("All Applicants");
    }
    
    return t("Applicants");
  };

  const getApplicantsCountByStatus = () => {
    const counts = {
      all: allApplicants.length,
      pending: allApplicants.filter(a => a.interviewStatus === "pending").length,
      sent: allApplicants.filter(a => a.interviewStatus === "sent").length,
      rejected: allApplicants.filter(a => a.interviewStatus === "rejected").length,
      scheduled: allApplicants.filter(a => a.interview_status === "scheduled").length,
      accepted: allApplicants.filter(a => a.interviewStatus === "accepted").length
    };
    
    return counts;
  };

  return (
    <div className="applicants-grid-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="applicants-header">
        <h1>{getPageTitle()}</h1>
        {selectedJobTitle && (
          <div className="job-info-badge">
            <span>{t("Job")}: {selectedJobTitle}</span>
            <span className="applicants-count">{allApplicants.length} {t("applicants")}</span>
          </div>
        )}
      </div>
      
      {/* Status Filters */}
      {!loading && (
        <div className="status-filters">
          <a 
            href={`/company/applicants/job/${jobId}/all`} 
            className={`status-filter-btn ${location.pathname.includes('/all') ? 'active' : ''}`}
          >
            {t("All")} ({getApplicantsCountByStatus().all})
          </a>
          <a 
            href={`/company/applicants/job/${jobId}/pending`} 
            className={`status-filter-btn ${location.pathname.includes('/pending') ? 'active' : ''}`}
          >
            {t("Pending")} ({getApplicantsCountByStatus().pending})
          </a>
          <a 
            href={`/company/applicants/job/${jobId}/scheduled`} 
            className={`status-filter-btn ${location.pathname.includes('/scheduled') ? 'active' : ''}`}
          >
            {t("Scheduled")} ({getApplicantsCountByStatus().scheduled})
          </a>
          <a 
            href={`/company/applicants/job/${jobId}/rejected`} 
            className={`status-filter-btn ${location.pathname.includes('/rejected') ? 'active' : ''}`}
          >
            {t("Rejected")} ({getApplicantsCountByStatus().rejected})
          </a>
          <a 
            href={`/company/applicants/job/${jobId}/accepted`} 
            className={`status-filter-btn ${location.pathname.includes('/accepted') ? 'active' : ''}`}
          >
            {t("Accepted")} ({getApplicantsCountByStatus().accepted})
          </a>
        </div>
      )}
      
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>{t("Loading applicants...")}</p>
        </div>
      ) : applicants.length > 0 ? (
        <ApplicantsTable
          applicants={applicants}
          onScheduleInterview={handleScheduleInterview}
          onRejectApplicant={handleRejectApplicant}
          onAcceptApplicant={handleAcceptApplicant}
          onViewDetails={handleViewApplicantDetails}
          onViewResume={handleViewResume}
        />
      ) : (
        <div className="no-applicants">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{t("No applicants found")}</h3>
            <p>{t("There are no applicants for this selection.")}</p>
            <div className="empty-actions">
              <a 
                href={`/company/applicants/job/${jobId}/all`} 
                className="btn-view-all"
              >
                {t("View All Applicants")}
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
            onScheduleInterview={handleScheduleInterview}
            onRejectApplicant={handleRejectApplicant}
            onAcceptApplicant={handleAcceptApplicant}
            onViewResume={handleViewResume}
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