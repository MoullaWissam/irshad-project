import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import "./CheckEmail.css";

function CheckEmail() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = inputsRef.current.map((input) => input.value).join("");
    console.log("Entered code:", code);
    navigate("/set-password");
  };

  return (
    <AuthCard
      title="Check your email"
      subtitle={
        <>
          We have sent a password recovery link to{" "}
          <strong>alpha...@gmail.com</strong>
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
        Haven’t got the email yet?{" "}
        <span className="resend-link">Resend email</span>
      </p>
    </AuthCard>
  );
}

export default CheckEmail;
