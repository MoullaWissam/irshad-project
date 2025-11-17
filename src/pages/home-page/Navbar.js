import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
// 👇 1. استيراد الصورة من مجلد assets
import logo from "../../assets/images/logo.png"; 

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        {/* 👇 2. استخدام المتغير logo بدلاً من النص */}
        <img src={logo} alt="Irshad Logo" />
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Link to="/login">
        <button className="login-btn">Login</button>
      </Link>
    </header>
  );
}

export default Navbar;