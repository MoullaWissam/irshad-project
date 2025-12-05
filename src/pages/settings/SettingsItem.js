import React, { useState } from "react";

function SettingsItem({ label, icon, onClick }) {
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClick = () => {
    if (label === "Account status" || label === "Delete Account") {
      setShowPopup(true);
      setPassword(""); // إعادة تعيين كلمة السر عند فتح البوب أب
      setError(""); // إعادة تعيين الرسالة الخطأ
    } else if (onClick) {
      onClick();
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // تحقق من صحة كلمة السر
    if (value.length < 1) {
      setError("Password is required");
    } else if (value.length < 6) {
      setError("Password must be at least 6 characters");
    } else {
      setError("");
    }
  };

  const handleDeleteAccount = () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    // هنا يمكنك إضافة منطق حذف الحساب مع التحقق من كلمة السر
    console.log("Deleting account with password:", password);

    // عرض رسالة تأكيد
    alert(
      "Account deletion request has been submitted. You will receive a confirmation email."
    );

    // إغلاق البوب أب
    setShowPopup(false);
    setPassword("");
    setError("");
  };

  const renderPopup = () => {
    if (!showPopup) return null;

    if (label === "Account status") {
      return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Account Status</h3>
            <p>Do you want to activate your account?</p>
            <div className="popup-actions">
              <button
                className="btn-activate"
                onClick={() => {
                  console.log("Account activated");
                  setShowPopup(false);
                }}
              >
                Activate
              </button>
              <button
                className="btn-deactivate"
                onClick={() => {
                  console.log("Account deactivated");
                  setShowPopup(false);
                }}
              >
                Deactivate
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (label === "Delete Account") {
      const isPasswordValid = password.length >= 6;

      return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Delete Account</h3>
            <p className="warning-text">
              ⚠️ Warning: This action cannot be undone. All your data will be
              permanently deleted.
            </p>
            <p>Please enter your password to confirm account deletion:</p>

            <div className="password-input-group">
              <input
                type="password"
                placeholder="Enter your password"
                className={`password-input ${error ? "input-error" : ""}`}
                value={password}
                onChange={handlePasswordChange}
                autoFocus
              />
              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="popup-actions">
              <button
                className={`btn-confirm ${
                  !isPasswordValid ? "btn-disabled" : ""
                }`}
                onClick={handleDeleteAccount}
                disabled={!isPasswordValid}
              >
                Delete Account
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowPopup(false);
                  setPassword("");
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (label === "---") {
    return <hr className="divider" />;
  }

  return (
    <>
      <div className="settings-item" onClick={handleClick}>
        <img src={icon} alt={label} className="item-icon" />
        <span className="item-label">{label}</span>
      </div>
      {renderPopup()}
    </>
  );
}

export default SettingsItem;

// // SettingsItem.js
// import React from "react";

// function SettingsItem({ label, icon }) {
//   if (label === "---") {
//     return <hr className="divider" />;
//   }

//   return (
//     <div className="settings-item">
//       <img src={icon} alt={label} className="item-icon" />
//       <span className="item-label">{label}</span>
//     </div>
//   );
// }

// export default SettingsItem;
