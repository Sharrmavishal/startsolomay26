import { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HighConversionLanding from './components/HighConversionLanding';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PathSelectionSection from './components/PathSelectionSection';
import WorkshopMentorshipSection from './components/WorkshopMentorshipSection';
import InstructorAndExpertsSection from './components/InstructorAndExpertsSection';
import LeadMagnetSection from './components/LeadMagnetSection';
import SupportSection from './components/SupportSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import DynamicPages from './components/DynamicPages';
import StickyWhatsAppCTA from './components/StickyWhatsAppCTA';
import Quiz from './components/quiz/Quiz';

function App() {
  const location = useLocation();

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
            <PathSelectionSection />
            <WorkshopMentorshipSection />
            <InstructorAndExpertsSection />
            <LeadMagnetSection />
            <TestimonialsSection />
            <SupportSection />
            <FAQSection />
            <StickyWhatsAppCTA />
            <Footer />
          </>
        } />
        <Route path="/quiz" element={
          <>
            <Quiz />
            <Footer />
          </>
        } />
        <Route path="/path/*" element={
          <>
            <DynamicPages />
            <Footer />
          </>
        } />
        <Route path="/*" element={
          <>
            <DynamicPages />
            <Footer />
          </>
        } />
        <Route path="/test-landing" element={
          <>
            <HighConversionLanding />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;