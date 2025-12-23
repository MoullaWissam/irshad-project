import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // أضيفي هذا السطر
import JobCard from "../../Components/Card/JobCard/JobCard";
import RankedCardWrapper from "./RankedCardWrapper";
import "./MatchesPage.css";

function MatchesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          throw new Error("فشل في جلب البيانات");
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
  }, []);

  return (
    <div className="home-container">
      {/* عنوان الصفحة */}
      <h2>
        Best Matched <span>Jobs</span>
      </h2>

      {/* رسالة تحميل */}
      {loading && <div className="loading-message">جاري تحميل الوظائف...</div>}

      {/* رسالة خطأ */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* إذا ما في بيانات بعد الانتهاء من التحميل */}
      {!loading && !error && jobs.length === 0 && (
        <div className="no-jobs-message">لا توجد وظائف متاحة حالياً</div>
      )}

      {/* شبكة عرض الوظائف - تعرض فقط إذا في بيانات */}
      {!loading && !error && jobs.length > 0 && (
        <div className="job-grid">
          {jobs.map((job, index) => (
            <Link
              to={`/job/${job.id}`} // تغيير المسار حسب مسار الـ JobDetails الخاص بك
              key={job.id}
              style={{ textDecoration: "none", color: "inherit" }}
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