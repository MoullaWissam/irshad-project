import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import "./ApplicantsGrid.css";
import ApplicantsTable from "./ApplicantsTable";
import InterviewModal from "./InterviewModal";
import RejectionModal from "./RejectionModal";
import ConfirmationModal from "./ConfirmationModal";
import ApplicantDetailsModal from "./ApplicantDetailsModal";
import {
  FiUsers,
  FiFilter,
  FiRefreshCw,
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCalendar,
  FiDownload,
  FiSearch,
  FiFileText,
  FiUser,
  FiMail,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // تحديث الفلتر النشط عند تغيير المسار
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/pending")) setActiveFilter("pending");
    else if (path.includes("/sent")) setActiveFilter("sent");
    else if (path.includes("/rejected")) setActiveFilter("rejected");
    else if (path.includes("/scheduled")) setActiveFilter("scheduled");
    else if (path.includes("/accepted")) setActiveFilter("accepted");
    else setActiveFilter("all");
  }, [location.pathname]);

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
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const applicantsResponse = await response.json();
        console.log("Applicants API response:", applicantsResponse);

        // تحويل البيانات إلى التنسيق المناسب
        const formattedApplicants = applicantsResponse.map((app) => {
          // حساب التصنيف بناءً على النقاط
          let ranking = "bronze";
          const rankingScore = app.ranking_score || 0;
          const testScore = app.test_score || 0;

          if (rankingScore > 0.7) ranking = "gold";
          else if (rankingScore > 0.4) ranking = "silver";

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
            testScore: app.test_score,
            interviews: app.interviews || [],
          };
        });

        setAllApplicants(formattedApplicants);

        // 3. تصفية المتقدمين حسب المسار
        const path = location.pathname;
        let filteredApplicants = [...formattedApplicants];

        if (path.includes("/pending")) {
          filteredApplicants = formattedApplicants.filter(
            (app) => app.interviewStatus === "pending"
          );
        } else if (path.includes("/sent")) {
          filteredApplicants = formattedApplicants.filter(
            (app) => app.interviewStatus === "sent"
          );
        } else if (path.includes("/rejected")) {
          filteredApplicants = formattedApplicants.filter(
            (app) => app.interviewStatus === "rejected"
          );
        } else if (path.includes("/scheduled")) {
          filteredApplicants = formattedApplicants.filter(
            (app) => app.interview_status === "scheduled"
          );
        } else if (path.includes("/accepted")) {
          filteredApplicants = formattedApplicants.filter(
            (app) => app.interviewStatus === "accepted"
          );
        }

        setApplicants(filteredApplicants);
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

  // تطبيق البحث
  const filteredApplicants = searchQuery
    ? applicants.filter((applicant) => {
        const searchLower = searchQuery.toLowerCase();
        const fullName =
          `${applicant.firstName} ${applicant.lastName}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          applicant.email.toLowerCase().includes(searchLower) ||
          applicant.jobTitle?.toLowerCase().includes(searchLower) ||
          applicant.ranking?.toLowerCase().includes(searchLower)
        );
      })
    : applicants;

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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            interviewDate: dateTime.split("T")[0],
            interviewTime: dateTime.split("T")[1],
            meetingUrl: meetingUrl,
            additionalNotes: notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Interview scheduled response:", responseData);

      // تحديث الحالة محلياً
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === selectedApplicant.id
            ? {
                ...a,
                interviewStatus: "scheduled",
                interviewDate: dateTime,
                interview_status: "scheduled",
                meetingUrl: meetingUrl,
              }
            : a
        )
      );

      setAllApplicants((prev) =>
        prev.map((a) =>
          a.id === selectedApplicant.id
            ? {
                ...a,
                interviewStatus: "scheduled",
                interviewDate: dateTime,
                interview_status: "scheduled",
                meetingUrl: meetingUrl,
              }
            : a
        )
      );

      setShowInterviewModal(false);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error(`${t("Failed to schedule interview:")} ${error.message}`);
    }
  };

  // تأكيد رفض المتقدم - تم التعديل ليناسب متطلبات API
  const handleRejectionConfirmed = async (feedbackText) => {
    if (!selectedApplicant) return;

    // التحقق من طول النص (على الأقل 5 أحرف)
    if (!feedbackText || feedbackText.trim().length < 5) {
      toast.error(t("Rejection reason must be at least 5 characters long"));
      return;
    }

    try {
      console.log("Rejecting applicant:", selectedApplicant);
      console.log("Feedback text:", feedbackText);

      // إرسال طلب الرفض مع حقل feedback فقط
      const response = await fetch(
        `http://localhost:3000/company-management/${selectedApplicant.jobId}/rejectuser/${selectedApplicant.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            feedback: feedbackText,
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Rejection response:", responseData);

      // تحديث الحالة محلياً
      const updatedApplicant = {
        ...selectedApplicant,
        interviewStatus: "rejected",
        rejectionReason: feedbackText,
        application_status: "rejected",
      };

      setApplicants((prev) =>
        prev.map((a) => (a.id === selectedApplicant.id ? updatedApplicant : a))
      );

      setAllApplicants((prev) =>
        prev.map((a) => (a.id === selectedApplicant.id ? updatedApplicant : a))
      );

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
      message: `${t("Are you sure you want to accept")} ${
        applicant.firstName
      } ${applicant.lastName} ${t("for this position?")}`,
      confirmText: t("Accept"),
      onConfirm: async () => {
        try {
          console.log("Accepting applicant:", applicant);

          // إرسال طلب القبول
          const response = await fetch(
            `http://localhost:3000/company-management/acceptuser/${applicant.userId}/${jobId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          console.log("Acceptance response:", responseData);

          // تحديث الحالة محلياً
          setApplicants((prev) =>
            prev.map((a) =>
              a.id === applicant.id
                ? {
                    ...a,
                    application_status: "accepted",
                    interviewStatus: "accepted",
                  }
                : a
            )
          );

          setAllApplicants((prev) =>
            prev.map((a) =>
              a.id === applicant.id
                ? {
                    ...a,
                    application_status: "accepted",
                    interviewStatus: "accepted",
                  }
                : a
            )
          );
        } catch (error) {
          console.error("Error accepting applicant:", error);
          toast.error(`${t("Failed to accept applicant:")} ${error.message}`);
        }
      },
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
        const fileName = resumePath.split("/").pop();

        // استخدام الرابط الصحيح
        const response = await fetch(
          `http://localhost:3000/company-management/job-apply/${applicant.applicationId}/resume/${applicant.userId}/path`,
          {
            credentials: "include",
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
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "resume.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();

        // تحرير الذاكرة
        window.URL.revokeObjectURL(url);
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
    if (path.includes("/pending")) {
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
      pending: allApplicants.filter((a) => a.interviewStatus === "pending")
        .length,
      sent: allApplicants.filter((a) => a.interviewStatus === "sent").length,
      rejected: allApplicants.filter((a) => a.interviewStatus === "rejected")
        .length,
      scheduled: allApplicants.filter((a) => a.interview_status === "scheduled")
        .length,
      accepted: allApplicants.filter((a) => a.interviewStatus === "accepted")
        .length,
    };

    return counts;
  };

  // تحديث ApplicantsTable لاستقبال بحث
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // دالة للتعامل مع تغيير الفلتر
  const handleFilterChange = (filterType) => {
    // تحديث الفلتر النشط
    setActiveFilter(filterType);

    // التنقل باستخدام react-router دون إعادة تحميل الصفحة
    navigate(`/company/applicants/job/${jobId}/${filterType}`);
  };

  // تحديث بيانات المتقدمين عند تغيير الفلتر
  useEffect(() => {
    if (allApplicants.length === 0) return;

    let filtered = [...allApplicants];

    switch (activeFilter) {
      case "pending":
        filtered = allApplicants.filter(
          (app) => app.interviewStatus === "pending"
        );
        break;
      case "sent":
        filtered = allApplicants.filter(
          (app) => app.interviewStatus === "sent"
        );
        break;
      case "rejected":
        filtered = allApplicants.filter(
          (app) => app.interviewStatus === "rejected"
        );
        break;
      case "scheduled":
        filtered = allApplicants.filter(
          (app) => app.interview_status === "scheduled"
        );
        break;
      case "accepted":
        filtered = allApplicants.filter(
          (app) => app.interviewStatus === "accepted"
        );
        break;
      default:
        // "all" - لا تصفية
        break;
    }

    setApplicants(filtered);
  }, [activeFilter, allApplicants]);

  return (
    <div className="ag-page-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="ag-header">
        <div className="ag-header-content">
          <div className="ag-header-main">
            <button className="ag-back-button" onClick={() => navigate(-1)}>
              <FiArrowLeft size={20} />
            </button>
            <div className="ag-header-text">
              <h1>
                <FiUsers size={24} />
                {getPageTitle()}
              </h1>
              {selectedJobTitle && (
                <div className="ag-job-info">
                  <span className="ag-job-title">
                    <FiBriefcase size={16} />
                    {selectedJobTitle}
                  </span>
                  <span className="ag-applicants-count">
                    <FiUsers size={16} />
                    {allApplicants.length} {t("applicants")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="ag-search-container">
            <div className="ag-search-box">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder={t(
                  "Search applicants by name, email, or position..."
                )}
                value={searchQuery}
                onChange={handleSearchChange}
                className="ag-search-input"
              />
            </div>
            <button
              className="ag-refresh-button"
              onClick={() => window.location.reload()}
              title={t("Refresh")}
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      {/* {!loading && (
        <div className="ag-status-filters">
          <button
            onClick={() => handleFilterChange("all")}
            className={`ag-status-filter ${
              activeFilter === "all" ? "ag-active" : ""
            }`}
          >
            <div className="ag-filter-icon">
              <FiUsers size={20} />
            </div>
            <div className="ag-filter-content">
              <div className="ag-filter-title">{t("All")}</div>
              <div className="ag-filter-count">
                {getApplicantsCountByStatus().all}
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleFilterChange("pending")}
            className={`ag-status-filter ${
              activeFilter === "pending" ? "ag-active" : ""
            }`}
          >
            <div className="ag-filter-icon">
              <FiClock size={20} />
            </div>
            <div className="ag-filter-content">
              <div className="ag-filter-title">{t("Pending")}</div>
              <div className="ag-filter-count">
                {getApplicantsCountByStatus().pending}
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleFilterChange("sent")}
            className={`ag-status-filter ${
              activeFilter === "sent" ? "ag-active" : ""
            }`}
          >
            <div className="ag-filter-icon">
              <FiCalendar size={20} />
            </div>
            <div className="ag-filter-content">
              <div className="ag-filter-title">{t("Interview Sent")}</div>
              <div className="ag-filter-count">
                {getApplicantsCountByStatus().sent}
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleFilterChange("scheduled")}
            className={`ag-status-filter ${
              activeFilter === "scheduled" ? "ag-active" : ""
            }`}
          >
            <div className="ag-filter-icon">
              <FiCalendar size={20} />
            </div>
            <div className="ag-filter-content">
              <div className="ag-filter-title">{t("Scheduled")}</div>
              <div className="ag-filter-count">
                {getApplicantsCountByStatus().scheduled}
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleFilterChange("rejected")}
            className={`ag-status-filter ${
              activeFilter === "rejected" ? "ag-active" : ""
            }`}
          >
            <div className="ag-filter-icon">
              <FiXCircle size={20} />
            </div>
            <div className="ag-filter-content">
              <div className="ag-filter-title">{t("Rejected")}</div>
              <div className="ag-filter-count">
                {getApplicantsCountByStatus().rejected}
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleFilterChange("accepted")}
            className={`ag-status-filter ${
              activeFilter === "accepted" ? "ag-active" : ""
            }`}
          >
            <div className="ag-filter-icon">
              <FiCheckCircle size={20} />
            </div>
            <div className="ag-filter-content">
              <div className="ag-filter-title">{t("Accepted")}</div>
              <div className="ag-filter-count">
                {getApplicantsCountByStatus().accepted}
              </div>
            </div>
          </button>
        </div>
      )} */}

      {/* Main Content */}
      <div className="ag-main-content">
        {loading ? (
          <div className="ag-loading-container">
            <div className="ag-spinner"></div>
            <p>{t("Loading applicants...")}</p>
          </div>
        ) : filteredApplicants.length > 0 ? (
          <ApplicantsTable
            applicants={filteredApplicants}
            onScheduleInterview={handleScheduleInterview}
            onRejectApplicant={handleRejectApplicant}
            onAcceptApplicant={handleAcceptApplicant}
            onViewDetails={handleViewApplicantDetails}
            onViewResume={handleViewResume}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="ag-no-applicants">
            <div className="ag-empty-state">
              <div className="ag-empty-icon">
                {searchQuery ? (
                  <FiSearch size={48} />
                ) : (
                  <FiFileText size={48} />
                )}
              </div>
              <h3>
                {searchQuery
                  ? t("No matching applicants found")
                  : t("No applicants found")}
              </h3>
              <p>
                {searchQuery
                  ? t("Try adjusting your search terms")
                  : t("There are no applicants for this selection.")}
              </p>
              <div className="ag-empty-actions">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ag-btn-clear-search"
                  >
                    {t("Clear Search")}
                  </button>
                ) : (
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="ag-btn-view-all"
                  >
                    <FiUsers size={16} />
                    {t("View All Applicants")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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
