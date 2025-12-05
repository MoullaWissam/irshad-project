// import React from "react";
// import "./JobDetails.css";

// export default function JobDetails() {
//   return (
//     <div className="jobdetails-container">
//       <div className="jobdetails-content">
//         {/* Header */}
//         <div className="job-header">
//           <div>
//             <h1 className="job-title">Email Marketing</h1>
//             <p className="job-meta">
//               FULL TIME <span> | </span> Location: Damascus
//             </p>
//           </div>

//           <button className="apply-btn">Apply & Start Test</button>
//         </div>

//         {/* Company Section */}
//         <div className="company-box">
//           <div className="company-icon">
//             {" "}
//             <img src="" alt="company icon" />
//           </div>
//           <h3>Company Name</h3>
//         </div>

//         {/* Sections */}
//         <div className="job-section">
//           <h4>Job Description</h4>
//           <p>
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             ddddddddddddddddddddddddddddddddddddd
//           </p>
//         </div>

//         <div className="job-section">
//           <h4>Required Skills</h4>
//           <p>
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             ddddddddddddddddddddddddddddddddddddd
//           </p>
//         </div>

//         <div className="job-section">
//           <h4>Required Experience</h4>
//           <p>
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             ddddddddddddddddddddddddddddddddddddd
//           </p>
//         </div>

//         <div className="job-section">
//           <h4>Required Education</h4>
//           <p>
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//             dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import "./JobDetails.css";

// // export default function JobDetails() {
// //   const { jobId } = useParams(); // استلام ID الوظيفة من الرابط
// //   const [job, setJob] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // جلب البيانات من الباك
// //   useEffect(() => {
// //     const fetchJob = async () => {
// //       try {
// //         const response = await fetch(`https://your-api.com/jobs/${jobId}`);
// //         const data = await response.json();
// //         setJob(data);
// //       } catch (error) {
// //         console.error("Failed to load job:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchJob();
// //   }, [jobId]);

// //   if (loading) {
// //     return <div className="loading">Loading job details...</div>;
// //   }

// //   if (!job) {
// //     return <div className="error">Job not found.</div>;
// //   }

// //   return (
// //     <div className="jobdetails-container">
// //       <div className="jobdetails-content">
// //         {/* Header */}
// //         <div className="job-header">
// //           <div>
// //             <h1 className="job-title">{job.title}</h1>

// //             <p className="job-meta">
// //               {job.type?.toUpperCase()} <span> | </span> Location:{" "}
// //               {job.location}
// //             </p>
// //           </div>

// //           <button className="apply-btn">Apply & Start Test</button>
// //         </div>

// //         {/* Company Section */}
// //         <div className="company-box">
// //           <div className="company-icon">
// //             {" "}
// //             <img src="" alt="company icon" />
// //           </div>
// //           <h3>{job.companyName}</h3>
// //         </div>

// //         {/* Job Description */}
// //         <div className="job-section">
// //           <h4>Job Description</h4>
// //           <p>{job.description}</p>
// //         </div>

// //         {/* Required Skills */}
// //         <div className="job-section">
// //           <h4>Required Skills</h4>
// //           <p>{job.skills}</p>
// //         </div>

// //         {/* Experience */}
// //         <div className="job-section">
// //           <h4>Required Experience</h4>
// //           <p>{job.experience}</p>
// //         </div>

// //         {/* Education */}
// //         <div className="job-section">
// //           <h4>Required Education</h4>
// //           <p>{job.education}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // بيانات تجريبية للاختبار - يمكنك إضافة API حقيقي هنا
        const mockJobs = {
          1: {
            title: "Email Marketing",
            type: "FULL TIME",
            location: "Damascus",
            companyName: "Company Name",
            description: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            skills: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            experience: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            education: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
          },
          2: {
            title: "Frontend Developer",
            type: "FULL TIME",
            location: "Remote",
            companyName: "WebTech Co.",
            description: "Looking for a skilled frontend developer with React experience.",
            skills: "React, JavaScript, HTML, CSS, Git",
            experience: "3+ years in frontend development",
            education: "Computer Science or equivalent"
          }
        };
        
        const data = mockJobs[jobId] || mockJobs[1];
        setJob(data);
      } catch (error) {
        console.error("Failed to load job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  if (!job) {
    return <div className="error">Job not found.</div>;
  }

  return (
    <div className="jobdetails-container">
      <div className="jobdetails-content">
        {/* Header */}
        <div className="job-header">
          <div>
            <h1 className="job-title">{job.title}</h1>
            <p className="job-meta">
              {job.type?.toUpperCase()} <span> | </span> Location: {job.location}
            </p>
          </div>

          <button className="apply-btn">Apply & Start Test</button>
        </div>

        {/* Company Section */}
        <div className="company-box">
          <div className="company-icon">
            <img src="" alt="company icon" />
          </div>
          <h3>{job.companyName}</h3>
        </div>

        {/* Sections */}
        <div className="job-section">
          <h4>Job Description</h4>
          <p>{job.description}</p>
        </div>

        <div className="job-section">
          <h4>Required Skills</h4>
          <p>{job.skills}</p>
        </div>

        <div className="job-section">
          <h4>Required Experience</h4>
          <p>{job.experience}</p>
        </div>

        <div className="job-section">
          <h4>Required Education</h4>
          <p>{job.education}</p>
        </div>
      </div>
    </div>
  );
}