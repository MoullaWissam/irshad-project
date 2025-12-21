import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AddJop.css";
import InputField from "./InputField";

export default function AddJob() {
  const navigate = useNavigate();
  const [showQuestions, setShowQuestions] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [employmentType, setEmploymentType] = useState("on-site");
  const fileInputRef = useRef(null);

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

  // مراقبة تغيير testDuration للتصحيح - يجب أن يكون بعد تعريف jobData
  useEffect(() => {
    console.log("testDuration updated to:", jobData.testDuration);
    console.log("testDuration type:", typeof jobData.testDuration);
  }, [jobData.testDuration]);

  // جلب companyId من localStorage عند تحميل المكون
  useEffect(() => {
    const savedCompanyData = localStorage.getItem('companyData');
    if (savedCompanyData) {
      try {
        const companyData = JSON.parse(savedCompanyData);
        if (companyData.id) {
          setCompanyId(companyData.id);
          console.log("Company ID loaded from localStorage:", companyData.id);
        }
      } catch (error) {
        console.error("Error parsing company data:", error);
      }
    }
  }, []);

  // التحقق من أن المستخدم هو شركة
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'company') {
      navigate('/login');
      return;
    }
    
    if (!companyId) {
      setMessage({
        type: "error",
        text: "❌ Please login as a company to add jobs"
      });
    }
  }, [companyId, navigate]);

  // إخفاء تلقائي بعد 3 ثواني
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};
    
    if (!jobData.title.trim()) newErrors.title = "Job Title is required";
    if (!jobData.skills.trim()) newErrors.skills = "Required Skills is required";
    if (!jobData.experience.trim()) newErrors.experience = "Required Experience is required";
    if (!jobData.education.trim()) newErrors.education = "Required Education is required";
    if (!jobData.description.trim()) newErrors.description = "Job Description is required";
    if (!jobData.location.trim()) newErrors.location = "Location is required";
    
    // التحقق من أن requiredExperience هو رقم
    if (jobData.experience.trim()) {
      const experienceNum = parseFloat(jobData.experience);
      if (isNaN(experienceNum)) {
        newErrors.experience = "Required Experience must be a number";
      }
    }
    
    if (showQuestions) {
      jobData.questions.forEach((question, index) => {
        if (!question.text.trim()) {
          newErrors[`question_${index}`] = `Question ${index + 1} is required`;
        }
        if (!question.correctAnswer.trim()) {
          newErrors[`correct_${index}`] = `Correct answer for Question ${index + 1} is required`;
        }
        const hasWrongAnswer = question.wrongAnswers.some(answer => answer.trim() !== "");
        if (!hasWrongAnswer) {
          newErrors[`wrong_${index}`] = `At least one wrong answer is required for Question ${index + 1}`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
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
    setEmploymentType("on-site");
    setShowQuestions(false);
    setCurrentQuestionIndex(0);
    setErrors({});
  };

  // معالجة رفع الملف
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "❌ Please upload an image file" });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
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
    
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
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

  // دالة لتقسيم النص إلى مصفوفة
  const splitToArray = (text) => {
    if (!text || text.trim() === '') return [];
    return text
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // إرسال النموذج إلى الباك اند
  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "⚠️ Please fill all required fields correctly"
      });
      return;
    }

    // التحقق من وجود companyId
    if (!companyId) {
      setMessage({
        type: "error",
        text: "❌ Company information not found. Please login again as a company."
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. إنشاء الوظيفة (Job)
      const jobFormData = new FormData();
      jobFormData.append('title', jobData.title);
      
      // تقسيم skills إلى مصفوفة
      const skillsArray = splitToArray(jobData.skills);
      jobFormData.append('requiredSkills', JSON.stringify(skillsArray));
      
      // تحويل experience إلى رقم
      const experienceNum = parseFloat(jobData.experience) || 0;
      jobFormData.append('requiredExperience', experienceNum.toString());
      
      // تقسيم education إلى مصفوفة
      const educationArray = splitToArray(jobData.education);
      jobFormData.append('requiredEducation', JSON.stringify(educationArray));
      
      jobFormData.append('description', jobData.description);
      jobFormData.append('location', jobData.location);
      jobFormData.append('employmentType', employmentType);
      
      // أضف testDuration كما هي - لا تحولها لشيء
      jobFormData.append('testDuration', jobData.testDuration);
      
      // إضافة الصورة باسم "image" بدلاً من "logo"
      if (jobData.logoFile) {
        jobFormData.append('img', jobData.logoFile);
      }

      // Debug: عرض محتويات FormData
      console.log('=== SENDING JOB DATA ===');
      console.log('Current testDuration value:', jobData.testDuration);
      console.log('Current testDuration type:', typeof jobData.testDuration);
      
      // عرض جميع محتويات FormData
      for (let pair of jobFormData.entries()) {
        console.log(pair[0] + ':', pair[1], '(type:', typeof pair[1] + ')');
      }

      // إرسال طلب إنشاء الوظيفة - مع الكوكيز
      const createJobResponse = await fetch(`http://localhost:3000/jobs/${companyId}`, {
        method: 'POST',
        credentials: 'include',
        body: jobFormData,
      });

      if (!createJobResponse.ok) {
        const errorText = await createJobResponse.text();
        console.error('Create job error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Failed to create job');
        } catch {
          throw new Error('Failed to create job. Please try again.');
        }
      }

      const jobResult = await createJobResponse.json();
      console.log('=== JOB CREATION RESPONSE ===');
      console.log('Job creation response:', jobResult);
      console.log('Saved testDuration from job response:', jobResult.testDuration);
      console.log('Saved testDuration type:', typeof jobResult.testDuration);
      
      const jobId = jobResult.id || jobResult.jobId;

      if (!jobId) {
        throw new Error('Job ID not received from server');
      }

      console.log('✅ Job created successfully with ID:', jobId);

      // 2. إضافة الأسئلة إذا كانت موجودة
      if (showQuestions) {
        const questions = jobData.questions.filter(q => q.text.trim() !== "");
        
        console.log(`Adding ${questions.length} questions to job ${jobId}`);
        console.log('Using testDuration for questions:', jobData.testDuration);
        
        for (const [index, question] of questions.entries()) {
          const questionPayload = {
            questionText: question.text,
            options: [
              {
                text: question.correctAnswer,
                isCorrect: true
              },
              ...question.wrongAnswers
                .filter(w => w.trim() !== "")
                .map(w => ({
                  text: w,
                  isCorrect: false
                }))
            ],
            // أرسل testDuration كما هي
            testDuration: jobData.testDuration
          };

          console.log(`=== SENDING QUESTION ${index + 1} ===`);
          console.log('Question payload:', questionPayload);
          console.log('Test duration being sent:', jobData.testDuration);

          // إرسال طلب إضافة السؤال
          const addQuestionResponse = await fetch(`http://localhost:3000/jobs/${jobId}/questions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(questionPayload),
          });

          if (!addQuestionResponse.ok) {
            const errorText = await addQuestionResponse.text();
            console.error(`❌ Failed to add question ${index + 1}:`, errorText);
            
            try {
              const errorData = JSON.parse(errorText);
              console.error(`Error details:`, errorData);
            } catch {
              console.error('Raw error text:', errorText);
            }
            
            throw new Error(`Failed to add question ${index + 1}`);
          }

          const questionResult = await addQuestionResponse.json();
          console.log(`✅ SUCCESS - Question ${index + 1} added successfully!`);
          console.log('Question response:', questionResult);
          
          if (questionResult.testDuration !== undefined) {
            console.log(`Updated testDuration from question ${index + 1}:`, questionResult.testDuration);
          }
        }
        
        console.log('✅ ALL QUESTIONS ADDED SUCCESSFULLY');
      }

      setMessage({ 
        type: "success", 
        text: "✅ Job and questions submitted successfully!" 
      });
      
      setTimeout(() => {
        resetForm();
        setIsSubmitting(false);
        console.log('✅ Form reset completed');
      }, 2000);
      
    } catch (err) {
      console.error('❌ SUBMISSION ERROR:', err);
      setMessage({
        type: "error",
        text: `❌ ${err.message || 'Failed to submit. Please try again.'}`
      });
      setIsSubmitting(false);
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
            placeholder="Enter required skills separated by commas (e.g., JavaScript, React, Node.js)"
            required
          />
          
          <InputField
            label="Required Experience (years)"
            type="number"
            step="0.5"
            value={jobData.experience}
            onChange={(e) => {
              setJobData({ ...jobData, experience: e.target.value });
              if (errors.experience) setErrors({ ...errors, experience: null });
            }}
            error={errors.experience}
            placeholder="Enter required experience in years (e.g., 2.5)"
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
            placeholder="Enter required education separated by commas (e.g., Bachelor Degree, Master Degree)"
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

          {/* Employment Type Selection */}
          <div className="ajp-employment-section">
            <label className="ajp-employment-label">Employment Type</label>
            <div className="ajp-employment-options">
              <label className="ajp-employment-option">
                <input
                  type="radio"
                  name="employmentType"
                  value="part-time"
                  checked={employmentType === "part-time"}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="ajp-employment-radio"
                />
                <span className="ajp-employment-text">Part-time</span>
              </label>
              
              <label className="ajp-employment-option">
                <input
                  type="radio"
                  name="employmentType"
                  value="full-time"
                  checked={employmentType === "full-time"}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="ajp-employment-radio"
                />
                <span className="ajp-employment-text">Full-time</span>
              </label>
              
              <label className="ajp-employment-option">
                <input
                  type="radio"
                  name="employmentType"
                  value="on-site"
                  checked={employmentType === "on-site"}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="ajp-employment-radio"
                />
                <span className="ajp-employment-text">On-site</span>
              </label>
              
              <label className="ajp-employment-option">
                <input
                  type="radio"
                  name="employmentType"
                  value="remote"
                  checked={employmentType === "remote"}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="ajp-employment-radio"
                />
                <span className="ajp-employment-text">Remote</span>
              </label>
            </div>
          </div>

          {/* Upload Company Logo */}
          <div className="ajp-upload-section">
            <label className="ajp-upload-label">Upload Company Logo/Image</label>
            <div 
              className="ajp-upload-box"
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: 'pointer' }}
            >
              {jobData.logoPreview ? (
                <div className="ajp-logo-preview">
                  <img 
                    src={jobData.logoPreview} 
                    alt="Company logo preview" 
                    className="ajp-logo-image"
                  />
                  <span className="ajp-change-text">Change image</span>
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
              style={{ cursor: 'pointer' }}
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
                      value="5"
                      checked={jobData.testDuration === 5}
                      onChange={() => {
                        console.log("Setting testDuration to 5");
                        setJobData(prev => ({
                          ...prev,
                          testDuration: 5
                        }));
                      }}
                      className="ajp-time-radio"
                    />
                    <span className="ajp-time-text">5 minutes</span>
                  </label>
                  
                  <label className="ajp-time-option">
                    <input
                      type="radio"
                      name="testDuration"
                      value="7"
                      checked={jobData.testDuration === 7}
                      onChange={() => {
                        console.log("Setting testDuration to 7");
                        setJobData(prev => ({
                          ...prev,
                          testDuration: 7
                        }));
                      }}
                      className="ajp-time-radio"
                    />
                    <span className="ajp-time-text">7 minutes</span>
                  </label>
                </div>
                
                {/* Display current value for debugging */}
                <div className="ajp-debug-info">
                  <small>Current testDuration: {jobData.testDuration} (type: {typeof jobData.testDuration})</small>
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

            <button 
              className="ajp-submit-btn" 
              onClick={handleSubmit}
              disabled={isSubmitting || !companyId}
            >
              {isSubmitting ? (
                <>
                  <span className="ajp-spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Job'
              )}
            </button>
            
            {!companyId && (
              <p className="ajp-warning-text">
                ⚠️ Please login as a company to submit jobs
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}