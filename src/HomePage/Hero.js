import React from "react";
import "./Hero.css";

// (Hero Section) – أول قسم بارز في الصفحة
function Hero() {
  return (
    <section className="hero">
      {/* الجزء النصي (العنوان + الوصف + الأزرار) */}
      <div className="hero-text">
        {/* العنوان الرئيسي */}
        <h1>
          Find Your Future <br /> with Irshad
        </h1>

        {/* النص الوصفي */}
        <p>
          An AI-driven pathway to professional excellence, connecting talented
          employees with great companies.
        </p>

        {/* الأزرار (CTA) */}
        <div className="hero-buttons">
          <button className="btn btn-purple">I am a job seeker</button>
          <button className="btn btn-blue">I am a company</button>
        </div>
      </div>

      {/* الجزء الخاص بالصورة الجانبية */}
      <div className="hero-image">
        <img
          src="/mainHomeImage.png"
          alt="Hero illustration"
          className="hero-img"
        />
      </div>
    </section>
  );
}

export default Hero;
