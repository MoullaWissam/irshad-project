import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./LoginStyle.css";
import logo from "../../assets/images/logo.png";
import InputField from "./InputField";

const LoginCard = () => {
  const navigate = useNavigate();

  const [isCompanyMode, setIsCompanyMode] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    errors: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // إضافة serverError

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: "" },
    }));
    setServerError(""); // مسح خطأ الخادم عند التغيير
  };

  const validate = () => {
    const errors = {};
    let hasError = false;

    if (!form.email) {
      errors.email = "Email is required";
      hasError = true;
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format";
      hasError = true;
    }

    if (!form.password) {
      errors.password = "Password is required";
      hasError = true;
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    setForm((prev) => ({ ...prev, errors }));
    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setServerError(""); // مسح أخطاء الخادم القديمة

    try {
      const endpoint = isCompanyMode 
        ? "http://localhost:3000/company-management/company-login"
        : "http://localhost:3000/auth/login";

      const requestBody = {
        email: form.email,
        password: form.password,
      };
          
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `🎉 Welcome back! ${isCompanyMode ? 'Company' : 'User'} login successful`,
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
        
        localStorage.setItem("userRole", isCompanyMode ? "company" : "user");
        
        if (isCompanyMode && data.user) {
          localStorage.setItem("companyData", JSON.stringify(data.user));
        }

        setTimeout(() => {
          navigate(isCompanyMode ? "/company/dashboard" : "/dashboard");
        }, 1500);
      } else {
        const errorMessage = data.message || 
                           data.error || 
                           `Invalid ${isCompanyMode ? 'company credentials' : 'email or password'}`;
        
        // عرض خطأ الخادم في المكان المخصص
        setServerError(errorMessage);
        
        // إزالة toast لخطأ الخادم
        // toast.error(`${isCompanyMode ? 'Company' : 'User'} Login Failed`, {
        //   description: errorMessage,
        //   position: "top-center",
        //   autoClose: 5000,
        // });
      }
    } catch (error) {
      console.error("Error:", error);
      
      setServerError("Network error. Please try again later.");
      
      // عرض toast فقط لأخطاء الشبكة
      toast.error("Network Error", {
        description: "Unable to connect to server. Please check your internet connection.",
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompanyMode = (newMode) => {
    setIsCompanyMode(newMode);
    
    toast.info(
      `Switched to ${newMode ? 'Company' : 'User'} login mode`,
      {
        position: "top-center",
        autoClose: 2000,
      }
    );
    
    setForm({
      email: "",
      password: "",
      errors: {},
    });
    setServerError("");
  };

  return (
    <div className="login-card-container">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className={`login-card-main ${isCompanyMode ? 'login-card-company-mode' : ''}`}>
        <div className="login-card-logo-title">
          <img src={logo} alt="Irshad" className="login-card-logo" />
          <h2 className="login-card-title">{isCompanyMode ? 'Company Login' : 'User Login'}</h2>
        </div>

        {/* زر التبديل بين الوضعين */}
        <div className="login-card-mode-toggle-container">
          <div className="login-card-mode-toggle-wrapper">
            <button
              type="button"
              className={`login-card-mode-btn login-card-user-mode ${!isCompanyMode ? 'login-card-active' : ''}`}
              onClick={() => toggleCompanyMode(false)}
              aria-pressed={!isCompanyMode}
            >
              User
            </button>
            <button
              type="button"
              className={`login-card-mode-btn login-card-company-mode ${isCompanyMode ? 'login-card-active' : ''}`}
              onClick={() => toggleCompanyMode(true)}
              aria-pressed={isCompanyMode}
            >
              Company
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-card-form">
          <div className="login-card-inputs">
            {/* عرض خطأ الخادم في الأعلى */}
            {serverError && (
              <div className="login-card-server-error">
                {serverError}
              </div>
            )}

            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={form.errors.email}
              placeholder={isCompanyMode ? "company@example.com" : "user@example.com"}
              isCompanyMode={isCompanyMode}
            />

            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={form.errors.password}
              placeholder="Enter your password"
              isCompanyMode={isCompanyMode}
            />

            <button
              type="submit"
              className={`login-card-submit-btn ${isLoading ? 'login-card-loading-state' : ''} ${isCompanyMode ? 'login-card-company-submit' : 'login-card-user-submit'}`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="login-card-loading">
                  <span className="login-card-spinner"></span>
                  {isCompanyMode ? "Logging in..." : "Logging in..."}
                </span>
              ) : (
                isCompanyMode ? "Login as Company" : "Login as User"
              )}
            </button>

            {!isCompanyMode && (
              <div className="login-card-links">
                <Link to="/forgot-password" className="login-card-forgot-link">
                  Forgot Password?
                </Link>

                <p className="login-card-signup-text">
                  Don't have an account?{" "}
                  <Link to="/register" className="login-card-signup-link">
                    Sign Up
                  </Link>
                </p>
              </div>
            )}

            {isCompanyMode && (
              <div className="login-card-company-links">
                <Link to="/company/forgot-password" className="login-card-forgot-link">
                  Forgot Company Password?
                </Link>
                <p className="login-card-signup-text">
                  New Company?{" "}
                  <Link to="/company/register" className="login-card-signup-link">
                    Register Company
                  </Link>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;