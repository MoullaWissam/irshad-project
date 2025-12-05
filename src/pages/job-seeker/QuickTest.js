import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./QuickTest.css";

export default function QuickTest() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData;
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 دقائق افتراضياً
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // تحميل الأسئلة من البيانات التجريبية
    const loadQuestions = () => {
      // بيانات تجريبية - يمكن استبدالها بـ API
      const mockQuestions = [
        {
          id: 1,
          text: "What is the primary purpose of Email Marketing in digital marketing?",
          correctAnswer: "Effective tool for direct communication with customers",
          wrongAnswers: ["Expensive and gives no results", "Suitable only for large companies", "Traditional method that is outdated"]
        },
        {
          id: 2,
          text: "What are best practices for writing email marketing subject lines?",
          correctAnswer: "Attractive, short, and clear",
          wrongAnswers: ["Long and detailed", "Using complex technical terms", "Without any subject"]
        },
        {
          id: 3,
          text: "How do you measure the success of an Email Marketing campaign?",
          correctAnswer: "Open rate, click rate, conversion rate",
          wrongAnswers: ["Number of subscribers only", "Email design", "Sending time"]
        },
        {
          id: 4,
          text: "What is a good open rate for email marketing?",
          correctAnswer: "15-25%",
          wrongAnswers: ["5-10%", "30-40%", "50-60%"]
        }
      ];
      
      setQuestions(mockQuestions);
      
      // ضبط الوقت بناءً على مدة الاختبار إذا كانت متوفرة
      if (jobData?.testDuration) {
        setTimeLeft(jobData.testDuration * 60);
      }
    };
    
    loadQuestions();
  }, [jobData]);

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

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
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

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return (correctCount / questions.length) * 100;
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    
    // حساب النتيجة (لإرسالها إلى السيرفر فقط - لا تظهر للمستخدم)
    const score = calculateScore();
    
    // تخزين النتيجة مؤقتاً (لإرسالها مع الطلب)
    localStorage.setItem(`test_score_${jobId}`, score.toString());
    localStorage.setItem(`test_answers_${jobId}`, JSON.stringify(answers));
    
    // محاكاة إرسال النتيجة إلى السيرفر
    try {
      // بيانات الاختبار للإرسال
      const testData = {
        jobId,
        score,
        answers,
        completedAt: new Date().toISOString(),
        duration: jobData?.testDuration || 5
      };
      
      console.log("Test data for server:", testData);
      
      // محاكاة إرسال البيانات إلى API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // الانتقال مباشرة إلى نموذج التقديم بعد إكمال الاختبار
      navigate(`/job/${jobId}/apply`, {
        state: {
          testCompleted: true,
          jobData: jobData,
          testDuration: jobData?.testDuration || 5
        }
      });
      
    } catch (error) {
      console.error("Error submitting test:", error);
      // حتى لو حدث خطأ، انتقل إلى نموذج التقديم
      navigate(`/job/${jobId}/apply`, {
        state: {
          testCompleted: true,
          jobData: jobData
        }
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = currentQuestion ? [
    currentQuestion.correctAnswer,
    ...currentQuestion.wrongAnswers
  ].sort(() => Math.random() - 0.5) : [];

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
              <li>✓ Number of questions: {questions.length} questions</li>
              <li>✓ Test duration: {jobData?.testDuration || 5} minutes</li>
              <li>✓ Select the correct answer for each question</li>
              <li>✓ You cannot go back after time ends</li>
              <li>✓ Test results will be sent directly to the employer</li>
              <li>✓ <strong>You will not see your test score</strong></li>
              <li>✓ <strong>You cannot retake this test</strong></li>
            </ul>
            
            <div className="test-tips">
              <strong>Important:</strong>
              <p>This test can only be taken once. Make sure you're ready before starting.</p>
            </div>
          </div>
          
          <button className="start-test-btn" onClick={handleStartTest}>
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="quick-test-container">
        <div className="submitting-test">
          <div className="submitting-spinner"></div>
          <h2>Submitting your test...</h2>
          <p>Please wait while we process your answers.</p>
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
          {answers[currentQuestion?.id] && (
            <span className="answered-indicator">✓ Answered</span>
          )}
        </div>
        
        <h3 className="question-text">{currentQuestion?.text}</h3>
        
        <div className="answers-list">
          {allAnswers.map((answer, index) => (
            <div
              key={index}
              className={`answer-option ${
                answers[currentQuestion?.id] === answer ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, answer)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{answer}</span>
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
              } ${answers[questions[index]?.id] ? 'answered' : ''}`}
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
            disabled={!answers[currentQuestion?.id]}
          >
            Next
          </button>
        ) : (
          <button
            className="nav-btn submit-btn"
            onClick={handleSubmitTest}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
      
      <div className="test-footer">
        <p className="hint">
          💡 Select an answer for each question before moving to the next
        </p>
        <p className="test-warning">
          ⚠️ Warning: This test can only be taken once. Make sure to review your answers before submitting.
        </p>
      </div>
    </div>
  );
}