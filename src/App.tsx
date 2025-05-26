import React, { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import CountdownTimer from './components/CountdownTimer';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ChallengesSection from './components/ChallengesSection';
import InstructorAndExpertsSection from './components/InstructorAndExpertsSection';
import CTASection from './components/CTASection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import { useContent } from './components/ContentProvider';
import SEOHead from './components/SEOHead';
import DynamicPages from './components/DynamicPages';
import StickyWhatsAppCTA from './components/StickyWhatsAppCTA';
import Quiz from './components/quiz/Quiz';

function App() {
  const { general } = useContent();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Handle scroll to section after navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        const offset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Clear the state after scrolling
        history.replaceState(null, '');
      }
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-white">
      <SEOHead />
      <Header />
      
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <ChallengesSection />
            <InstructorAndExpertsSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
            <StickyWhatsAppCTA />
          </>
        } />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/*" element={<DynamicPages />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;