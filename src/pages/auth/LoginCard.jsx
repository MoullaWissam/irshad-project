import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginStyle.css";
import logo from "../../assets/images/irshasd-new.png";
import InputField from "./InputField";
import { useTranslation } from "react-i18next";

const LoginCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      const endpoint = "http://localhost:3000/auth/login";

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
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.token);
        let userRole = "";
        if (data.type == "user") {
          userRole = "jobSeeker";
          localStorage.setItem("userData", JSON.stringify(data.user));
          localStorage.setItem("userRole", userRole);
        } else if (data.type == "company") {
          userRole = "company";
          localStorage.setItem("companyData", JSON.stringify(data.company));
          localStorage.setItem("userRole", userRole);
        }

        toast.success(`${t("Welcome back!")} ${t("User")}`, {
          autoClose: 2000,
        });

        setTimeout(() => {
          if (userRole === "jobSeeker") {
            navigate("/upload-resume");
          } else if (userRole === "company") {
            navigate("/company/my-jobs");
          }
        }, 1500);
      } else {
        // const errorMessage =
        //   data.message || data.error || "Invalid email or password";

        // toast.error(t(errorMessage), {
        //   position: "top-center",
        //   autoClose: 5000,
        // });
        console.log(data);
        
        if (response.status === 401) {
          const errorMessage = data.message;
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
          });
        }
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

      <div className="login-card-main">
        <div className="login-card-logo-title">
          <img src={logo} alt="Irshad" className="login-card-logo" />
          <h2 className="login-card-title">{t("User Login")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-card-form">
          <div className="login-card-inputs">
            <InputField
              label={t("Email")}
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={form.errors.email}
              placeholder="user@example.com"
            />

            <InputField
              label={t("Password")}
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={form.errors.password}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              className={`login-card-submit-btn ${
                isLoading ? "login-card-loading-state" : ""
              } login-card-user-submit`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="login-card-loading">
                  <span className="login-card-spinner"></span>
                  {t("Logging in...")}
                </span>
              ) : (
                t("Login as User")
              )}
            </button>

            <div className="login-card-links">
              <Link to="/forgot-password" className="login-card-forgot-link">
                {t("Forgot Password?")}
              </Link>

              <p className="login-card-signup-text">
                {t("Don't have an account?")}{" "}
                <Link to="/register" className="login-card-signup-link">
                  {t("Sign Up")}
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
