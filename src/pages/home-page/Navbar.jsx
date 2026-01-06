import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { FaGlobe } from "react-icons/fa";

function Navbar({ isAuthenticated, logout }) {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang).then(() => {
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    });
    closeMenu();
  };

  const navItems = [
    { path: "/", label: t("Home") },
    { path: "/about", label: t("About") },
    { path: "/services", label: t("Services") },
    { path: "/contact", label: t("Contact") },
  ];

  const authNavItems = isAuthenticated
    ? [
        { path: "/matches", label: t("Matches") },
        { path: "/upload", label: t("Upload Resume") },
        { path: "/settings", label: t("Settings") },
      ]
    : [];

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Irshad Logo" />
        </Link>
      </div>
      
      <button 
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label={t("Toggle menu")}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            onClick={closeMenu}
            className={`nav-link ${activeLink === item.path ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
        
        {isAuthenticated && (
          <div className="auth-links-group">
            {authNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`nav-link ${activeLink === item.path ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
        
        {/* زر الترجمة داخل قائمة الهامبرجر للشاشات الصغيرة */}
        <div className="mobile-language-switcher">
          <button 
            onClick={toggleLanguage} 
            className="language-switcher-btn mobile"
            title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <FaGlobe className="globe-icon" />
            <span className="toggle-icon">
              {i18n.language === 'ar' ? '⇄' : '⇄'}
            </span>
          </button>
        </div>
        
        {/* أزرار المصادقة داخل قائمة الهامبرجر للشاشات الصغيرة */}
        <div className="mobile-auth-buttons">
          {isAuthenticated ? (
            <div className="mobile-user-menu">
              <Link to="/settings" onClick={closeMenu} className="mobile-user-name-link">
                <span className="mobile-user-name">
                  {t("Welcome")}, User
                </span>
              </Link>
              <button onClick={() => { logout(); closeMenu(); }} className="mobile-logout-btn">
                {t("Logout")}
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={closeMenu} className="mobile-login-link">
              <button className="mobile-login-btn">{t("Login")}</button>
            </Link>
          )}
        </div>
      </nav>
      
      {/* أزرار سطح المكتب (تظهر فقط على الشاشات الكبيرة) */}
      <div className="desktop-utility-buttons">
        <div className="language-switcher-container">
          <button 
            onClick={toggleLanguage} 
            className="language-switcher-btn desktop"
            title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <FaGlobe className="globe-icon" />
            <span className="toggle-icon">
              {i18n.language === 'ar' ? '⇄' : '⇄'}
            </span>
          </button>
        </div>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/settings" className="user-name-link">
                <span className="user-name">
                  {t("Welcome")}, User
                </span>
              </Link>
              <button onClick={logout} className="logout-btn">
                {t("Logout")}
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              <button className="login-btn">{t("Login")}</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;