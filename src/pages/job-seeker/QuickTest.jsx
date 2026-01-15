import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./QuickTest.css";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // إضافة الترجمة
import {
  FiClock, FiCheckCircle, FiAlertCircle, FiChevronLeft,
  FiChevronRight, FiCheck, FiHelpCircle, FiAlertTriangle,
  FiPlay, FiSend, FiList, FiTarget, FiBarChart2,
  FiInfo, FiCalendar, FiMapPin, FiBriefcase,
  FiUpload, FiCheckSquare, FiArrowRight, FiBookOpen,
  FiEyeOff, FiRepeat, FiLock, FiUsers
} from "react-icons/fi";
import { 
  MdTimer, MdQuestionAnswer, MdOutlineRateReview,
  MdOutlineTipsAndUpdates, MdErrorOutline 
} from "react-icons/md";
import { 
  HiOutlineLightBulb, HiOutlineExclamationCircle 
} from "react-icons/hi";
import { 
  FaRegClock, FaRegCheckCircle, FaRegDotCircle,
  FaRegQuestionCircle, FaBrain
} from "react-icons/fa";

export default function QuickTest() {
  const { t } = useTranslation(); 
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData;
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [testDuration, setTestDuration] = useState(5);

  useEffect(() => {
    const answeredAll = questions.length > 0 && 
      questions.every(question => answers[question.id] !== undefined);
    setAllQuestionsAnswered(answeredAll);
  }, [answers, questions]);

  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted && !testCompleted) {
      handleSubmitTest();
    }
    
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, testCompleted]);

  const handleStartTest = async () => {
    setIsSubmittingApplication(true);
    try {
      const response = await fetch(`https://irshad-ovo6.onrender.com/jobapply/${jobId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Application submitted:", result);
      
      setApplicationResult(result);
      
      toast.success(t("Application submitted successfully!"), {
        position: "top-right",
        autoClose: 3000,
      });
      
      await loadQuestions();
      
      setTestStarted(true);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(` ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setError(error.message);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const loadQuestions = async () => {
    setQuestionsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://irshad-ovo6.onrender.com/jobs/${jobId}/shuffled-questions`, {
        method: "GET",
        credentials: "include"
      });
      
      console.log("Questions response:", response);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Loaded questions and duration:", data);
      
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(t("No questions available for this test."));
      }
      
      const formattedQuestions = data.questions.map(q => ({
        id: q.id,
        text: q.questionText,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text
        }))
      }));
      
      setQuestions(formattedQuestions);
      
      const duration = data.testDuration || 5;
      setTestDuration(duration);
      setTimeLeft(duration * 60);
      
    } catch (error) {
      console.error("Error loading questions:", error);
      setError(error.message);
      
      toast.error(` ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      setTestStarted(false);
      setQuestionsLoading(false);
      throw error;
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!allQuestionsAnswered) {
      toast.error(t("Please answer all questions before submitting the test."), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const answersArray = Object.keys(answers).map(questionId => ({
        questionId: parseInt(questionId),
        selectedOptionId: answers[questionId]
      }));
      
      const testData = {
        answers: answersArray,
        completedAt: new Date().toISOString(),
        duration: testDuration
      };
      
      console.log("Submitting test data:", testData);
      
      const response = await fetch(`https://irshad-ovo6.onrender.com/jobapply/${jobId}/test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(testData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const testResult = await response.json();
      console.log("Test submission result:", testResult);
      
      toast.success(t("Test submitted successfully!"), {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate(`/job/${jobId}/application-success`, {
        state: {
          testCompleted: true,
          jobData: jobData,
          applicationResult: applicationResult,
          testResult: testResult,
          testDuration: testDuration,
          testSubmitted: true
        }
      });
      
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error(` ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate(`/job/${jobId}/application-success`, {
        state: {
          testCompleted: true,
          jobData: jobData,
          applicationResult: applicationResult,
          testError: error.message
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!testStarted) {
    return (
      <div className="quick-test-container">
        <div className="test-instructions">
          <div className="test-header-card">
            <div className="header-icon">
              <FaBrain size={32} />
            </div>
            <h1 className="test-title">
              <FiTarget /> {t("Screening Assessment")}
            </h1>
            <p className="test-subtitle">{t("Demonstrate your skills and knowledge")}</p>
          </div>
          
          {jobData && (
            <div className="job-test-info">
              <div className="job-header">
                <FiBriefcase className="job-icon" />
                <div>
                  <h2>{jobData.title}</h2>
                  <div className="job-details">
                    <span><FiUsers /> {jobData.companyName}</span>
                    {jobData.location && <span><FiMapPin /> {jobData.location}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="instructions-card">
            <div className="card-header">
              <MdOutlineTipsAndUpdates className="header-icon" />
              <h3>{t("Assessment Guidelines")}</h3>
            </div>
            
            <div className="instructions-grid">
              <div className="instruction-item">
                <div className="instruction-icon time">
                  <FiClock />
                </div>
                <div>
                  <h4>{t("Time Limit")}</h4>
                  <p>{t("{{duration}} minutes total duration", { duration: testDuration })}</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon questions">
                  <FaRegQuestionCircle />
                </div>
                <div>
                  <h4>{t("Questions")}</h4>
                  <p>{t("Loaded from server automatically")}</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon completion">
                  <FiCheckCircle />
                </div>
                <div>
                  <h4>{t("Completion")}</h4>
                  <p>{t("Answer all questions to submit")}</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon no-retake">
                  <FiLock />
                </div>
                <div>
                  <h4>{t("Single Attempt")}</h4>
                  <p>{t("One-time attempt only")}</p>
                </div>
              </div>
            </div>
            
            <div className="important-notices">
              <div className="notice-header">
                <HiOutlineExclamationCircle className="notice-icon" />
                <h4>{t("Important Information")}</h4>
              </div>
              
              <div className="notice-item warning">
                <FiAlertTriangle />
                <span>{t("You will not see your test score")}</span>
              </div>
              
              <div className="notice-item critical">
                <FiLock />
                <span>{t("You cannot retake this assessment")}</span>
              </div>
              
              <div className="notice-item info">
                <FiInfo />
                <span>{t("Results are sent directly to the employer")}</span>
              </div>
            </div>
            
            <div className="process-steps">
              <h4>
                <FiPlay className="step-icon" />
                {t("What happens when you start?")}
              </h4>
              <div className="steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <span>{t("Submit your job application")}</span>
                </div>
                <FiArrowRight className="step-arrow" />
                <div className="step">
                  <span className="step-number">2</span>
                  <span>{t("Load assessment questions")}</span>
                </div>
                <FiArrowRight className="step-arrow" />
                <div className="step">
                  <span className="step-number">3</span>
                  <span>{t("Begin timed assessment")}</span>
                </div>
              </div>
              <p className="step-note">{t("This process cannot be undone")}</p>
            </div>
            
            {questionsLoading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>
                  <FiUpload className="spin-icon" />
                  {t("Loading assessment content...")}
                </p>
              </div>
            )}
            
            {error && (
              <div className="error-alert">
                <MdErrorOutline className="error-icon" />
                <div>
                  <h4>{t("Loading Error")}</h4>
                  <p>{error}</p>
                  <p>{t("Please try again or contact support.")}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              className="start-test-btn" 
              onClick={handleStartTest}
              disabled={isSubmittingApplication || questionsLoading}
            >
              {isSubmittingApplication ? (
                <>
                  <FiUpload className="btn-icon spin" />
                  {t("Submitting Application...")}
                </>
              ) : questionsLoading ? (
                <>
                  <FiUpload className="btn-icon spin" />
                  {t("Loading Assessment...")}
                </>
              ) : (
                <>
                  <FiPlay className="btn-icon" />
                  {t("Begin Assessment")}
                </>
              )}
            </button>
            
            {error && (
              <button 
                className="retry-btn"
                onClick={() => {
                  setError(null);
                  handleStartTest();
                }}
              >
                <FiRepeat className="btn-icon" />
                {t("Retry")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="quick-test-container">
        <div className="test-completed-message">
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <FiCheck className="icon" />
              </div>
            </div>
          </div>
          <h2>
            <FiCheckCircle className="success-icon" />
            {t("Assessment Submitted")}
          </h2>
          <p className="success-message">
            {t("Your assessment has been successfully submitted and will be reviewed by the hiring team.")}
          </p>
          <button 
            className="continue-btn"
            onClick={() => navigate(`/job/${jobId}/application-success`, {
              state: {
                testCompleted: true,
                jobData: jobData,
                applicationResult: applicationResult,
                testDuration: testDuration
              }
            })}
          >
            <FiArrowRight className="btn-icon" />
            {t("Continue to Results")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-test-container">
      <div className="test-header">
        <div className="header-content">
          <div className="test-title-section">
            <div className="title-icon">
              <FiTarget />
            </div>
            <div>
              <h1>{t("Screening Assessment")}</h1>
              <p className="test-subtitle">
                {t("Question {{current}} of {{total}}", { 
                  current: currentQuestionIndex + 1, 
                  total: questions.length 
                })}
              </p>
            </div>
          </div>
          
          <div className="timer-section">
            <div className="timer-card">
              <FiClock className="timer-icon" />
              <div className="timer-content">
                <span className="time-label">{t("Time Remaining")}</span>
                <span className={`time-value ${timeLeft <= 60 ? 'warning' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-info">
            <div className="progress-text">
              <FiBarChart2 className="progress-icon" />
              <span>{t("Progress: {{percentage}}%", { 
                percentage: Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
              })}</span>
            </div>
            <span className="answered-count">
              <FiCheckCircle className="answered-icon" />
              {t("{{answered}}/{{total}} answered", { 
                answered: Object.keys(answers).length, 
                total: questions.length 
              })}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <div className="question-meta">
            <span className="question-tag">
              <FaRegDotCircle className="tag-icon" />
              {t("Question {{number}}", { number: currentQuestionIndex + 1 })}
            </span>
            {answers[currentQuestion?.id] !== undefined ? (
              <span className="answered-badge">
                <FiCheck className="badge-icon" />
                {t("Answered")}
              </span>
            ) : (
              <span className="unanswered-badge">
                <FaRegQuestionCircle className="badge-icon" />
                {t("Unanswered")}
              </span>
            )}
          </div>
          
          <h3 className="question-text">
            <FiHelpCircle className="question-icon" />
            {currentQuestion?.text}
          </h3>
        </div>
        
        <div className="answers-list">
          {currentQuestion?.options.map((option, index) => (
            <div
              key={option.id}
              className={`answer-option ${
                answers[currentQuestion?.id] === option.id ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
            >
              <div className="option-selector">
                <div className={`option-circle ${answers[currentQuestion?.id] === option.id ? 'selected' : ''}`}>
                  {String.fromCharCode(65 + index)}
                </div>
              </div>
              <div className="option-content">
                <span className="option-text">{option.text}</span>
                {answers[currentQuestion?.id] === option.id && (
                  <FiCheck className="selection-check" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-navigation">
        <div className="nav-section">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <FiChevronLeft className="nav-icon" />
            {t("Previous")}
          </button>
          
          <div className="question-indicators">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-indicator ${
                  index === currentQuestionIndex ? 'active' : ''
                } ${answers[questions[index]?.id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
                title={t("Question {{number}}", { number: index + 1 })}
              >
                {answers[questions[index]?.id] !== undefined ? (
                  <FiCheck className="indicator-icon" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className="nav-btn next-btn"
              onClick={handleNextQuestion}
              disabled={answers[currentQuestion?.id] === undefined}
            >
              {t("Next")}
              <FiChevronRight className="nav-icon" />
            </button>
          ) : (
            <button
              className="nav-btn submit-btn"
              onClick={handleSubmitTest}
              disabled={!allQuestionsAnswered || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FiUpload className="btn-icon spin" />
                  {t("Submitting...")}
                </>
              ) : (
                <>
                  <FiSend className="btn-icon" />
                  {t("Submit Assessment")}
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className="test-footer">
        <div className="footer-content">
          <div className="status-section">
            <div className="status-item">
              <FiClock className="status-icon" />
              <div>
                <span className="status-label">{t("Duration")}</span>
                <span className="status-value">{t("{{duration}} minutes", { duration: testDuration })}</span>
              </div>
            </div>
            
            <div className="status-item">
              <FiCheckCircle className="status-icon" />
              <div>
                <span className="status-label">{t("Answered")}</span>
                <span className="status-value">{t("{{answered}}/{{total}}", { 
                  answered: Object.keys(answers).length, 
                  total: questions.length 
                })}</span>
              </div>
            </div>
            
            <div className="status-item">
              <MdOutlineRateReview className="status-icon" />
              <div>
                <span className="status-label">{t("Review Required")}</span>
                <span className="status-value">{questions.length - Object.keys(answers).length}</span>
              </div>
            </div>
          </div>
          
          {!allQuestionsAnswered && (
            <div className="warning-section">
              <HiOutlineExclamationCircle className="warning-icon" />
              <div>
                <h4>{t("Incomplete Assessment")}</h4>
                <p>{t("Please answer all questions before submitting")}</p>
              </div>
            </div>
          )}
          
          <div className="instructions-footer">
            <div className="instruction-item">
              <FiAlertTriangle className="instruction-icon" />
              <span>{t("This assessment can only be taken once")}</span>
            </div>
            <div className="instruction-item">
              <FiEyeOff className="instruction-icon" />
              <span>{t("You will not see your final score")}</span>
            </div>
            <div className="instruction-item">
              <MdQuestionAnswer className="instruction-icon" />
              <span>{t("Review all answers before submitting")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}