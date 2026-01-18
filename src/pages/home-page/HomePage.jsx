// src/pages/HomePage.js
import React, { useState } from "react";
import Hero from "./Hero.jsx";
import Navbar from "./Navbar.jsx";
import HowItWorks from "./HowItWorks.jsx";
import FeaturedJobs from "./FeaturedJobs.jsx";
import Footer from "./Footer.jsx";
import { ChatIcon, ChatSidebar } from "../../Components/ChatBot/index.jsx";
import ErrorBoundary from "../../Components/ErrorBoundary.jsx";

function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="home-page-wrapper">
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedJobs />
      <Footer />

      {/* الأيقونة العائمة تظهر فقط إذا كانت الدردشة مغلقة */}
      {!isChatOpen && <ChatIcon onOpen={() => setIsChatOpen(true)} />}
      <ErrorBoundary>
        <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </ErrorBoundary>
    </div>
  );
}

export default HomePage;
