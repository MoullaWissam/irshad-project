import React, { useState, useEffect } from "react";
import ScreeningPopup from "./ScreeningPopup/ScreeningPopup";
import "./AddJob.css";
import InputField from "./InputField";

export default function AddJobPage() {
  const [showPopup, setShowPopup] = useState(false);

  // حالة الرسائل
  const [message, setMessage] = useState({ type: "", text: "" });

  // إخفاء تلقائي بعد 3 ثواني
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [jobData, setJobData] = useState({
    title: "",
    skills: "",
    experience: "",
    education: "",
    description: "",
    location: "",
    logoPreview: "/mnt/data/Company 3.png",
    testDuration: 6,
    questions: [],
  });

  const maxQuestions = 20;

  const handleSaveTest = ({ questions, duration }) => {
    setJobData((prev) => ({
      ...prev,
      questions,
      testDuration: duration,
    }));
    setShowPopup(false);
  };

  const handleSubmit = async () => {
    const payload = {
      jobTitle: jobData.title,
      skills: jobData.skills,
      experience: jobData.experience,
      education: jobData.education,
      description: jobData.description,
      location: jobData.location,
      testEnabled: true,
      testDuration: jobData.testDuration,
      questions: jobData.questions,
    };

    try {
      const res = await fetch("https://your-api-url.com/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Server response:", data);

      setMessage({ type: "success", text: "✅ Job submitted successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "❌ Failed to submit. Please try again.",
      });
    }
  };

  return (
    <div className="add-job-container">
      <h1 className="page-title">Add new Job application</h1>

      <div className="form-wrapper">
        {/* LEFT SIDE FORM */}
        <div className="left-section">
          <InputField
            label="Job Title"
            type="text"
            value={jobData.title}
            onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
          />
          <InputField
            label="Required Skills"
            type="text"
            value={jobData.skills}
            onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
          />
          <InputField
            label="Required Experience"
            type="text"
            value={jobData.experience}
            onChange={(e) =>
              setJobData({ ...jobData, experience: e.target.value })
            }
          />
          <InputField
            label="Required Education"
            type="text"
            value={jobData.education}
            onChange={(e) =>
              setJobData({ ...jobData, education: e.target.value })
            }
          />
          <InputField
            label="Job Description"
            type="text"
            value={jobData.description}
            onChange={(e) =>
              setJobData({ ...jobData, description: e.target.value })
            }
          />
          <InputField
            label="Location"
            type="text"
            value={jobData.location}
            onChange={(e) =>
              setJobData({ ...jobData, location: e.target.value })
            }
          />

          <div className="upload-box">
            <span style={{ marginLeft: 10 }}>Upload Company Logo</span>
          </div>
        </div>

        {/* RIGHT SIDE SCREENING TEST */}
        <div className="right-section">
          <h3>
            Screening Test <span style={{ opacity: 0.7 }}>(Optional)</span>
          </h3>

          <p style={{ marginBottom: 10 }}>
            Total Questions:{" "}
            <strong style={{ color: "#00b4ff" }}>
              {jobData.questions.length} / {maxQuestions}
            </strong>
          </p>

          <div
            className="add-test-box"
            onClick={() => {
              if (jobData.questions.length >= maxQuestions) {
                setMessage({
                  type: "error",
                  text: "⚠️ You reached max allowed questions!",
                });
                return;
              }
              setShowPopup(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="plus-icon">+</span>
          </div>

          <p style={{ marginTop: 12 }}>
            Test Duration: <strong>{jobData.testDuration} minutes</strong>
          </p>

          {/* SUBMIT BUTTON + الرسالة فوقه */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              position: "sticky",
              top: "100%",
            }}
          >
            {message.text && (
              <div className={`toast ${message.type} show`}>{message.text}</div>
            )}

            <button className="submit-btn" onClick={handleSubmit}>
              Submit Job
            </button>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <ScreeningPopup
          onClose={() => setShowPopup(false)}
          onSave={handleSaveTest}
          initialQuestions={jobData.questions}
          initialDuration={jobData.testDuration}
        />
      )}
    </div>
  );
}
