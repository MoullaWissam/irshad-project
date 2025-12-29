import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./LoginStyle.css";
import logo from "../../assets/images/logo.png";
import InputField from "./InputField";
import { useTranslation } from 'react-i18next';

const LoginCard = () => {
  const { t } = useTranslation();
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
      errors.email = t('Email is required');
      hasError = true;
    } else if (!emailRegex.test(form.email)) {
      errors.email = t('Invalid email format');
      hasError = true;
    }

    if (!form.password) {
      errors.password = t('Password is required');
      hasError = true;
    } else if (form.password.length < 6) {
      errors.password = t('Password must be at least 6 characters');
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
        let userRole, userData, accessToken;
        
        if (isCompanyMode && data.company) {
          userRole = data.company.role || "company";
          userData = data.company;
          localStorage.setItem("companyData", JSON.stringify(data.company));
        } else if (data.user) {
          userRole = data.user.role || "job_seeker";
          userData = data.user;
          localStorage.setItem("userData", JSON.stringify(data.user));
          
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
          }
        }

        localStorage.setItem("userRole", userRole);

        toast.success(
          ` ${t('Welcome back!')} ${userRole === "company" ? t('Company') : t('User')} ${t('login successful')}`,
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
        
        let redirectPath;
        if (userRole === "job_seeker") {
          redirectPath = "/matches";
        } else if (userRole === "company") {
          redirectPath = "/company/my-jobs";
        } else {
          redirectPath = isCompanyMode ? "/company/dashboard" : "/dashboard";
        }

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } else {
        const errorMessage = data.message || 
                           data.error || 
                           t(`Invalid ${isCompanyMode ? 'company credentials' : 'email or password'}`);
        
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      
      toast.error(t("Network Error"), {
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
      t(`Switched to ${newMode ? 'Company' : 'User'} login mode`),
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
            {isCompanyMode ? t('Company Login') : t('User Login')}
          </h2>
        </div>

        <div className="login-card-mode-toggle-container">
          <div className="login-card-mode-toggle-wrapper">
            <button
              type="button"
              className={`login-card-mode-btn login-card-user-mode ${!isCompanyMode ? 'login-card-active' : ''}`}
              onClick={() => toggleCompanyMode(false)}
              aria-pressed={!isCompanyMode}
            >
              {t('User')}
            </button>
            <button
              type="button"
              className={`login-card-mode-btn login-card-company-mode ${isCompanyMode ? 'login-card-active' : ''}`}
              onClick={() => toggleCompanyMode(true)}
              aria-pressed={isCompanyMode}
            >
              {t('Company')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-card-form">
          <div className="login-card-inputs">
            <InputField
              label={t('Email')}
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={form.errors.email}
              placeholder={isCompanyMode ? t("company@example.com") : t("user@example.com")}
            />

            <InputField
              label={t('Password')}
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={form.errors.password}
              placeholder={t("Enter your password")}
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
                  {t("Logging in...")}
                </span>
              ) : (
                isCompanyMode ? t("Login as Company") : t("Login as User")
              )}
            </button>

            {!isCompanyMode && (
              <div className="login-card-links">
                <Link to="/forgot-password" className="login-card-forgot-link">
                  {t('Forgot Password?')}
                </Link>

                <p className="login-card-signup-text">
                  {t("Don't have an account?")}{" "}
                  <Link to="/register" className="login-card-signup-link">
                    {t('Sign Up')}
                  </Link>
                </p>
              </div>
            )}
            {isCompanyMode && (
              <div className="login-card-company-links">
                <Link to="/forgot-password?userType=company" className="login-card-forgot-link">
                  {t('Forgot Company Password?')}
                </Link>
                <p className="login-card-signup-text">
                  {t('New Company?')}{" "}
                  <Link 
                    to="/register?userType=company" 
                    className="login-card-signup-link"
                    onClick={() => toast.info(t("Redirecting to company registration..."))}
                  >
                    {t('Register Company')}
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