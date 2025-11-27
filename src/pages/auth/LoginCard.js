// import React, { useState, useEffect } from "react";
// // 👇 1. إضافة استيراد Link
// import { Link } from "react-router-dom";
// import "./LoginStyle.css";
// // تأكد من أن مسار الشعار صحيح بالنسبة لمكان هذا الملف
// import logo from "../../assets/images/logo.png";
// import InputField from "./InputField";

// const LoginCard = () => {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     errors: {},
//   });

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleChange = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//       errors: { ...prev.errors, [field]: "" },
//     }));
//   };

//   const validate = () => {
//     const errors = {};

//     if (!form.email) {
//       errors.email = "Email is required";
//     } else if (!emailRegex.test(form.email)) {
//       errors.email = "Invalid email format";
//     }

//     if (!form.password) {
//       errors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//     }

//     setForm((prev) => ({ ...prev, errors }));
//     return Object.keys(errors).length === 0;
//   };

//   const handleLogin = (event) => {
//     event.preventDefault();
//     if (validate()) {
//       console.log("✅ Data is valid");
//       // هنا يمكنك إضافة منطق تسجيل الدخول الفعلي
//       alert("Login successful (demo)");
//     }
//   };

//   useEffect(() => {
//     if (Object.keys(form.errors).length > 0) {
//       const timer = setTimeout(() => {
//         setForm((prev) => ({ ...prev, errors: {} }));
//       }, 6000);
//       return () => clearTimeout(timer);
//     }
//   }, [form.errors]);

//   return (
//     <div className="mainBox">
//       <div className="logoTitel">
//         <img src={logo} alt="Irshad" />
//         <h2>Login</h2>
//       </div>

//       <form onSubmit={handleLogin}>
//         <div className="inputBox">
//           <InputField
//             label="Email"
//             type="email"
//             value={form.email}
//             onChange={(e) => handleChange("email", e.target.value)}
//             error={form.errors.email}
//           />

//           <InputField
//             label="Password"
//             type="password"
//             value={form.password}
//             onChange={(e) => handleChange("password", e.target.value)}
//             error={form.errors.password}
//           />

//           <button type="submit" className="submitButton">
//             login
//           </button>

//           <div style={{ textAlign: "center", marginTop: "20px" }}>

//             {/* 👇 2. التعديل هنا: ربطنا النص بصفحة نسيان كلمة المرور */}
//             <Link to="/forgot-password" style={{ fontSize: "14px", color: "#00AEEF", textDecoration: "none" }}>
//               Forgot Password ?
//             </Link>

//             <p style={{ marginTop: "65px", fontSize: "14px" }}>
//               Don’t have an account?{" "}

//               {/* 👇 3. وهذا أيضاً نربطه بصفحة التسجيل */}
//               <Link to="/register" style={{ color: "#00AEEF", textDecoration: "none" }}>
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginCard;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginStyle.css";
import logo from "../../assets/images/logo.png";
import InputField from "./InputField";

const LoginCard = () => {
  const navigate = useNavigate(); // 2. تعريف التوجيه

  const [form, setForm] = useState({
    email: "",
    password: "",
    errors: {},
  });

  // حالة للتحميل وحالة للأخطاء القادمة من السيرفر
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: "" },
    }));
    setServerError(""); // مسح خطأ السيرفر عند الكتابة
  };

  const validate = () => {
    const errors = {};

    if (!form.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // 👇 3. دالة تسجيل الدخول المحدثة لربط الـ API
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setServerError("");

    try {
      // الاتصال بالرابط الموجود في ملف Postman
      const response = await fetch("http://192.168.1.9:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Login Successful:", data);

        // تخزين التوكن لاستخدامه في الطلبات الأخرى (Bearer Token)
        // تأكد من اسم الحقل في الاستجابة (token أو accessToken)
        if (data.token || data.accessToken) {
          localStorage.setItem("token", data.token || data.accessToken);
          localStorage.setItem("userRole", data.role); // اختياري: تخزين الدور إذا كان موجوداً
        }

        // التوجيه إلى الصفحة الرئيسية أو لوحة التحكم
        navigate("/dashboard"); // قم بتغيير المسار حسب مشروعك
      } else {
        // عرض رسالة الخطأ القادمة من الباك اند
        setServerError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setServerError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      const timer = setTimeout(() => {
        setForm((prev) => ({ ...prev, errors: {} }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [form.errors]);

  return (
    <div className="mainBox">
      <div className="logoTitel">
        <img src={logo} alt="Irshad" />
        <h2>Login</h2>
      </div>

      <form onSubmit={handleLogin}>
        <div className="inputBox">
          {/* عرض رسالة خطأ السيرفر إن وجدت */}
          {serverError && (
            <div
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "14px",
              }}
            >
              {serverError}
            </div>
          )}

          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={form.errors.email}
          />

          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={form.errors.password}
          />

          <button
            type="submit"
            className="submitButton"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Logging in..." : "login"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: "14px",
                color: "#00AEEF",
                textDecoration: "none",
              }}
            >
              Forgot Password ?
            </Link>

            <p style={{ marginTop: "65px", fontSize: "14px" }}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#00AEEF", textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;
