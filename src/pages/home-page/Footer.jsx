// Footer.js - بعد التعديل

import React from "react";
import { useTranslation } from "react-i18next"; // 👈 استيراد الخطاف
import "./Footer.css";

// استيراد الصور
import footerLogo from "../../assets/images/footerLogo1.png";
import robotGif from "../../assets/images/Welcom.gif";
import facebook from "../../assets/icons/facebook.png";
import gmail from "../../assets/icons/gmail.png";
import instagram from "../../assets/icons/instagram.png";
import youtube from "../../assets/icons/youtube.png";

function Footer() {
  const { t } = useTranslation(); // 👈 استخدام الخطاف
  const currentYear = new Date().getFullYear();

  return (
    <footer className="irshad-footer">
      <div className="irshad-footer-container">
        <div className="irshad-footer-brand">
          <div className="irshad-footer-logo">
            <img
              src={footerLogo}
              alt="Irshad Logo"
              style={{
                width: "300px",
                height: "auto",
                maxWidth: "100%",
              }}
            />{" "}
          </div>
          <p>
            {/* النص الوصفي */}
            {t(
              "Guiding careers and empowering companies with the right matches"
            )}
          </p>
        </div>

        <div className="irshad-footer-links">
          {/* عنوان الروابط */}
          <h4>{t("Help Links")}</h4>
          <ul>
            {/* استخدام مفاتيح الروابط المترجمة */}
            <li>
              <a href="#">{t("About Us")}</a>
            </li>
            <li>
              <a href="#">{t("Services")}</a>
            </li>
            <li>
              <a href="#">{t("Privacy Policy")}</a>
            </li>
          </ul>
        </div>

        <div className="irshad-footer-social">
          {/* عنوان وسائل التواصل */}
          <h4>{t("Follow us")}</h4>
          <div className="irshad-social-icons">
            <a href="#">
              <img src={facebook} alt="Facebook" />
            </a>
            <a href="#">
              <img src={gmail} alt="Google" />
            </a>
            <a href="#">
              <img src={instagram} alt="Instagram" />
            </a>
            <a href="#">
              <img src={youtube} alt="YouTube" />
            </a>
          </div>
        </div>

        <div className="irshad-footer-extra">
          <img src={robotGif} alt="Bot" />
        </div>
      </div>

      <div className="irshad-footer-bottom">
        {/* نص حقوق النشر مع تمرير قيمة السنة (year) */}
        <p>{t("Copyright", { year: currentYear })}</p>
      </div>
    </footer>
  );
}

export default Footer;
