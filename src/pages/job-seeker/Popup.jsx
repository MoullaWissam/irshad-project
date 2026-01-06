/**
 * Popup Component
 * نافذة عائمة بسيطة تظهر عند رفع الملف بنجاح
 */

import React from "react";

const Popup = ({ closePopup }) => {
  return (
    <div className="overlay" onClick={closePopup}>
      <div
        className="popup"
        onClick={(e) => e.stopPropagation()} // لمنع الإغلاق عند الضغط داخل النافذة
      >
        <button className="close-btn" onClick={closePopup}>
          ❌
        </button>
        <p>✅ تم تحميل الملف بنجاح!</p>
      </div>
    </div>
  );
};

export default Popup;
