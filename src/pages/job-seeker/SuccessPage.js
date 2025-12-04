import React from "react";
import "./SuccessPage.css";

export default function SuccessPage() {
  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-title">Application Submitted Successfully!</h1>

        <div className="success-icon">
          <div className="check-circle">✔</div>
        </div>

        <p className="success-text">
          Thank you for applying for <span>Email Marketing</span> position at
          Innovate Corp.
        </p>

        <p className="success-subtext">
          Your application under review, and you’ll receive an update soon.
        </p>

        <div className="buttons-row">
          <button className="primary-btn">Browse More Jobs</button>
          <button className="secondary-btn">Go to My Applications</button>
        </div>

        <div className="floating-card">
          <div className="card-icon">
            <img src="" alt="company icon" />
          </div>
          <p>Emarketing</p>
        </div>
      </div>
    </div>
  );
}

/*
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  const { jobId } = useParams(); // نستقبل ID الوظيفة بعد التقديم
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Fetch job data from backend ----
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`https://your-api.com/jobs/${jobId}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  if (loading) {
    return <div className="loading">Submitting your application...</div>;
  }

  if (!job) {
    return <div className="error">Job details not found.</div>;
  }

  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-title">Application Submitted Successfully!</h1>

        <div className="success-icon">
          <div className="check-circle">✔</div>
        </div>

        <p className="success-text">
          Thank you for applying for{" "}
          <span>{job.title}</span> position at {job.companyName}.
        </p>

        <p className="success-subtext">
          Your application is under review. You will receive an update soon.
        </p>

        <div className="buttons-row">
          <button
            className="primary-btn"
            onClick={() => navigate("/jobs")}
          >
            Browse More Jobs
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/applications")}
          >
            Go to My Applications
          </button>
        </div>

        <div className="floating-card">
          <div className="card-icon">
            <img src={job.categoryIcon} alt="category icon" />
          </div>
          <p>{job.categoryName}</p>
        </div>
      </div>
    </div>
  );
}
*/
