import { useEffect, Suspense, lazy } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
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
import CoursePage from './components/CoursePage';
import WebinarPage from './components/WebinarPage';
import WebinarSuccessPage from './components/WebinarSuccessPage';
import AmplifyPage from './components/AmplifyPage';
import SEOHead from './components/SEOHead';
import StickyWhatsAppCTA from './components/StickyWhatsAppCTA';

// Lazy load heavy components
const HighConversionLanding = lazy(() => import('./components/HighConversionLanding'));
const DynamicPages = lazy(() => import('./components/DynamicPages'));
const Quiz = lazy(() => import('./components/quiz/Quiz'));

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
                  <SupportSection />
                  <TestimonialsSection />
                  <FAQSection />
                  <StickyWhatsAppCTA />
                  <Footer />
                </>
              } />
        <Route path="/quiz" element={
          <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
            <Quiz />
            <Footer />
          </Suspense>
        } />
        <Route path="/path/*" element={
          <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
            <DynamicPages />
            <Footer />
          </Suspense>
        } />
        <Route path="/*" element={
          <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
            <DynamicPages />
            <Footer />
          </Suspense>
        } />
              <Route path="/test-landing" element={
                <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
                  <HighConversionLanding />
                  <Footer />
                </Suspense>
              } />
              <Route path="/course" element={
                <>
                  <CoursePage />
                  <Footer />
                </>
              } />
              <Route path="/webinar" element={
                <>
                  <WebinarPage />
                  <Footer />
                </>
              } />
              <Route path="/webinar/success" element={
                <>
                  <WebinarSuccessPage />
                  <Footer />
                </>
              } />
              <Route path="/amplify" element={
                <>
                  <AmplifyPage />
                  <Footer />
                </>
              } />
      </Routes>
    </div>
  );
}

export default App;