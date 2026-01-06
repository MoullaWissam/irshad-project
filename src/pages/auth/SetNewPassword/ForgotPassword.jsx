import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save email for later use
        localStorage.setItem("resetEmail", email);
        navigate("/check-email");
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Please enter your email to reset the password"
      fields={[
        {
          label: "Your Email",
          type: "email",
          placeholder: "Enter your email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
        },
      ]}
      buttonText={loading ? "Sending..." : "Reset Password"}
      onSubmit={handleSubmit}
      showBackButton={true}
      customBackPath="/login"
    />
  );
}

export default ForgotPassword;