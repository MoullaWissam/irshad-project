import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import "./CheckEmail.css";

function VerfiyEmail() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [email, setEmail] = useState("");

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = inputsRef.current.map((input) => input.value).join("");

    try {
      const response = await fetch("http://localhost:3000/auth/verify-email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        console.warn("No JSON body returned");
      }
      console.log(data);
      
      if (response.ok) {
        console.log("Verification successful:", data);

        // نقرأ الدور من data.user.role
        const role = data?.user?.role;
        console.log(role);
        
        if (role === "company") {
          navigate("/company/dashboard");
        } else {
          navigate("/jobseeker/upload");
        }
      } else {
        console.error("Verification failed:", data);
      }
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle={<>Enter your email and the 5-digit code sent to it.</>}
      fields={[]}
      buttonText="Verify Email"
      onSubmit={handleSubmit}
      showBackButton={true}
    >
      {/* حقل البريد الإلكتروني */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "16px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      />

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

      <p className="resend-text">
        Haven’t got the email yet?{" "}
        <span className="resend-link">Resend email</span>
      </p>
    </AuthCard>
  );
}

export default VerfiyEmail;
