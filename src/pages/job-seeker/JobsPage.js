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

  // Fetch data from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/jobs", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format data to match JobCard
      const formattedJobs = data.map(job => ({
        id: job.id || Date.now() + Math.random(), // Ensure id exists
        title: job.title || "Untitled Job",
        type: job.employmentType ? job.employmentType.toUpperCase() : "FULL TIME",
        desc: job.description || "No description available",
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        // Store original data for search
        originalJob: job
      }));
      
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
      setLoading(false);
      
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs data");
      setLoading(false);
      
      toast.error("❌ Failed to load jobs data", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Local search
  const handleLocalSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.originalJob?.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.originalJob?.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.originalJob?.requiredSkills?.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
      setFilteredJobs(filtered);
    }
  };

  // API search
  const handleApiSearch = async () => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
      return;
    }

    try {
      setLoading(true);
      // Search by title first
      const response = await fetch(
        `http://localhost:3000/jobs/search?title=${encodeURIComponent(searchTerm)}`,
        { credentials: "include" }
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format data for display
      const formattedJobs = data.map(job => ({
        id: job.id || Date.now() + Math.random(),
        title: job.title || "Untitled Job",
        type: job.employmentType ? job.employmentType.toUpperCase() : "FULL TIME",
        desc: job.description || "No description available",
        icon: job.image || "https://cdn-icons-png.flaticon.com/512/3067/3067256.png",
        originalJob: job
      }));
      
      setFilteredJobs(formattedJobs);
      setLoading(false);
      
      if (formattedJobs.length === 0) {
        toast.info("🔍 No matching results found", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success(`✅ Found ${formattedJobs.length} result(s)`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
    } catch (err) {
      console.error("Search API error:", err);
      
      // Use local search if API fails
      toast.warning("⚠️ Server search failed, using local search", {
        position: "top-right",
        autoClose: 3000,
      });
      
      handleLocalSearch();
      setLoading(false);
    }
  };

  // Main search function
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      handleLocalSearch();
    } else {
      handleApiSearch();
    }
  };

  // Search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Reload data
  const handleReload = () => {
    fetchJobs();
    setSearchTerm("");
    toast.info("🔄 Refreshing data...", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  return (
    <div className="jobs-page-container">
      <ToastContainer />
      
      {/* Page header */}
      <div className="jobs-page-header">
        <h2 className="jobs-page-title">
          Search for <span className="jobs-page-title-span">Jobs</span>
        </h2>
      </div>

      {/* Search box */}
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

      {/* Search info */}
      {searchTerm && !loading && (
        <div className="jobs-page-search-info">
          <span className="search-term">Search for: "{searchTerm}"</span>
          <span className="results-count">({filteredJobs.length} results)</span>
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div className="jobs-page-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading jobs...</p>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="jobs-page-error">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={fetchJobs}>
            Try Again
          </button>
        </div>
      )}

      {/* No data message */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="jobs-page-no-jobs">
          <div className="no-jobs-icon">📭</div>
          <p className="no-jobs-text">
            {searchTerm 
              ? "No jobs found matching your search" 
              : "No jobs available at the moment"}
          </p>
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                setFilteredJobs(jobs);
              }}
            >
              Clear search and show all jobs
            </button>
          )}
        </div>
      )}

      {/* Jobs grid */}
      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="jobs-page-job-grid">
            {filteredJobs.map((job) => {
              
              // Add validation to ensure job has id
              if (!job || !job.id) {
                console.warn("Invalid job data:", job);
                return null;
              }
              
              return (
                <JobCard
                  id={job.id}
                  icon={job.icon}
                  title={job.title}
                  desc={job.desc}
                  type={job.type}
                />
              );
            })}
          </div>
          
          {/* Results footer */}
          <div className="jobs-page-results-footer">
            <p>Showing {filteredJobs.length} of {jobs.length} jobs</p>
          </div>
        </>
      )}
    </div>
  );
}

export default JobsPage;