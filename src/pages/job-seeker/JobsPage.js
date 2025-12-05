// pages/job-seeker/JobsPage.js
import React, { useState, useEffect } from "react";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./JobsPage.css";
import searchIcon from "../../assets/icons/search.png";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // بيانات الوظائف الافتراضية (يمكن استبدالها بطلب API)
  const defaultJobsData = [
    {
      id: 1,
      title: "Email Marketing",
      type: "FULL TIME",
      desc: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
      icon: "/icons/email.png",
    },
    {
      id: 2,
      title: "Visual Designer",
      type: "FULL TIME",
      desc: "Design stunning visuals and elevate our brand identity across platforms.",
      icon: "/icons/design.png",
    },
    {
      id: 3,
      title: "Data Analyst",
      type: "FULL TIME",
      desc: "Analyze data trends and support decision-making with actionable insights.",
      icon: "/icons/data.png",
    },
    {
      id: 4,
      title: "Product Designer",
      type: "FULL TIME",
      desc: "Craft intuitive product experiences and collaborate with cross-functional teams.",
      icon: "/icons/product.png",
    },
    {
      id: 5,
      title: "PHP/JS Developer",
      type: "FULL TIME",
      desc: "Build scalable web applications using modern PHP and JavaScript frameworks.",
      icon: "/icons/code.png",
    },
    {
      id: 6,
      title: "Plugin Developer",
      type: "FULL TIME",
      desc: "Develop and maintain plugins for our CMS ecosystem.",
      icon: "/icons/plugin.png",
    },
  ];

  useEffect(() => {
    // محاكاة جلب البيانات من API
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // في التطبيق الحقيقي، استبدل هذا بطلب API
        // const response = await fetch("API_ENDPOINT");
        // const data = await response.json();
        
        // استخدام البيانات الافتراضية مؤقتاً
        setTimeout(() => {
          setJobs(defaultJobsData);
          setFilteredJobs(defaultJobsData);
          setLoading(false);
        }, 500); // تأخير محاكاة للشبكة
      } catch (err) {
        setError("فشل في جلب بيانات الوظائف");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // دالة للبحث عن الوظائف
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  // تفعيل البحث عند الضغط على Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="jobs-page-container">
      {/* عنوان الصفحة - مطابق لتصميم Home */}
      <h2 className="jobs-page-title">
        Search for <span className="jobs-page-title-span">Jobs</span>
      </h2>

      {/* مربع البحث */}
      <div className="jobs-page-search-box">
        <input
          type="text"
          className="jobs-page-search-input"
          placeholder="Search for Jobs by title, description or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="jobs-page-search-button"
          onClick={handleSearch}
          aria-label="Search jobs"
        >
          <img src={searchIcon} alt="Search" className="jobs-page-search-icon-img" />
        </button>
      </div>

      {/* رسالة تحميل */}
      {loading && <div className="jobs-page-loading-message">جاري تحميل الوظائف...</div>}

      {/* رسالة خطأ */}
      {error && <div className="jobs-page-error-message">⚠️ {error}</div>}

      {/* إذا ما في بيانات بعد الانتهاء من التحميل */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="jobs-page-no-jobs-message">
          {searchTerm ? "لم يتم العثور على وظائف تطابق بحثك" : "لا توجد وظائف متاحة حالياً"}
        </div>
      )}

      {/* شبكة عرض الوظائف - تعرض فقط إذا في بيانات */}
      {!loading && !error && filteredJobs.length > 0 && (
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
      )}
    </div>
  );
}

export default JobsPage;