/**
 * Navbar Component
 * مكون شريط التنقل في الصفحة الرئيسية
 * يحتوي على شعار، روابط تنقل، وزر تسجيل الدخول
 * يتغير شكله عند التمرير للأسفل (scroll)
 */

import React, { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  // حالة لتحديد إذا تم التمرير للأسفل
  const [scrolled, setScrolled] = useState(false);

  // مراقبة التمرير وتحديث الحالة
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // عرض شريط التنقل مع تغيير الكلاس حسب حالة التمرير
  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <img src="/logo.png" alt="Irshad Logo" />
      </div>
      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Jobs</a>
        <a href="#">Contact</a>
      </nav>
      <button className="login-btn">Login</button>
    </header>
  );
}

export default Navbar;
