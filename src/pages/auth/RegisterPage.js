// import React, { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";

// import "./RegisterPage.css";
// import logo from "../../assets/images/logo-signin.svg";
// import EmployeeForm from "./EmployeeForm";
// import CompanyForm from "./CompanyForm";
// import { handleSubmitLogic } from "./handleSubmit";
// import { Link } from "react-router-dom"; 
// const RegisterPage = () => {
//   const [activeForm, setActiveForm] = useState("employee");

//   const [employeeData, setEmployeeData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phone: "",
//     photo: null,
//   });

//   const [companyData, setCompanyData] = useState({
//     companyName: "",
//     companyPassword: "",
//     companyAddress: "",
//     website: "",
//     photo: null,
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       const timer = setTimeout(() => setErrors({}), 6000);
//       return () => clearTimeout(timer);
//     }
//   }, [errors]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const update = { [name]: value };

//     if (activeForm === "employee") {
//       setEmployeeData((prev) => ({ ...prev, ...update }));
//     } else {
//       setCompanyData((prev) => ({ ...prev, ...update }));
//     }
//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (activeForm === "employee")
//       setEmployeeData({ ...employeeData, photo: file });
//     else setCompanyData({ ...companyData, photo: file });
//   };

//   const handleSubmit = () => {
//     handleSubmitLogic(activeForm, employeeData, companyData, setErrors);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSubmit(); 
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="left-section">
//         <img className="logo" src={logo} alt="Irshad" />
//         <h2>Start your journey</h2>
//         <p>Register as an employee or a company, and let us guide you</p>

//         <div className="buttons">
//           <button
//             className={activeForm === "employee" ? "active" : ""}
//             onClick={() => setActiveForm("employee")}
//           >
//             Employee
//           </button>
//           <button
//             className={activeForm === "company" ? "active" : ""}
//             onClick={() => setActiveForm("company")}
//           >
//             Company
//           </button>
//         </div>

//         <button type="submit" className="signup-btn" onClick={handleSubmit}>
//           Sign up
//         </button>

//         <p className="signin">
//             Already have an account? <Link to="/login">Sign In</Link></p>
//       </div>

//       <div className="right-section" onKeyDown={handleKeyDown}>
//         <div className="formWrapper">
//           <AnimatePresence mode="wait">
//             {activeForm === "employee" ? (
//               <motion.div
//                 key="employee"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//               >
//                 <EmployeeForm
//                   data={employeeData}
//                   errors={errors}
//                   onChange={handleChange}
//                   onFileChange={handleFileChange}
//                 />
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="company"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//               >
//                 <CompanyForm
//                   data={companyData}
//                   errors={errors}
//                   onChange={handleChange}
//                   onFileChange={handleFileChange}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // 1. استيراد useNavigate

import "./RegisterPage.css";
import logo from "../../assets/images/logo-signin.svg";
import EmployeeForm from "./EmployeeForm";
import CompanyForm from "./CompanyForm";
// لم نعد بحاجة لاستيراد handleSubmitLogic لأننا سنكتب المنطق هنا

const RegisterPage = () => {
  const navigate = useNavigate(); // 2. لتهيئة التوجيه
  const [activeForm, setActiveForm] = useState("employee");
  const [isLoading, setIsLoading] = useState(false); // حالة للتحميل

  // 3. تحديث البيانات لتطابق الـ API
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",      // ملاحظة: الـ API لا يطلب هذا الحقل في التسجيل، لكن يمكن تركه
    birthDate: "",  // إضافته لأنه مطلوب في الـ API
    photo: null,
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",          // إضافته لأنه ضروري ومطلوب في الـ API
    companyPassword: "",
    companyAddress: "",
    website: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 6000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // منطق بسيط للتعامل مع تحديث الحالة بناءً على النموذج النشط
    if (activeForm === "employee") {
      setEmployeeData((prev) => ({ ...prev, [name]: value }));
    } else {
      setCompanyData((prev) => ({ ...prev, [name]: value }));
    }
    
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (activeForm === "employee")
      setEmployeeData({ ...employeeData, photo: file });
    else setCompanyData({ ...companyData, photo: file });
  };

  // 4. دالة الإرسال الجديدة المربوطة بالـ API
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    let url = "";

    // تجهيز البيانات بناءً على نوع النموذج
    if (activeForm === "employee") {
      url = "http://localhost:3000/auth/register";
      
      // مطابقة حقول الـ API للموظف
      formData.append("firstName", employeeData.firstName);
      formData.append("lastName", employeeData.lastName);
      formData.append("email", employeeData.email);
      formData.append("password", employeeData.password);
      formData.append("birthDate", employeeData.birthDate || "2000-01-01"); // قيمة افتراضية إذا لم يدخلها المستخدم
      
      if (employeeData.photo) {
        formData.append("profileImage", employeeData.photo);
      }
      
    } else {
      url = "http://localhost:3000/company-management/company-register";
      
      // مطابقة حقول الـ API للشركة
      formData.append("companyName", companyData.companyName);
      formData.append("email", companyData.email);
      formData.append("password", companyData.companyPassword);
      formData.append("companyLocation", companyData.companyAddress);
      formData.append("companyWebsite", companyData.website);
      
      if (companyData.photo) {
        formData.append("companyLogo", companyData.photo);
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData, // إرسال FormData لأن الـ API يتوقع ملفات
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration Successful:", data);
        alert("Registration Successful! Please Login.");
        navigate("/login"); // التوجيه لصفحة الدخول
      } else {
        console.error("Registration Failed:", data);
        // عرض رسالة الخطأ القادمة من السيرفر
        setErrors({ general: data.message || "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Network Error:", error);
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="register-container">
      <div className="left-section">
        <img className="logo" src={logo} alt="Irshad" />
        <h2>Start your journey</h2>
        <p>Register as an employee or a company, and let us guide you</p>

        <div className="buttons">
          <button
            className={activeForm === "employee" ? "active" : ""}
            onClick={() => setActiveForm("employee")}
          >
            Employee
          </button>
          <button
            className={activeForm === "company" ? "active" : ""}
            onClick={() => setActiveForm("company")}
          >
            Company
          </button>
        </div>

        <button 
            type="submit" 
            className="signup-btn" 
            onClick={handleSubmit}
            disabled={isLoading} // تعطيل الزر أثناء التحميل
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        {/* عرض رسالة خطأ عامة إن وجدت */}
        {errors.general && <p style={{ color: "red", marginTop: "10px" }}>{errors.general}</p>}

        <p className="signin">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>

      <div className="right-section" onKeyDown={handleKeyDown}>
        <div className="formWrapper">
          <AnimatePresence mode="wait">
            {activeForm === "employee" ? (
              <motion.div
                key="employee"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <EmployeeForm
                  data={employeeData}
                  errors={errors}
                  onChange={handleChange}
                  onFileChange={handleFileChange}
                />
              </motion.div>
            ) : (
              <motion.div
                key="company"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CompanyForm
                  data={companyData}
                  errors={errors}
                  onChange={handleChange}
                  onFileChange={handleFileChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;