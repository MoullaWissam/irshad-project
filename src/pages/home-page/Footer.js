import React from "react";
import { Link } from "react-router-dom"; // إذا كنت تستخدم Link
import "./Footer.css";

// 👇 استيراد الصور
import footerLogo from "../../assets/images/footerLogo.png";
import robotGif from "../../assets/images/robot.gif";
// استيراد أيقونات التواصل من مجلد icons
import facebook from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instagram from "../../assets/icons/instagram.png";
import youtube from "../../assets/icons/youtube.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
             {/* 👇 استخدام الشعار المستورد */}
            <img src={footerLogo} alt="Irshad Logo" />
          </div>
          {/* 👇 إصلاح خطأ الأقواس الذي ذكرته سابقاً أيضاً */}
          <p>
            Guiding careers and <br /> empowering companies with the right
            matches
          </p>
        </div>

        <div className="footer-links">
          <h4>Help Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow us</h4>
          <div className="social-icons">
            {/* 👇 استخدام الأيقونات المستوردة */}
            <a href="#"><img src={facebook} alt="Facebook" /></a>
            <a href="#"><img src={gmail} alt="Google" /></a>
            <a href="#"><img src={instagram} alt="Instagram" /></a>
            <a href="#"><img src={youtube} alt="YouTube" /></a>
          </div>
        </div>

        <div className="footer-extra">
          {/* 👇 استخدام الروبوت المستورد */}
          <img src={robotGif} alt="Bot" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Irshad. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;