/**
 * ErrorMessage Component
 * مكون يعرض رسالة خطأ أنيقة وتختفي تلقائيًا بعد مدة محددة
 */

import React, { useEffect } from "react";

const ErrorMessage = ({ message, onClose, duration = 3000 }) => {
  // عند ظهور الرسالة، يتم ضبط مؤقت للإخفاء التلقائي
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null; // إذا ما في رسالة، لا تعرض شيء

  return (
    <div className="error-message">
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
