// pages/job-seeker/JobsPage.js
import React, { useState, useEffect } from "react";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./JobsPage.css";
import searchIcon from "../../assets/icons/search.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  // جلب البيانات من API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/jobs");
      
      if (!response.ok) {
        throw new Error(`فشل في جلب البيانات: ${response.status}`);
      }
      
      const data = await response.json();
      
      // تحويل البيانات لتناسب JobCard
      const formattedJobs = data.map(job => ({
        id: job.id,
        title: job.title,
        type: job.employmentType ? job.employmentType.toUpperCase() : "FULL TIME",
        desc: job.description,
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        // تخزين البيانات الأصلية للبحث
        originalJob: job
      }));
      
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
      setLoading(false);
      
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("فشل في جلب بيانات الوظائف");
      setLoading(false);
      
      toast.error("❌ فشل في جلب بيانات الوظائف", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // البحث المحلي
  const handleLocalSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.originalJob.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.originalJob.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.originalJob.requiredSkills?.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
      setFilteredJobs(filtered);
    }
  };

  // البحث من API
  const handleApiSearch = async () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
      return;
    }

    try {
      setLoading(true);
      // البحث بواسطة العنوان أولاً
      const response = await fetch(
        `http://localhost:3000/jobs/search?title=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error(`فشل في البحث: ${response.status}`);
      }
      
      const data = await response.json();
      
      // تحويل البيانات للشكل المناسب
      const formattedJobs = data.map(job => ({
        id: job.id,
        title: job.title,
        type: job.employmentType ? job.employmentType.toUpperCase() : "FULL TIME",
        desc: job.description,
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        originalJob: job
      }));
      
      setFilteredJobs(formattedJobs);
      setLoading(false);
      
      if (formattedJobs.length === 0) {
        toast.info("🔍 لم يتم العثور على نتائج مطابقة", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success(`✅ تم العثور على ${formattedJobs.length} نتيجة`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
    } catch (err) {
      console.error("Search API error:", err);
      
      // استخدام البحث المحلي إذا فشل API
      toast.warning("⚠️ فشل البحث من الخادم، جاري البحث محلياً", {
        position: "top-right",
        autoClose: 3000,
      });
      
      handleLocalSearch();
      setLoading(false);
    }
  };

  // دالة البحث الرئيسية
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      handleLocalSearch();
    } else {
      handleApiSearch();
    }
  };

  // تفعيل البحث عند الضغط على Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // إعادة تحميل البيانات
  const handleReload = () => {
    fetchJobs();
    setSearchTerm("");
    toast.info("🔄 جاري تحديث البيانات...", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  return (
    <div className="jobs-page-container">
      <ToastContainer />
      
      {/* عنوان الصفحة */}
      <div className="jobs-page-header">
        <h2 className="jobs-page-title">
          Search for <span className="jobs-page-title-span">Jobs</span>
        </h2>
        
      </div>

      {/* مربع البحث */}
      <div className="jobs-page-search-box">
        <input
          type="text"
          className="jobs-page-search-input"
          placeholder="Search for Jobs by title, description or type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button 
          className="jobs-page-search-button"
          onClick={handleSearch}
          disabled={loading}
          aria-label="Search jobs"
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <img src={searchIcon} alt="Search" className="jobs-page-search-icon-img" />
          )}
        </button>
      </div>

      {/* معلومات البحث */}
      {searchTerm && !loading && (
        <div className="jobs-page-search-info">
          <span className="search-term">البحث عن: "{searchTerm}"</span>
          <span className="results-count">({filteredJobs.length} نتيجة)</span>
        </div>
      )}

      {/* رسالة تحميل */}
      {loading && (
        <div className="jobs-page-loading">
          <div className="loading-spinner-large"></div>
          <p>جاري تحميل الوظائف...</p>
        </div>
      )}

      {/* رسالة خطأ */}
      {error && !loading && (
        <div className="jobs-page-error">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={fetchJobs}>
            حاول مرة أخرى
          </button>
        </div>
      )}

      {/* إذا ما في بيانات بعد الانتهاء من التحميل */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="jobs-page-no-jobs">
          <div className="no-jobs-icon">📭</div>
          <p className="no-jobs-text">
            {searchTerm 
              ? "لم يتم العثور على وظائف تطابق بحثك" 
              : "لا توجد وظائف متاحة حالياً"}
          </p>
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setFilteredJobs(jobs);
              }}
            >
              مسح البحث وعرض جميع الوظائف
            </button>
          )}
        </div>
      )}

      {/* شبكة عرض الوظائف */}
      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="jobs-page-job-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                icon={job.icon}
                title={job.title}
                desc={job.desc}
                type={job.type}
              />
            ))}
          </div>
          
          {/* رسالة عدد النتائج في الأسفل */}
          <div className="jobs-page-results-footer">
            <p>عرض {filteredJobs.length} من أصل {jobs.length} وظيفة</p>
          </div>
        </>
      )}
    </div>
  );
}

export default JobsPage;