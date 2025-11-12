/**
 * Footer Component
 * مكون التذييل للصفحة الرئيسية
 * يحتوي على شعار، روابط مساعدة، أيقونات التواصل، وصورة جانبية
 * يعرض حقوق النشر في الأسفل
 */

import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* القسم الأول: شعار Irshad + وصف مختصر */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/footerLogo.png" alt="Irshad Logo" />
          </div>
          <p>
            Guiding careers and {<br />}empowering companies with the right
            matches
          </p>
        </div>

        {/* القسم الثاني: روابط مساعدة */}
        <div className="footer-links">
          <h4>Help Links</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* القسم الثالث: روابط التواصل الاجتماعي */}
        <div className="footer-social">
          <h4>Follow us</h4>
          <div className="social-icons">
            <a href="#">
              <img src="/facebook.png" alt="Facebook" />
            </a>
            <a href="#">
              <img src="/gmail.png" alt="Google" />
            </a>
            <a href="#">
              <img src="/instagram.png" alt="Instagram" />
            </a>
            <a href="#">
              <img src="/youtube.png" alt="YouTube" />
            </a>
          </div>
        </div>

        {/* القسم الرابع: صورة جانبية متحركة */}
        <div className="footer-extra">
          <img src="/robot.gif" alt="Bot" />
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Irshad. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
