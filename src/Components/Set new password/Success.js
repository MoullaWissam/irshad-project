import React from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";

function Success() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <AuthCard
      title="Password updated!"
      subtitle="Your password has been successfully updated."
      fields={[]}
      buttonText="Back to Login"
      onSubmit={handleSubmit}
      showBackButton={false}
    />
  );
}

export default Success;
