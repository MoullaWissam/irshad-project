import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginStyle.css";
import logo from "../../assets/images/logo.png";
import InputField from "./InputField";

const LoginCard = () => {
  const navigate = useNavigate();

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

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch("http://192.168.1.9:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Login Successful:", data);

        if (data.token || data.accessToken) {
          localStorage.setItem("token", data.token || data.accessToken);
          localStorage.setItem("userRole", data.role);
        }

        navigate("/dashboard");
      } else {
        setServerError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setServerError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      const timer = setTimeout(() => {
        setForm((prev) => ({ ...prev, errors: {} }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [form.errors]);

  // التعديل هنا: إضافة div خارجي مع className="login-page-bg"
  return (
    <div className="login-page-bg"> {/* ✅ هذا هو التعديل */}
      <div className="mainBox">
        <div className="logoTitel">
          <img src={logo} alt="Irshad" />
          <h2>Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="inputBox">
            {serverError && (
              <div
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                {serverError}
              </div>
            )}

            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={form.errors.email}
            />

            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={form.errors.password}
            />

            <button
              type="submit"
              className="submitButton"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Logging in..." : "login"}
            </button>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "14px",
                  color: "#00AEEF",
                  textDecoration: "none",
                }}
              >
                Forgot Password ?
              </Link>

              <p style={{ marginTop: "65px", fontSize: "14px" }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ color: "#00AEEF", textDecoration: "none" }}
                >
                  Sign Up
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