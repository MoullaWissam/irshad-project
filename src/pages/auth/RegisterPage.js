import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./RegisterPage.css";
import logo from "../../assets/images/logo-signin.svg";
import EmployeeForm from "./EmployeeForm";
import CompanyForm from "./CompanyForm";
import { handleSubmitLogic } from "./handleSubmit";
import { Link } from "react-router-dom"; 
const RegisterPage = () => {
  const [activeForm, setActiveForm] = useState("employee");

  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    photo: null,
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
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
    const update = { [name]: value };

    if (activeForm === "employee") {
      setEmployeeData((prev) => ({ ...prev, ...update }));
    } else {
      setCompanyData((prev) => ({ ...prev, ...update }));
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (activeForm === "employee")
      setEmployeeData({ ...employeeData, photo: file });
    else setCompanyData({ ...companyData, photo: file });
  };

  const handleSubmit = () => {
    handleSubmitLogic(activeForm, employeeData, companyData, setErrors);
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

        <button type="submit" className="signup-btn" onClick={handleSubmit}>
          Sign up
        </button>

        <p className="signin">
            Already have an account? <Link to="/login">Sign In</Link></p>
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
