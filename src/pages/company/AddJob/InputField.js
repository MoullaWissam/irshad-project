import { useState, useEffect } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputField.css";

const InputField = ({ label, type, value, onChange, error }) => {
  const [show, setShow] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    if (error) {
      setShowFloating(true);
      const timer = setTimeout(() => setShowFloating(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      style={{
        marginBottom: "28px",
        width: "100%",
        placeSelf: "center",
        position: "relative",
      }}
    >
      <label
        style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={type === "password" && !show ? "password" : "text"}
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "8px 35px 8px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        {type === "password" && (
          <span className="eyeIcon" onClick={() => setShow(!show)}>
            {show ? "💔" : "❤️"}
          </span>
        )}

        {error && showFloating && (
          <span className="error-floating">{error}</span>
        )}
      </div>
    </div>
  );
};

export default InputField;
