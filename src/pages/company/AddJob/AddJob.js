import React, { useState, useEffect, useRef } from "react";
import "./AddJop.css";
import InputField from "./InputField";

export default function AddJob({ isAuthenticated, user, logout }) {
  const [showQuestions, setShowQuestions] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const fileInputRef = useRef(null);

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
    logoPreview: null,
    logoFile: null,
    testDuration: 5,
    questions: Array(4).fill().map(() => ({
      text: "",
      correctAnswer: "",
      wrongAnswers: ["", "", ""]
    }))
  });

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};
    
    // الحقول الأساسية
    if (!jobData.title.trim()) newErrors.title = "Job Title is required";
    if (!jobData.skills.trim()) newErrors.skills = "Required Skills is required";
    if (!jobData.experience.trim()) newErrors.experience = "Required Experience is required";
    if (!jobData.education.trim()) newErrors.education = "Required Education is required";
    if (!jobData.description.trim()) newErrors.description = "Job Description is required";
    if (!jobData.location.trim()) newErrors.location = "Location is required";
    
    // التحقق من الأسئلة إذا كانت مُضافة
    if (showQuestions) {
      jobData.questions.forEach((question, index) => {
        if (!question.text.trim()) {
          newErrors[`question_${index}`] = `Question ${index + 1} is required`;
        }
        if (!question.correctAnswer.trim()) {
          newErrors[`correct_${index}`] = `Correct answer for Question ${index + 1} is required`;
        }
        // التحقق من إجابة خاطئة واحدة على الأقل
        const hasWrongAnswer = question.wrongAnswers.some(answer => answer.trim() !== "");
        if (!hasWrongAnswer) {
          newErrors[`wrong_${index}`] = `At least one wrong answer is required for Question ${index + 1}`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة رفع الملف
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "❌ Please upload an image file" });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setMessage({ type: "error", text: "❌ File size should be less than 5MB" });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setJobData({
          ...jobData,
          logoPreview: event.target.result,
          logoFile: file
        });
        setMessage({ type: "success", text: "✅ Logo uploaded successfully!" });
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة تغيير السؤال
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...jobData.questions];
    
    if (field === 'text') {
      updatedQuestions[index].text = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = value;
    } else if (field.startsWith('wrong_')) {
      const wrongIndex = parseInt(field.split('_')[1]);
      updatedQuestions[index].wrongAnswers[wrongIndex] = value;
    }
    
    setJobData({ ...jobData, questions: updatedQuestions });
    
    // إزالة خطأ الحقل إذا تم تصحيحه
    if (errors[`${field}_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}_${index}`];
      setErrors(newErrors);
    }
  };

  // التنقل بين الأسئلة
  const goToNextQuestion = () => {
    if (currentQuestionIndex < jobData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // إضافة السؤال
  const handleAddQuestion = () => {
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
  };

  // إرسال النموذج
  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "⚠️ Please fill all required fields correctly"
      });
      return;
    }

    // بناء البيانات للإرسال
    const payload = {
      jobTitle: jobData.title,
      skills: jobData.skills,
      experience: jobData.experience,
      education: jobData.education,
      description: jobData.description,
      location: jobData.location,
      logoFile: jobData.logoFile ? jobData.logoFile.name : null,
      testEnabled: showQuestions,
      testDuration: jobData.testDuration,
      questions: showQuestions ? jobData.questions.filter(q => q.text.trim() !== "") : []
    };

    try {
      // محاكاة الإرسال إلى API
      console.log("Submitting job data:", payload);
      
      // محاكاة استجابة API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: "success", text: "✅ Job submitted successfully!" });
      
      // إعادة تعيين النموذج بعد 2 ثانية
      setTimeout(() => {
        setJobData({
          title: "",
          skills: "",
          experience: "",
          education: "",
          description: "",
          location: "",
          logoPreview: null,
          logoFile: null,
          testDuration: 5,
          questions: Array(4).fill().map(() => ({
            text: "",
            correctAnswer: "",
            wrongAnswers: ["", "", ""]
          }))
        });
        setShowQuestions(false);
        setCurrentQuestionIndex(0);
        setErrors({});
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "❌ Failed to submit. Please try again."
      });
    }
  };

  return (
    <div className="ajp-container">
      <h1 className="ajp-page-title">Add new Job application</h1>

      <div className="ajp-form-wrapper">
        {/* LEFT SIDE FORM */}
        <div className="ajp-left-section">
          <InputField
            label="Job Title"
            type="text"
            value={jobData.title}
            onChange={(e) => {
              setJobData({ ...jobData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            error={errors.title}
            placeholder="Enter job title"
            required
          />
          
          <InputField
            label="Required Skills"
            type="text"
            value={jobData.skills}
            onChange={(e) => {
              setJobData({ ...jobData, skills: e.target.value });
              if (errors.skills) setErrors({ ...errors, skills: null });
            }}
            error={errors.skills}
            placeholder="Enter required skills"
            required
          />
          
          <InputField
            label="Required Experience"
            type="text"
            value={jobData.experience}
            onChange={(e) => {
              setJobData({ ...jobData, experience: e.target.value });
              if (errors.experience) setErrors({ ...errors, experience: null });
            }}
            error={errors.experience}
            placeholder="Enter required experience"
            required
          />
          
          <InputField
            label="Required Education"
            type="text"
            value={jobData.education}
            onChange={(e) => {
              setJobData({ ...jobData, education: e.target.value });
              if (errors.education) setErrors({ ...errors, education: null });
            }}
            error={errors.education}
            placeholder="Enter required education"
            required
          />
          
          <InputField
            label="Job Description"
            type="text"
            value={jobData.description}
            onChange={(e) => {
              setJobData({ ...jobData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: null });
            }}
            error={errors.description}
            placeholder="Enter job description"
            required
          />
          
          <InputField
            label="Location"
            type="text"
            value={jobData.location}
            onChange={(e) => {
              setJobData({ ...jobData, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: null });
            }}
            error={errors.location}
            placeholder="Enter job location"
            required
          />

          {/* Upload Company Logo */}
          <div className="ajp-upload-section">
            <label className="ajp-upload-label">Upload Company Logo</label>
            <div 
              className="ajp-upload-box"
              onClick={() => fileInputRef.current.click()}
            >
              {jobData.logoPreview ? (
                <div className="ajp-logo-preview">
                  <img 
                    src={jobData.logoPreview} 
                    alt="Company logo preview" 
                    className="ajp-logo-image"
                  />
                  <span className="ajp-change-text">Change logo</span>
                </div>
              ) : (
                <>
                  <span className="ajp-upload-icon">📁</span>
                  <span className="ajp-upload-text">Click to upload</span>
                  <small className="ajp-upload-hint">PNG, JPG up to 5MB</small>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE SCREENING TEST */}
        <div className="ajp-right-section">
          <h3 className="ajp-section-title">
            Screening Test <span className="ajp-optional-text">(Optional)</span>
          </h3>

          {!showQuestions ? (
            <div 
              className="ajp-add-test-box"
              onClick={handleAddQuestion}
            >
              <span className="ajp-plus-icon">+</span>
              <p className="ajp-add-test-text">Add Screening Test</p>
            </div>
          ) : (
            <>
              {/* Questions Slider */}
              <div className="ajp-questions-slider">
                <div className="ajp-question-indicator">
                  Question {currentQuestionIndex + 1} of {jobData.questions.length}
                </div>
                
                <div className="ajp-question-slide">
                  <div className="ajp-question-block">
                    <div className="ajp-question-input">
                      <input
                        type="text"
                        value={jobData.questions[currentQuestionIndex].text}
                        onChange={(e) => handleQuestionChange(currentQuestionIndex, 'text', e.target.value)}
                        placeholder="Enter question text"
                        className={errors[`question_${currentQuestionIndex}`] ? 'ajp-input-error' : ''}
                      />
                      {errors[`question_${currentQuestionIndex}`] && (
                        <span className="ajp-field-error">{errors[`question_${currentQuestionIndex}`]}</span>
                      )}
                    </div>
                    
                    <div className="ajp-choices-section">
                      <p className="ajp-choices-label">Choices:</p>
                      
                      {/* Correct Answer */}
                      <div className="ajp-answer-input ajp-correct-answer">
                        <input
                          type="text"
                          value={jobData.questions[currentQuestionIndex].correctAnswer}
                          onChange={(e) => handleQuestionChange(currentQuestionIndex, 'correctAnswer', e.target.value)}
                          placeholder="Enter correct answer here"
                          className={errors[`correct_${currentQuestionIndex}`] ? 'ajp-input-error' : ''}
                        />
                        {errors[`correct_${currentQuestionIndex}`] && (
                          <span className="ajp-field-error">{errors[`correct_${currentQuestionIndex}`]}</span>
                        )}
                      </div>
                      
                      {/* Wrong Answers */}
                      {jobData.questions[currentQuestionIndex].wrongAnswers.map((wrongAnswer, wrongIndex) => (
                        <div key={wrongIndex} className="ajp-answer-input">
                          <input
                            type="text"
                            value={wrongAnswer}
                            onChange={(e) => handleQuestionChange(currentQuestionIndex, `wrong_${wrongIndex}`, e.target.value)}
                            placeholder="Enter wrong answer here"
                          />
                        </div>
                      ))}
                      
                      {errors[`wrong_${currentQuestionIndex}`] && (
                        <span className="ajp-field-error ajp-wrong-error">{errors[`wrong_${currentQuestionIndex}`]}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="ajp-slider-controls">
                  <button 
                    className="ajp-slider-btn ajp-prev-btn"
                    onClick={goToPrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    ← Previous
                  </button>
                  
                  <div className="ajp-slider-dots">
                    {jobData.questions.map((_, index) => (
                      <button
                        key={index}
                        className={`ajp-slider-dot ${index === currentQuestionIndex ? 'ajp-slider-dot-active' : ''}`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="ajp-slider-btn ajp-next-btn"
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === jobData.questions.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Time Selection */}
              <div className="ajp-time-selection">
                <p className="ajp-time-label">Select test time limit:</p>
                <div className="ajp-time-options">
                  <label className="ajp-time-option">
                    <input
                      type="radio"
                      name="testDuration"
                      value={5}
                      checked={jobData.testDuration === 5}
                      onChange={(e) => setJobData({...jobData, testDuration: parseInt(e.target.value)})}
                      className="ajp-time-radio"
                    />
                    <span className="ajp-time-text">5 minutes</span>
                  </label>
                  
                  <label className="ajp-time-option">
                    <input
                      type="radio"
                      name="testDuration"
                      value={7}
                      checked={jobData.testDuration === 7}
                      onChange={(e) => setJobData({...jobData, testDuration: parseInt(e.target.value)})}
                      className="ajp-time-radio"
                    />
                    <span className="ajp-time-text">7 minutes</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <div className="ajp-submit-section">
            {message.text && (
              <div className={`ajp-toast ajp-toast-${message.type} ajp-toast-show`}>
                {message.text}
              </div>
            )}

            <button className="ajp-submit-btn" onClick={handleSubmit}>
              Submit Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}