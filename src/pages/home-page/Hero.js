import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
// 👇 استيراد الصورة
import heroImage from "../../assets/images/mainHomeImage.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Find Your Future <br /> with Irshad
        </h1>
        <p>
          An AI-driven pathway to professional excellence, connecting talented
          employees with great companies.
        </p>
        <div className="hero-buttons">
          <Link to="/register">
            <button className="btn btn-purple">I am a job seeker</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-blue">I am a company</button>
          </Link>
        </div>
      </div>

      <div className="hero-image">
        {/* 👇 استخدام الصورة المستوردة */}
        <img
          src={heroImage}
          alt="Hero illustration"
          className="hero-img"
        />
      </div>
    </section>
  );
}

export default Hero;