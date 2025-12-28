import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../Components/Card/JobCard/JobCard";
import RankedCardWrapper from "./RankedCardWrapper";
import "./MatchesPage.css";
import { useTranslation } from 'react-i18next';

function MatchesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // نمط خط Roboto
  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/auth/recommended-jobs",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(t("فشل في جلب البيانات"));
        }

        const data = await response.json();
        console.log(data);

        const mapped = data.map((job) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          employmentType: job.employmentType,
          companyLogo: job.company?.companyLogo
            ? `http://localhost:3000/${job.company.companyLogo}`
            : "/icons/default-company.png",
        }));

        setJobs(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [t]);

  return (
    <div 
      className="home-container" 
      dir={isRTL ? 'rtl' : 'ltr'} 
      style={robotoStyle}
    >
      {/* عنوان الصفحة */}
      <h2 style={{ textAlign: isRTL ? 'right' : 'left' }}>
        {t("Best Matched")} <span>{t("Jobs")}</span>
      </h2>

      {/* رسالة تحميل */}
      {loading && (
        <div 
          className="loading-message"
          style={{ textAlign: 'center', ...robotoStyle }}
        >
          {t("جاري تحميل الوظائف...")}
        </div>
      )}

      {/* رسالة خطأ */}
      {error && (
        <div 
          className="error-message"
          style={{ textAlign: 'center', ...robotoStyle }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* إذا ما في بيانات بعد الانتهاء من التحميل */}
      {!loading && !error && jobs.length === 0 && (
        <div 
          className="no-jobs-message"
          style={{ textAlign: 'center', ...robotoStyle }}
        >
          {t("لا توجد وظائف متاحة حالياً")}
        </div>
      )}

      {/* شبكة عرض الوظائف - تعرض فقط إذا في بيانات */}
      {!loading && !error && jobs.length > 0 && (
        <div className="job-grid">
          {jobs.map((job, index) => (
            <Link
              to={`/job/${job.id}`}
              key={job.id}
              style={{ 
                textDecoration: "none", 
                color: "inherit",
                display: 'block'
              }}
            >
              <RankedCardWrapper rank={index + 1}>
                <div className={`job-card-wrapper rank-${index + 1}`}>
                  <JobCard
                    icon={job.companyLogo}
                    title={job.title}
                    desc={job.description}
                    type={job.employmentType}
                  />
                </div>
              </RankedCardWrapper>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchesPage;