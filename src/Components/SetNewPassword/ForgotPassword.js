/**
 * ForgotPassword Page
 * واجهة "نسيت كلمة المرور" لطلب البريد الإلكتروني وإرسال رابط إعادة التعيين
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";

function ForgotPassword() {
  const navigate = useNavigate();

  // عند إرسال النموذج، ينتقل المستخدم إلى صفحة "تحقق من البريد"
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/check-email");
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
        },
      ]}
      buttonText="Reset Password"
      onSubmit={handleSubmit}
      showBackButton={true}
      customBackPath="/login"
    />
  );
}

export default ForgotPassword;
