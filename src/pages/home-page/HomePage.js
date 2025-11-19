/**
 * HomePage Component
 * الصفحة الرئيسية لتطبيق Irshad
 * تتكون من عدة أقسام مستقلة: شريط التنقل، قسم البطل، طريقة العمل، الوظائف المميزة، والتذييل
 */

import Hero from "./Hero.js";
import Navbar from "./Navbar.js";
import HowItWorks from "./HowItWorks.js";
import FeaturedJobs from "./FeaturedJobs.js";
import Footer from "./Footer.js";

function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedJobs />
      <Footer />
    </div>
  );
}

export default HomePage;
