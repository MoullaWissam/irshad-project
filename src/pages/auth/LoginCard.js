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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: "" },
    }));
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
        // Determine role and user data
        let userRole, userData, accessToken;
        
        if (isCompanyMode && data.company) {
          userRole = data.company.role || "company";
          userData = data.company;
          localStorage.setItem("companyData", JSON.stringify(data.company));
        } else if (data.user) {
          userRole = data.user.role || "job_seeker";
          userData = data.user;
          localStorage.setItem("userData", JSON.stringify(data.user));
          
          // Store access token if available
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
          }
        }

        // Store role in localStorage
        localStorage.setItem("userRole", userRole);

        toast.success(
          `🎉 Welcome back! ${userRole === "company" ? 'Company' : 'User'} login successful`,
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
        
        // Determine redirect path based on role
        let redirectPath;
        if (userRole === "job_seeker") {
          redirectPath = "/matches";
        } else if (userRole === "company") {
          redirectPath = "/company/my-jobs";
        } else {
          // Fallback for other roles
          redirectPath = isCompanyMode ? "/company/dashboard" : "/dashboard";
        }

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } else {
        const errorMessage = data.message || 
                           data.error || 
                           `Invalid ${isCompanyMode ? 'company credentials' : 'email or password'}`;
        
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      
      toast.error("Network Error", {
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
<h2 className="login-card-title" style={isCompanyMode ? { fontSize: 'clamp(14px, 3vw, 16px)' } : {}}>
  {isCompanyMode ? 'Company Login' : 'User Login'}
</h2>        </div>

        {/* Switch button between modes */}
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
            {/* تم إزالة عرض serverError من هنا */}

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
    <Link to="/forgot-password?userType=company" className="login-card-forgot-link">
      Forgot Company Password?
    </Link>
    <p className="login-card-signup-text">
      New Company?{" "}
      <Link 
        to="/register?userType=company" 
        className="login-card-signup-link"
        onClick={() => toast.info("Redirecting to company registration...")}
      >
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