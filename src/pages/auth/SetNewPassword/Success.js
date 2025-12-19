import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <AuthCard
      title="Password updated!"
      subtitle={
        <>
          Your password has been successfully updated.
          <br />
          You will be redirected to login page in 5 seconds.
        </>
      }
      fields={[]}
      buttonText="Back to Login"
      onSubmit={handleSubmit}
      showBackButton={false}
    />
  );
}

export default Success;