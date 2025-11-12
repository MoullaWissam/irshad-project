/**
 * SetNewPassword Page
 * واجهة تعيين كلمة مرور جديدة بعد التحقق من البريد
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";

function SetNewPassword() {
  const navigate = useNavigate();

  // عند إرسال النموذج، ينتقل المستخدم إلى صفحة "تم التغيير بنجاح"
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/success");
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
        },
        {
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm new password",
        },
      ]}
      buttonText="Update Password"
      onSubmit={handleSubmit}
      showBackButton={true}
    />
  );
}

export default SetNewPassword;
