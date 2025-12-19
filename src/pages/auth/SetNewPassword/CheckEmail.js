import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthCard from "./AuthCard";
import "./CheckEmail.css";

function CheckEmail() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("resetEmail") || "your email";

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const code = inputsRef.current.map((input) => input?.value || "").join("");
    
    if (code.length !== 5) {
      toast.error("Please enter the 5-digit code", {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/verify-otp-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          email: email,
          otp: code 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification successful! Redirecting...", {
          position: "top-center",
          autoClose: 2000,
        });
        
        // الانتقال بعد 2 ثانية للسماح برؤية الرسالة
        setTimeout(() => {
          navigate("/set-password");
        }, 2000);
      } else {
        toast.error(data.message || "Invalid verification code", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/resend-password-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        toast.success("Code resent successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error(data.message || "Failed to resend code", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <AuthCard
        title="Check your email"
        subtitle={
          <>
            We have sent a password recovery link to{" "}
            <strong>{email}</strong>
            <br />
            Enter 5 digit code that mentioned in the email
          </>
        }
        fields={[]}
        buttonText={loading ? "Verifying..." : "Continue"}
        onSubmit={handleSubmit}
        showBackButton={true}
        customBackPath="/forgot-password"
      >
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
              disabled={loading}
            />
          ))}
        </div>

        <p className="resend-text">
          Haven't got the code yet?{" "}
          <span 
            className="resend-link" 
            onClick={handleResendCode}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Resend code
          </span>
        </p>
      </AuthCard>
    </>
  );
}

export default CheckEmail;