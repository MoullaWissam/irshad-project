import React, { useState, useEffect } from "react";
import JobCard from "../../Components/Card/JobCard/JobCard";
import "./JobsPage.css";
import searchIcon from "../../assets/icons/search.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/jobs", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(t("Failed to fetch data: {status}", { status: response.status }));
      }
      
      const data = await response.json();
      
      const formattedJobs = data.map(job => ({
        id: job.id || Date.now() + Math.random(),
        title: job.title || t("Untitled Job"),
        type: job.employmentType ? job.employmentType.toUpperCase() : t("FULL TIME"),
        desc: job.description || t("No description available"),
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        company: String(job.companyName || (job.company && job.company.companyName) || t("Unknown Company")),
        location: String(job.location || t("Location not specified")),
        salary: String(job.salary || t("Salary not specified")),
        skills: job.skills || (job.requiredSkills && (Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : String(job.requiredSkills))) || t("Not specified"),
        experience: String(job.experience || job.requiredExperience || t("Not specified")),
        education: String(job.education || job.requiredEducation || t("Not specified")),
        originalJob: job
      }));
      
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
      setLoading(false);
      
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(t("Failed to load jobs data"));
      setLoading(false);
      
      toast.error("❌ " + t("Failed to load jobs data"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL
      });
    }
  };

  const handleLocalSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.originalJob?.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.originalJob?.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.originalJob?.requiredSkills?.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
      setFilteredJobs(filtered);
    }
  };

  const handleApiSearch = async () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/jobs/search?title=${encodeURIComponent(searchTerm)}`,
        { credentials: "include" }
      );
      
      if (!response.ok) {
        throw new Error(t("Search failed: {status}", { status: response.status }));
      }
      
      const data = await response.json();
      
      const formattedJobs = data.map(job => ({
        id: job.id || Date.now() + Math.random(),
        title: job.title || t("Untitled Job"),
        type: job.employmentType ? job.employmentType.toUpperCase() : t("FULL TIME"),
        desc: job.description || t("No description available"),
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        company: job.companyName || (job.company && job.company.companyName) || t("Unknown Company"),
        location: job.location || t("Location not specified"),
        salary: job.salary || t("Salary not specified"),
        skills: job.skills || (job.requiredSkills && job.requiredSkills.join(', ')) || t("Not specified"),
        experience: job.experience || job.requiredExperience || t("Not specified"),
        education: job.education || job.requiredEducation || t("Not specified"),
        originalJob: job
      }));
      
      setFilteredJobs(formattedJobs);
      setLoading(false);
      
      if (formattedJobs.length === 0) {
        toast.info("🔍 " + t("No matching results found"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 3000,
          rtl: isRTL
        });
      } else {
        toast.success(`✅ ${t("Found {count} result(s)", { count: formattedJobs.length })}`, {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 2000,
          rtl: isRTL
        });
      }
      
    } catch (err) {
      console.error("Search API error:", err);
      
      toast.warning("⚠️ " + t("Server search failed, using local search"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 3000,
        rtl: isRTL
      });
      
      handleLocalSearch();
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      handleLocalSearch();
    } else {
      handleApiSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReload = () => {
    fetchJobs();
    setSearchTerm("");
    toast.info("🔄 " + t("Refreshing data..."), {
      position: isRTL ? "top-left" : "top-right",
      autoClose: 1500,
      rtl: isRTL
    });
  };

  const robotoStyle = {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  };

  return (
    <div className="jobs-page-container" dir={isRTL ? 'rtl' : 'ltr'} style={robotoStyle}>
      <ToastContainer 
        position={isRTL ? "top-left" : "top-right"}
        rtl={isRTL}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      />
      
      <div className="jobs-page-header">
        <h2 className="jobs-page-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>
          {t("Search for")} <span className="jobs-page-title-span">{t("Jobs")}</span>
        </h2>
      </div>

      <div className="jobs-page-search-box">
        <div className="jobs-page-search-wrapper">
          <input
            type="text"
            className="jobs-page-search-input"
            placeholder={t("Search for Jobs by title, description, company, or skills")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            dir={isRTL ? 'rtl' : 'ltr'}
            style={robotoStyle}
          />
          <button 
            className={`jobs-page-search-button ${loading ? 'loading' : ''}`}
            onClick={handleSearch}
            disabled={loading}
            aria-label={t("Search jobs")}
          >
            {!loading && (
              <img 
                src={searchIcon} 
                alt={t("Search")}
                className="jobs-page-search-icon-img"
              />
            )}
          </button>
        </div>
      </div>

      {searchTerm && !loading && (
        <div className="jobs-page-search-info">
          <span className="search-term">{t('Search for: "{term}"', { term: searchTerm })}</span>
          <span className="results-count"> ({t("{count} results", { count: filteredJobs.length })})</span>
        </div>
      )}

      {loading && (
        <div className="jobs-page-loading">
          <div className="loading-spinner-large"></div>
          <p style={robotoStyle}>{t("Loading jobs...")}</p>
        </div>
      )}

      {error && !loading && (
        <div className="jobs-page-error">
          <div className="error-icon">⚠️</div>
          <p className="error-text" style={robotoStyle}>{error}</p>
          <button 
            className="retry-btn" 
            onClick={fetchJobs}
            style={robotoStyle}
          >
            {t("Try Again")}
          </button>
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="jobs-page-no-jobs">
          <div className="no-jobs-icon">📭</div>
          <p className="no-jobs-text" style={robotoStyle}>
            {searchTerm 
              ? t("No jobs found matching your search") 
              : t("No jobs available at the moment")}
          </p>
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setFilteredJobs(jobs);
              }}
              style={robotoStyle}
            >
              {t("Clear search and show all jobs")}
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="jobs-page-job-grid">
            {filteredJobs.map((job) => {
              if (!job || !job.id) {
                console.warn("Invalid job data:", job);
                return null;
              }
              
              return (
                <JobCard
                  key={job.id}
                  id={job.id}
                  icon={job.icon}
                  title={job.title}
                  desc={job.desc}
                  type={job.type}
                  company={job.company}
                  location={job.location}
                  salary={job.salary}
                  skills={job.skills}
                  experience={job.experience}
                  education={job.education}
                />
              );
            })}
          </div>
          

        </>
      )}
    </div>
  );
}

export default JobsPage;