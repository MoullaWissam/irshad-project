import React, { useState, useEffect } from "react";
// 👇 1. إضافة استيراد Link
import { Link } from "react-router-dom"; 
import "./LoginStyle.css";
// تأكد من أن مسار الشعار صحيح بالنسبة لمكان هذا الملف
import logo from "../../assets/images/logo.png"; 
import InputField from "./InputField";

const LoginCard = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    errors: {},
  });

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

  const handleLogin = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log("✅ Data is valid");
      // هنا يمكنك إضافة منطق تسجيل الدخول الفعلي
      alert("Login successful (demo)");
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

  return (
    <div className="mainBox">
      <div className="logoTitel">
        <img src={logo} alt="Irshad" />
        <h2>Login</h2>
      </div>

      <form onSubmit={handleLogin}>
        <div className="inputBox">
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

          <button type="submit" className="submitButton">
            login
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            
            {/* 👇 2. التعديل هنا: ربطنا النص بصفحة نسيان كلمة المرور */}
            <Link to="/forgot-password" style={{ fontSize: "14px", color: "#00AEEF", textDecoration: "none" }}>
              Forgot Password ?
            </Link>

            <p style={{ marginTop: "65px", fontSize: "14px" }}>
              Don’t have an account?{" "}
              
              {/* 👇 3. وهذا أيضاً نربطه بصفحة التسجيل */}
              <Link to="/register" style={{ color: "#00AEEF", textDecoration: "none" }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;