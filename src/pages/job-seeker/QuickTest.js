import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./QuickTest.css";
import { toast } from 'react-toastify';

export default function QuickTest() {
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
  const [testDuration, setTestDuration] = useState(5); // إضافة حالة جديدة

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
    // الخطوة 1: إرسال طلب التوظيف
    setIsSubmittingApplication(true);
    try {
      const response = await fetch(`http://localhost:3000/jobapply/${jobId}`, {
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
      
      // حفظ نتيجة الطلب
      setApplicationResult(result);
      
      toast.success("✅ Job application submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // الخطوة 2: تحميل الأسئلة بعد نجاح طلب التوظيف
      await loadQuestions();
      
      // الخطوة 3: بدء الاختبار
      setTestStarted(true);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setError(error.message);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const loadQuestions = async () => {
    // تحميل الأسئلة من API
    setQuestionsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/jobs/${jobId}/shuffled-questions`, {
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
      
      // الآن البيانات تأتي على شكل { testDuration, questions }
      // التحقق من أن البيانات تحتوي على الأسئلة المطلوبة
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions available for this test.");
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
      
      // ضبط مدة الاختبار من الـ API
      const duration = data.testDuration || 5;
      setTestDuration(duration);
      setTimeLeft(duration * 60); // تحويل الدقائق إلى ثواني
      
    } catch (error) {
      console.error("Error loading questions:", error);
      setError(error.message);
      
      // عرض رسالة toast للمستخدم
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      // إعادة تعيين الحالة للسماح للمستخدم بالمحاولة مرة أخرى
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
      toast.error("Please answer all questions before submitting the test.", {
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
        duration: testDuration // استخدام testDuration من الـ API
      };
      
      console.log("Submitting test data:", testData);
      
      const response = await fetch(`http://localhost:3000/jobapply/${jobId}/test/submit`, {
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
      
      toast.success("✅ Test submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate(`/job/${jobId}/application-success`, {
        state: {
          testCompleted: true,
          jobData: jobData,
          applicationResult: applicationResult,
          testResult: testResult,
          testDuration: testDuration, // استخدام testDuration من الـ API
          testSubmitted: true
        }
      });
      
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error(`❌ ${error.message}`, {
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
          <h1 className="test-title">Screening Test</h1>
          
          {jobData && (
            <div className="job-test-info">
              <h2>{jobData.title}</h2>
              <p>Company: {jobData.companyName}</p>
            </div>
          )}
          
          <div className="instructions-card">
            <h3>Test Instructions</h3>
            <ul>
              {/* عرض مدة الاختبار التي سيتم تحميلها من الـ API */}
              <li>✓ Test duration: {testDuration} minutes</li>
              <li>✓ Number of questions: Will be loaded from server</li>
              <li>✓ You must answer all questions to submit the test</li>
              <li>✓ You cannot go back after time ends</li>
              <li>✓ Test results will be sent directly to the employer</li>
              <li>✓ <strong>You will not see your test score</strong></li>
              <li>✓ <strong>You cannot retake this test</strong></li>
            </ul>
            
            <div className="test-tips">
              <strong>Important:</strong>
              <p>Clicking "Start Test" will:</p>
              <ol>
                <li>Submit your job application</li>
                <li>Load test questions and duration from server</li>
                <li>Start the test timer</li>
              </ol>
              <p>This action cannot be undone.</p>
              
              {questionsLoading && (
                <div className="loading-indicator">
                  <div className="small-spinner"></div>
                  <p>Loading questions and test duration...</p>
                </div>
              )}
              
              {error && (
                <div className="error-alert">
                  <p>⚠️ {error}</p>
                  <p>Please try again or contact support.</p>
                </div>
              )}
            </div>
          </div>
          
          <button 
            className="start-test-btn" 
            onClick={handleStartTest}
            disabled={isSubmittingApplication || questionsLoading}
          >
            {isSubmittingApplication ? "Submitting Application..." : 
             questionsLoading ? "Loading Questions..." : "Start Test"}
          </button>
          
          {error && (
            <button 
              className="retry-btn"
              onClick={() => {
                setError(null);
                handleStartTest();
              }}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="quick-test-container">
        <div className="test-completed-message">
          <div className="success-icon-large">✓</div>
          <h2>Test Submitted Successfully!</h2>
          <p>Your test has been submitted. The results will be reviewed by the employer.</p>
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
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-test-container">
      <div className="test-header">
        <div className="test-info">
          <h1>Screening Test</h1>
          <div className="timer">
            <span className="time-label">Time Left:</span>
            <span className={`time-value ${timeLeft <= 60 ? 'warning' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
          <span className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <span className="question-number">Question {currentQuestionIndex + 1}</span>
          {answers[currentQuestion?.id] !== undefined && (
            <span className="answered-indicator">✓ Answered</span>
          )}
        </div>
        
        <h3 className="question-text">{currentQuestion?.text}</h3>
        
        <div className="answers-list">
          {currentQuestion?.options.map((option, index) => (
            <div
              key={option.id}
              className={`answer-option ${
                answers[currentQuestion?.id] === option.id ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="test-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <div className="question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-dot ${
                index === currentQuestionIndex ? 'active' : ''
              } ${answers[questions[index]?.id] !== undefined ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            className="nav-btn next-btn"
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion?.id] === undefined}
          >
            Next
          </button>
        ) : (
          <button
            className="nav-btn submit-btn"
            onClick={handleSubmitTest}
            disabled={!allQuestionsAnswered || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
      
      <div className="test-footer">
        <div className="answers-status">
          <p className="hint">
            💡 Answered: {Object.keys(answers).length} of {questions.length} questions
          </p>
          {!allQuestionsAnswered && (
            <p className="warning-message">
              ⚠️ Please answer all questions before submitting.
            </p>
          )}
        </div>
        
        <div className="test-info-footer">
          <p>⏱️ Test Duration: {testDuration} minutes</p>
          <p className="test-warning">
            ⚠️ Warning: This test can only be taken once. Make sure to review your answers before submitting.
          </p>
        </div>
      </div>
    </div>
  );
}