// src/pages/HomePage.js
import React, { useState } from 'react';
import Hero from "./Hero.js";
import Navbar from "./Navbar.js";
import HowItWorks from "./HowItWorks.js";
import FeaturedJobs from "./FeaturedJobs.js";
import Footer from "./Footer.js";
import { ChatIcon, ChatSidebar } from '../../Components/ChatBot';

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
      {!isChatOpen && (
        <ChatIcon onOpen={() => setIsChatOpen(true)} />
      )}
      
      {/* النافذة الجانبية */}
      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}

export default HomePage;