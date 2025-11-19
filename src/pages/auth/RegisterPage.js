import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; 

import "./RegisterPage.css";
import logo from "../../assets/images/logo-signin.svg";
import EmployeeForm from "./EmployeeForm";
import CompanyForm from "./CompanyForm";

const RegisterPage = () => {
  const navigate = useNavigate(); 
  const [activeForm, setActiveForm] = useState("employee");
  const [isLoading, setIsLoading] = useState(false); 

  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",      
    birthDate: "",  
    photo: null,
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",          
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    let url = "";

    if (activeForm === "employee") {
      url = "http://192.168.1.109:3000/auth/register";
      
      formData.append("firstName", employeeData.firstName);
      formData.append("lastName", employeeData.lastName);
      formData.append("email", employeeData.email);
      formData.append("password", employeeData.password);
      formData.append("birthDate", employeeData.birthDate || "2000-01-01"); 
      
      if (employeeData.photo) {
        formData.append("profileImage", employeeData.photo);
      }
      
    } else {
      url = "http://192.168.1.109:3000/company-management/company-register";
      
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
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration Successful:", data);
        navigate("/verfiy-email"); 
      } else {
        console.error("Registration Failed:", data);
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
            disabled={isLoading} 
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

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
