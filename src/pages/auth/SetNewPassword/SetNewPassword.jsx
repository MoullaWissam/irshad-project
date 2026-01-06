import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";

function SetNewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          newPassword: password 
        }),
        credentials: 'include', // لإرسال cookies مع الطلب
      });

      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        // Clean up temporary data
        localStorage.removeItem("resetEmail");
        
        // Navigate to success page
        navigate("/success");
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Update password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Create a new password. Ensure it differs from previous ones for security."
      fields={[
        {
          label: "Password",
          type: "password",
          placeholder: "Enter new password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
        },
        {
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm new password",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
        },
      ]}
      buttonText={loading ? "Updating..." : "Update Password"}
      onSubmit={handleSubmit}
      showBackButton={true}
      customBackPath="/check-email"
    />
  );
}

export default SetNewPassword;