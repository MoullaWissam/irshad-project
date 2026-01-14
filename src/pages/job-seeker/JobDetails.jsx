import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faBriefcase,
  faFileAlt,
  faTools,
  faBullseye,
  faGraduationCap,
  faStar,
  faTasks,
  faMoneyBillWave,
  faPaperPlane,
  faBuilding,
  faCalendarAlt,
  faTimesCircle,
  faTrash,
  faEdit,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasTest, setHasTest] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [userType, setUserType] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // استخدام useRef لمنع الإرسال المزدوج
  const isSubmittingRef = useRef(false);
  const applicationCheckRef = useRef(false);

  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  };

  const iconStyle = {
    color: "#0b2b82",
    marginRight: "5px",
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            t("Failed to fetch job: {status}", { status: response.status })
          );
        }

        const data = await response.json();
        setJob(data);
        setHasTest(data.hasTest || false);
      } catch (error) {
        console.error("Failed to load job:", error);

        toast.error(t("Failed to load job details"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 3000,
          rtl: isRTL,
        });

        const mockJobs = {
          1: {
            id: 1,
            title: t("Email Marketing Specialist"),
            type: t("FULL TIME"),
            location: t("Damascus"),
            companyName: t("Tech Solutions Inc."),
            description: t(
              "We are seeking a skilled Email Marketing Specialist to join our dynamic marketing team. You will be responsible for creating and executing email marketing campaigns, analyzing performance metrics, and optimizing strategies for maximum engagement."
            ),
            skills: t(
              "Email Marketing, Copywriting, Analytics, CRM Tools, A/B Testing"
            ),
            experience: t("3+ years in digital marketing"),
            education: t("Bachelor's degree in Marketing or related field"),
            hasTest: true,
            testDuration: 5,
          },
          2: {
            id: 2,
            title: t("Frontend Developer"),
            type: t("FULL TIME"),
            location: t("Remote"),
            companyName: t("WebTech Co."),
            description: t(
              "Looking for a skilled frontend developer with React experience. You will be responsible for building user interfaces, implementing responsive designs, and collaborating with backend developers."
            ),
            skills: t("React, JavaScript, HTML5, CSS3, Git, Responsive Design"),
            experience: t("2+ years in frontend development"),
            education: t("Computer Science or equivalent"),
            hasTest: false,
          },
        };

        const mockData = mockJobs[jobId] || mockJobs[1];
        setJob(mockData);
        setHasTest(mockData.hasTest || false);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, t, isRTL]);

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول من مصادر متعددة
    console.log("🔍 Checking authentication status...");

    // 1. التحقق من وجود توكن في الكوكيز (الطريقة الرئيسية)
    const getTokenFromCookies = () => {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      return match ? match[2] : null;
    };

    const token = getTokenFromCookies();
    console.log("Token from cookies:", token ? "Found" : "Not found");

    // 2. التحقق من البيانات في localStorage
    const userRole = localStorage.getItem("userRole");
    const userData = localStorage.getItem("userData");
    const companyData = localStorage.getItem("companyData");
    const user = localStorage.getItem("user");

    console.log("userRole from localStorage:", userRole);
    console.log("userData:", userData ? "Exists" : "Not found");
    console.log("companyData:", companyData ? "Exists" : "Not found");
    console.log("user:", user ? "Exists" : "Not found");

    // إذا كان هناك توكن أو بيانات مستخدم، نعتبر المستخدم مسجل دخول
    const isLoggedIn = token || userData || companyData || user;
    console.log("Is user logged in?", isLoggedIn);

    if (!isLoggedIn) {
      console.log("🚫 User is not logged in - showing login prompt");
      setUserType(null);
      setCompanyId(null);
      return;
    }

    // تحديد نوع المستخدم
    if (userRole === "company") {
      console.log("🏢 Setting userType to: company");
      setUserType("company");

      // البحث عن companyId
      let foundCompanyId = null;

      // التحقق من companyData
      if (companyData) {
        try {
          const parsed = JSON.parse(companyData);
          foundCompanyId = parsed.id || parsed.userId || null;
          console.log("Found companyId from companyData:", foundCompanyId);
        } catch (error) {
          console.error("Error parsing companyData:", error);
        }
      }

      // التحقق من userData
      if (!foundCompanyId && userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed.role === "company") {
            foundCompanyId = parsed.id || parsed.userId || null;
            console.log("Found companyId from userData:", foundCompanyId);
          }
        } catch (error) {
          console.error("Error parsing userData:", error);
        }
      }

      // التحقق من user
      if (!foundCompanyId && user) {
        try {
          const parsed = JSON.parse(user);
          if (parsed.role === "company") {
            foundCompanyId = parsed.id || parsed.userId || null;
            console.log("Found companyId from user:", foundCompanyId);
          }
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }

      setCompanyId(foundCompanyId);
    } else if (userRole === "jobSeeker") {
      console.log("👤 Setting userType to: user");
      setUserType("user");
      setCompanyId(null);
    } else {
      // إذا كان userRole غير محدد، نحاول تخمينه من البيانات الأخرى
      console.log(
        "❓ userRole not found, trying to determine from other data..."
      );

      // إذا كان هناك companyData، فهو شركة
      if (companyData) {
        console.log("🏢 Determined userType: company (from companyData)");
        setUserType("company");

        // محاولة استخراج companyId
        try {
          const parsed = JSON.parse(companyData);
          setCompanyId(parsed.id || parsed.userId || null);
        } catch (error) {
          console.error("Error parsing companyData:", error);
          setCompanyId(null);
        }
      } else if (userData) {
        // التحقق من userData
        try {
          const parsed = JSON.parse(userData);
          if (parsed.role === "company") {
            console.log("🏢 Determined userType: company (from userData.role)");
            setUserType("company");
            setCompanyId(parsed.id || parsed.userId || null);
          } else if (parsed.role === "user") {
            console.log("👤 Determined userType: user (from userData.role)");
            setUserType("user");
            setCompanyId(null);
          } else {
            // إذا لم يكن هناك role محدد، نعتبره مستخدم عادي
            console.log("👤 Defaulting userType to: user (no role specified)");
            setUserType("user");
            setCompanyId(null);
          }
        } catch (error) {
          console.error("Error parsing userData:", error);
          // في حالة الخطأ، نعتبره مستخدم عادي
          console.log("👤 Defaulting userType to: user (error parsing data)");
          setUserType("user");
          setCompanyId(null);
        }
      } else {
        // إذا لم يكن هناك أي بيانات، المستخدم غير مسجل دخول
        console.log("🚫 Cannot determine user type - showing login prompt");
        setUserType(null);
        setCompanyId(null);
      }
    }
  }, []);

  // التحقق مما إذا تقدم المستخدم للوظيفة من قبل
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!jobId || userType !== "user" || applicationCheckRef.current) {
        return;
      }

      applicationCheckRef.current = true;
      setCheckingApplication(true);

      try {
        console.log("🔍 Checking if user has already applied for job:", jobId);

        // محاولة التحقق من التقديمات السابقة
        try {
          const response = await fetch(
            `http://localhost:3000/jobapply/${jobId}/check`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Application check response:", data);
            setHasApplied(data.applied || data.hasApplied || false);
          } else if (response.status === 404) {
            // إذا كان الـ endpoint غير موجود، نستخدم الطريقة البديلة
            console.log("Check endpoint not found, trying alternative method");
            checkAppliedAlternative();
          }
        } catch (error) {
          console.log(
            "Primary check failed, trying alternative:",
            error.message
          );
          checkAppliedAlternative();
        }
      } catch (error) {
        console.error("Error checking application status:", error);
        setHasApplied(false);
      } finally {
        setCheckingApplication(false);
      }
    };

    // طريقة بديلة للتحقق من التقديم
    const checkAppliedAlternative = async () => {
      try {
        // جلب سجل التقديمات للمستخدم
        const response = await fetch(`http://localhost:3000/myapplications`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const applications = await response.json();
          const hasAppliedToJob = applications.some(
            (app) =>
              app.jobId === parseInt(jobId) ||
              app.job?.id === parseInt(jobId) ||
              app.jobId?.toString() === jobId
          );
          setHasApplied(hasAppliedToJob);
          console.log("Alternative check result:", hasAppliedToJob);
        }
      } catch (error) {
        console.error("Alternative check failed:", error);
        setHasApplied(false);
      }
    };

    checkIfApplied();

    // تنظيف الـ ref عند إلغاء التحميل
    return () => {
      applicationCheckRef.current = false;
    };
  }, [jobId, userType]);

  const handleApply = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      console.log(" Apply button clicked");

      if (checkingApplication) {
        toast.info(t("Checking application status..."), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 2000,
          rtl: isRTL,
        });
        return;
      }

      if (hasApplied) {
        toast.warning(t("You have already applied for this job"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
          rtl: isRTL,
        });
        return;
      }

      if (hasTest) {
        navigate(`/job/${jobId}/test`, { state: { jobData: job } });
      } else {
        console.log(" Showing confirmation dialog");
        setShowConfirmation(true);
      }
    },
    [checkingApplication, hasApplied, hasTest, jobId, job, navigate, t, isRTL]
  );

  const confirmApplyWithoutTest = async (e) => {
    // منع السلوك الافتراضي إذا كان هناك event
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("✅ Confirm application clicked");

    // منع الإرسال المزدوج باستخدام ref
    if (isSubmittingRef.current) {
      console.log(" Request already in progress, ignoring duplicate click");
      toast.info(t("Application is already being submitted..."), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 2000,
        rtl: isRTL,
      });
      return;
    }

    // التحقق من حالة التقديم السابقة مرة أخرى
    if (hasApplied) {
      toast.warning(t("You have already applied for this job"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 5000,
        rtl: isRTL,
      });
      setShowConfirmation(false);
      return;
    }

    isSubmittingRef.current = true;
    setIsApplying(true);

    console.log(" Sending single application request for job:", jobId);

    try {
      const response = await fetch(`http://localhost:3000/jobapply/${jobId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(" Response received, status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        console.error(" Server error:", errorData);

        // التحقق من رسائل الخطأ المختلفة
        const errorMessage = errorData.message || errorData.error || "";
        const lowerErrorMessage = errorMessage.toLowerCase();

        if (
          response.status === 400 &&
          (lowerErrorMessage.includes("already") ||
            lowerErrorMessage.includes("تقدمت") ||
            lowerErrorMessage.includes("مسبقاً") ||
            lowerErrorMessage.includes("قبلاً") ||
            lowerErrorMessage.includes("سابقاً"))
        ) {
          setHasApplied(true);
          toast.warning(t("You have already applied for this job"), {
            position: isRTL ? "top-left" : "top-right",
            autoClose: 5000,
            rtl: isRTL,
          });
          return;
        }

        throw new Error(
          errorMessage ||
            t("HTTP error! status: {status}", { status: response.status })
        );
      }

      const result = await response.json();
      console.log("✅ Application successful:", result);

      // تحديث الحالة بعد التقديم الناجح
      setHasApplied(true);

      toast.success(t("Application submitted successfully!"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL,
      });

      // الانتقال بعد تأخير قصير
      setTimeout(() => {
        navigate(`/job/${jobId}/application-success`, {
          state: {
            jobData: job,
            applicationResult: result,
            testCompleted: false,
          },
        });
      }, 500);
    } catch (error) {
      console.error(" Error submitting application:", error);

      // عرض رسالة خطأ مناسبة
      const errorMessage = error.message || "";
      const lowerErrorMessage = errorMessage.toLowerCase();

      if (
        lowerErrorMessage.includes("already") ||
        lowerErrorMessage.includes("تقدمت") ||
        lowerErrorMessage.includes("مسبقاً")
      ) {
        toast.warning(t("You have already applied for this job"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
          rtl: isRTL,
        });
        setHasApplied(true);
      } else if (
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("Failed to fetch")
      ) {
        toast.error(
          t("Network error. Please check your connection and try again."),
          {
            position: isRTL ? "top-left" : "top-right",
            autoClose: 5000,
            rtl: isRTL,
          }
        );
      } else {
        toast.error(t("Failed to submit application. Please try again."), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
          rtl: isRTL,
        });
      }
    } finally {
      // إعادة تعيين بعد تأخير بسيط لمنع النقر السريع
      setTimeout(() => {
        isSubmittingRef.current = false;
        setIsApplying(false);
        setShowConfirmation(false);
        console.log("🔄 Application state reset");
      }, 1000);
    }
  };

  const handleEditJob = () => {
    if (companyId) {
      navigate(`/job/${jobId}/edit`);
    } else {
      toast.error(t("Company ID not found. Please login again."), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL,
      });
    }
  };

  const handleDeleteJob = async () => {
    if (
      !window.confirm(
        t(
          "Are you sure you want to delete this job? This action cannot be undone."
        )
      )
    ) {
      return;
    }

    try {
      // الحصول على التوكن من الكوكيز
      const getTokenFromCookies = () => {
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        return match ? match[2] : null;
      };

      const token = getTokenFromCookies();
      console.log("Token for delete request:", token ? "Found" : "Not found");

      const headers = {
        "Content-Type": "application/json",
      };

      // إضافة التوكن إذا كان موجودًا
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
        headers: headers,
      });

      if (response.status === 401 || response.status === 403) {
        toast.error(t("Session expired. Please login again."), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 3000,
          rtl: isRTL,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(
          t("Delete failed: {status}", { status: response.status })
        );
      }

      toast.success(t("Job deleted successfully!"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 1500,
        rtl: isRTL,
      });

      // الانتظار قليلاً ثم التوجيه إلى صفحة AddJob
      setTimeout(() => {
        // استخدم navigate مع المسار الصحيح من App.js
        navigate("/company/AddJob");
      }, 1500);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.message, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL,
      });
    }
  };

  const cancelApply = () => {
    console.log(" Application cancelled");
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div
        className="job-details-page"
        dir={isRTL ? "rtl" : "ltr"}
        style={robotoStyle}
      >
        <ToastContainer
          position={isRTL ? "top-left" : "top-right"}
          rtl={isRTL}
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
        <div className="job-loading-state">
          <div className="loading-spinner-animation"></div>
          <p style={robotoStyle}>{t("Loading job details...")}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="job-details-page"
        dir={isRTL ? "rtl" : "ltr"}
        style={robotoStyle}
      >
        <ToastContainer
          position={isRTL ? "top-left" : "top-right"}
          rtl={isRTL}
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
        <div className="job-error-state">
          <h2 style={robotoStyle}>{t("Job Not Found")}</h2>
          <p style={robotoStyle}>
            {t("The job you're looking for doesn't exist or has been removed.")}
          </p>
          <button onClick={() => navigate("/jobs")} style={{ fontWeight: 500 }}>
            {t("Back to Jobs")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="job-details-page"
      dir={isRTL ? "rtl" : "ltr"}
      style={robotoStyle}
    >
      <ToastContainer
        position={isRTL ? "top-left" : "top-right"}
        rtl={isRTL}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      />

      <div className="job-details-content">
        <div
          className="navigation-back-link"
          onClick={() => navigate("/jobs")}
          style={robotoStyle}
        >
          <FontAwesomeIcon icon={faTimesCircle} style={iconStyle} />
          {t("Back to Jobs")}
        </div>

        <div className="job-header-section">
          <div className="job-title-area">
            <h1 className="job-main-title" style={{ fontWeight: 600 }}>
              {job.title || t("Untitled Job")}
            </h1>
            <div className="job-info-meta" style={robotoStyle}>
              <span className="job-info-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={iconStyle} />
                {job.location || t("Not specified")}
              </span>
              <span className="job-info-item">
                <FontAwesomeIcon icon={faClock} style={iconStyle} />
                {job.type || t("FULL TIME")}
              </span>
              <span className="job-info-item">
                <FontAwesomeIcon icon={faBriefcase} style={iconStyle} />
                {job.employmentType || t("Full-time")}
              </span>
            </div>
            {job.salary && (
              <div className="job-salary-tag" style={robotoStyle}>
                <FontAwesomeIcon icon={faMoneyBillWave} style={iconStyle} />
                {job.salary}
              </div>
            )}
          </div>

          <div className="apply-action-area">
            {userType === "company" && (
              <div className="company-management-actions">
                <button
                  className="edit-job-action"
                  onClick={handleEditJob}
                  style={{ fontWeight: 500 }}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ marginRight: "5px" }}
                  />
                  {t("Edit Job")}
                </button>
                <button
                  className="delete-job-action"
                  onClick={handleDeleteJob}
                  style={{ fontWeight: 500 }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ marginRight: "5px" }}
                  />
                  {t("Delete Job")}
                </button>
              </div>
            )}

            {userType === "user" && (
              <div className="apply-action-container">
                {checkingApplication ? (
                  <button
                    className="job-apply-button"
                    disabled
                    style={{
                      fontWeight: 500,
                      opacity: 0.7,
                      backgroundColor: "#6c757d",
                      cursor: "not-allowed",
                    }}
                  >
                    <div
                      className="loading-spinner-small"
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px",
                      }}
                    ></div>
                    {t("Checking...")}
                  </button>
                ) : hasApplied ? (
                  <button
                    className="job-applied-button"
                    disabled
                    style={{
                      fontWeight: 500,
                      backgroundColor: "#28a745",
                      cursor: "not-allowed",
                      opacity: 0.9,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={{ marginRight: "8px" }}
                    />
                    ✓ {t("Already Applied")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="job-apply-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApply(e);
                    }}
                    disabled={isApplying}
                    style={{
                      fontWeight: 500,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isApplying ? (
                      <>
                        <div
                          className="loading-spinner-small"
                          style={{
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "white",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            marginRight: "8px",
                          }}
                        ></div>
                        {t("Applying...")}
                      </>
                    ) : hasTest ? (
                      t("Apply & Start Test")
                    ) : (
                      t("Apply Now")
                    )}
                  </button>
                )}
                {job.createdAt && (
                  <p className="job-posted-date" style={robotoStyle}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={iconStyle} />
                    {t("Posted")}:{" "}
                    {new Date(job.createdAt).toLocaleDateString(
                      i18n.language === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            )}

            {!userType && (
              <div className="login-prompt">
                <p style={robotoStyle}>
                  {t("Please login to apply for this job")}
                </p>
                <button
                  onClick={() => navigate("/login")}
                  style={{ fontWeight: 500 }}
                >
                  {t("Login")}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="job-company-card">
          <div
            className="company-logo-avatar"
            style={{
              backgroundColor: job.image ? "white" : "",
              background: job.image
                ? "white"
                : "linear-gradient(135deg, #0b2b82 0%, #1a4dc7 100%)",
            }}
          >
            {job.image ? (
              <img
                src={job.image}
                alt={job.companyName || t("Company Logo")}
                className="company-logo-image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <svg
                data-prefix="fas"
                data-icon="building"
                className="svg-inline--fa fa-building"
                role="img"
                viewBox="0 0 384 512"
                aria-hidden="true"
                style={{ color: "white", fontSize: "26px" }}
              >
                <path
                  fill="currentColor"
                  d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3 28.7-64 64-64L64 0zM176 352l32 0c17.7 0 32 14.3 32 32l0 80-96 0 0-80c0-17.7 14.3-32 32-32zM96 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM240 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM96 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"
                ></path>
              </svg>
            )}
          </div>
          <div className="company-details-info">
            <h3 className="company-title-name" style={{ fontWeight: 600 }}>
              {job.companyName || t("Unknown Company")}
            </h3>
            <p className="company-brief-description" style={robotoStyle}>
              {job.companyDescription || t("A leading company in its field")}
            </p>
            {job.companyRating && (
              <div className="company-rating-stars">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-value" style={robotoStyle}>
                  {job.companyRating}/5
                </span>
              </div>
            )}
          </div>
        </div>

        {job.tags && (
          <div className="job-categories-tags">
            {job.tags.split(",").map((tag, index) => (
              <span key={index} className="category-tag" style={robotoStyle}>
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="job-sections-grid">
          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faFileAlt} style={iconStyle} />
              <h4 style={{ fontWeight: 600 }}>{t("Job Description")}</h4>
            </div>
            <p style={robotoStyle}>
              {job.description || t("No description available")}
            </p>
          </div>

          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faTools} style={iconStyle} />
              <h4 style={{ fontWeight: 600 }}>{t("Required Skills")}</h4>
            </div>
            <div className="skills-grid-container">
              {job.skills ? (
                job.skills.split(",").map((skill, index) => (
                  <div
                    key={index}
                    className="skill-tag-item"
                    style={robotoStyle}
                  >
                    <strong>{skill.trim()}</strong>
                  </div>
                ))
              ) : (
                <p style={robotoStyle}>{t("Not specified")}</p>
              )}
            </div>
          </div>

          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faBullseye} style={iconStyle} />
              <h4 style={{ fontWeight: 600 }}>{t("Required Experience")}</h4>
            </div>
            <p style={robotoStyle}>{job.experience || t("Not specified")}</p>
          </div>

          <div className="job-detail-card">
            <div className="detail-card-header">
              <FontAwesomeIcon icon={faGraduationCap} style={iconStyle} />
              <h4 style={{ fontWeight: 600 }}>{t("Required Education")}</h4>
            </div>
            <p style={robotoStyle}>{job.education || t("Not specified")}</p>
          </div>

          {job.benefits && (
            <div className="job-detail-card">
              <div className="detail-card-header">
                <FontAwesomeIcon icon={faStar} style={iconStyle} />
                <h4 style={{ fontWeight: 600 }}>{t("Benefits & Perks")}</h4>
              </div>
              <ul style={robotoStyle}>
                {job.benefits.split(",").map((benefit, index) => (
                  <li key={index}>{benefit.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities && (
            <div className="job-detail-card">
              <div className="detail-card-header">
                <FontAwesomeIcon icon={faTasks} style={iconStyle} />
                <h4 style={{ fontWeight: 600 }}>{t("Key Responsibilities")}</h4>
              </div>
              <ul style={robotoStyle}>
                {job.responsibilities
                  .split(",")
                  .map((responsibility, index) => (
                    <li key={index}>{responsibility.trim()}</li>
                  ))}
              </ul>
            </div>
          )}

          {hasTest && (
            <div className="job-detail-card test-info">
              <div className="detail-card-header">
                <FontAwesomeIcon icon={faFileAlt} style={iconStyle} />
                <h4 style={{ fontWeight: 600 }}>{t("Test Information")}</h4>
              </div>
              <p style={robotoStyle}>
                {t("This job requires a screening test.")}
              </p>
              <p style={robotoStyle}>
                {t("Estimated time: {duration} minutes", {
                  duration: job.testDuration || 5,
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div
          className="confirmation-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelApply();
            }
          }}
        >
          <div
            className="confirmation-dialog-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-icon">
              <FontAwesomeIcon
                icon={faPaperPlane}
                style={{ color: "#00b4d8", fontSize: "52px" }}
              />
            </div>
            <h3 style={{ fontWeight: 600 }}>{t("Confirm Application")}</h3>
            <p style={robotoStyle}>
              {t("Are you sure you want to apply for this position?")}
            </p>
            <p
              style={{
                ...robotoStyle,
                fontSize: "14px",
                color: "#666",
                marginTop: "-10px",
              }}
            >
              {t("Your application will be sent directly to the employer.")}
            </p>
            <div className="dialog-action-buttons">
              <button
                className="dialog-cancel-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelApply();
                }}
                disabled={isApplying}
                style={{ fontWeight: 500 }}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="dialog-confirm-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirmApplyWithoutTest(e);
                }}
                disabled={isApplying}
                style={{ fontWeight: 500 }}
              >
                {isApplying ? (
                  <>
                    <div
                      className="loading-spinner-small"
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px",
                      }}
                    ></div>
                    {t("Applying...")}
                  </>
                ) : (
                  t("Yes, Apply Now")
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* إضافة CSS للـ spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .job-applied-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: not-allowed;
          width: 100%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .job-apply-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .dialog-confirm-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .loading-spinner-small {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
