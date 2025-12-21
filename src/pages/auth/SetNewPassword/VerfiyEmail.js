import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import "./CheckEmail.css";

function CheckEmail() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  // البريد الأصلي (يمكنك تمريره من الـ props أو من الـ backend)
  const email = localStorage.getItem("setEmail")
  const maskedEmail = email.split("@")[0]; // إزالة لاحقة البريد

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = inputsRef.current.map((input) => input.value).join("");

    try {
      const response = await fetch("http://localhost:3000/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: code }),
      });

      if (response.ok) {
        // نجاح التحقق
        navigate("/upload-resume");
      } else {
        // فشل التحقق
        alert("Invalid OTP code");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Server error, please try again");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/resend-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        console.log("OTP code has been resent to your email!");
      } else {
        console.log("Failed to resend OTP code",response);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Server error, please try again");
    }
  };

  return (
    <AuthCard
      title="Verfiy your email"
      subtitle={
        <>
          We have sent a password recovery link to{" "}
          <strong>{maskedEmail}</strong>
          <br />
          Enter 5 digit code that mentioned in the email
        </>
      }
      fields={[]} // لا نستخدم حقول الإدخال هنا
      buttonText="Open Email App"
      onSubmit={handleSubmit}
      showBackButton={true}
    >
      {/* حقول إدخال الرمز */}
      <div className="otp-inputs">
        {[0, 1, 2, 3, 4].map((i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            className="otp-box"
            ref={(el) => (inputsRef.current[i] = el)}
            onChange={(e) => handleChange(e, i)}
            required
          />
        ))}
      </div>

      {/* رابط إعادة الإرسال */}
      <p className="resend-text">
        Haven't got the code yet?{" "}
        <span 
          className="resend-link" 
          onClick={handleResendOTP}
          style={{ cursor: "pointer", color: "#007bff" }}
        >
          Resend code
        </span>
      </p>
    </AuthCard>
  );
}

export default CheckEmail;