import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: "" },
    }));
    setServerError("");
  };

  const validate = () => {
    const errors = {};

    if (!form.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setServerError("");

    try {
      // تحديد الـ API بناءً على الوضع - استخدام نفس الخصائص لكليهما
      const endpoint = isCompanyMode 
        ? "http://localhost:3000/company-management/company-login"
        : "http://localhost:3000/auth/login";

      // استخدام نفس request body لكليهما (email و password فقط)
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

      // في ملف Login.js - في الجزء handleSubmit بعد response.ok
      if (response.ok) {
        console.log("✅ Success:", data);
        
        // حفظ التوكن إذا كان موجودًا
        localStorage.setItem("userRole", isCompanyMode ? "company" : "user");
        

        // إذا كان تسجيل دخول شركة، احفظ بيانات الشركة
        if (isCompanyMode && data.user) {
          localStorage.setItem("companyData", JSON.stringify(data.user));
          console.log("Company data saved to localStorage:", data.user);
        }

        // توجيه بناءً على الوضع
        navigate(isCompanyMode ? "/company/dashboard" : "/dashboard");
      }else {
        // عرض رسالة الخطأ من الخادم
        const errorMessage = data.message || 
                           data.error || 
                           `Invalid ${isCompanyMode ? 'company credentials' : 'email or password'}`;
        setServerError(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompanyMode = () => {
    setIsCompanyMode(!isCompanyMode);
    setForm({
      email: "",
      password: "",
      errors: {},
    });
    setServerError("");
  };

  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      const timer = setTimeout(() => {
        setForm((prev) => ({ ...prev, errors: {} }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [form.errors]);

  return (
    <div className="login-page-bg">
      <div className={`mainBox ${isCompanyMode ? 'company-mode' : ''}`}>
        <div className="logoTitel">
          <img src={logo} alt="Irshad" />
          <h2>{isCompanyMode ? 'Company Login' : 'User Login'}</h2>
        </div>

        {/* زر التبديل بين الوضعين - تصميم محسن */}
        <div className="mode-toggle-container">
          <div className="mode-toggle-wrapper">
            <button
              type="button"
              className={`mode-toggle-btn user-mode ${!isCompanyMode ? 'active' : ''}`}
              onClick={() => setIsCompanyMode(false)}
            >
              User
            </button>
            <button
              type="button"
              className={`mode-toggle-btn company-mode ${isCompanyMode ? 'active' : ''}`}
              onClick={() => setIsCompanyMode(true)}
            >
              Company
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            {serverError && (
              <div className="server-error">
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
            />

            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={form.errors.password}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              className={`submitButton ${isCompanyMode ? 'company-submit' : 'user-submit'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-text">
                  <span className="spinner"></span>
                  {isCompanyMode ? "Company Logging in..." : "User Logging in..."}
                </span>
              ) : (
                isCompanyMode ? "Login as Company" : "Login as User"
              )}
            </button>

            {!isCompanyMode && (
              <div className="auth-links">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>

                <p className="signup-text">
                  Don't have an account?{" "}
                  <Link to="/register" className="signup-link">
                    Sign Up
                  </Link>
                </p>
              </div>
            )}

            {isCompanyMode && (
              <div className="company-auth-links">
                <Link to="/company/forgot-password" className="forgot-password-link">
                  Forgot Company Password?
                </Link>
                <p className="signup-text">
                  New Company?{" "}
                  <Link to="/company/register" className="signup-link">
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