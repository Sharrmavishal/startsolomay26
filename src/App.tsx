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
import CommunityPage from './components/community/CommunityPage';
import MemberProfile from './components/community/MemberProfile';
import PostDetail from './components/community/PostDetail';
import CreatePost from './components/community/CreatePost';
import EventDetail from './components/community/EventDetail';
import CreateEvent from './components/community/CreateEvent';
import AdminDashboard from './components/community/AdminDashboard';
import VettingQueue from './components/community/VettingQueue';
import VettingApplicationDetail from './components/community/VettingApplicationDetail';
import AdminMemberDetail from './components/community/AdminMemberDetail';
import MemberManagement from './components/community/MemberManagement';
import AdminSettings from './components/community/AdminSettings';
import AdminAnalytics from './components/community/AdminAnalytics';
import PaymentCallback from './components/community/PaymentCallback';
import MentorDashboard from './components/community/MentorDashboard';
import CreateCourse from './components/community/CreateCourse';
import MentorCourses from './components/community/MentorCourses';
import CourseDetail from './components/community/CourseDetail';
import MentorSessionBooking from './components/community/MentorSessionBooking';
import MentorsShowcase from './components/community/MentorsShowcase';
import PaidSessionBooking from './components/community/PaidSessionBooking';
import MenteeSessions from './components/community/MenteeSessions';
import CertificateViewer from './components/community/CertificateViewer';
import NotificationManagement from './components/community/NotificationManagement';
import AuthCallback from './components/community/AuthCallback';
import ResetPassword from './components/community/ResetPassword';
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
              <Route path="/community/*" element={
                <>
                  <CommunityPage />
                </>
              } />
              <Route path="/community/members/:id" element={
                <>
                  <MemberProfile />
                </>
              } />
              <Route path="/community/forum/create" element={
                <>
                  <CreatePost />
                </>
              } />
              <Route path="/community/forum/:id" element={
                <>
                  <PostDetail />
                </>
              } />
              <Route path="/community/events" element={
                <>
                  <CommunityPage />
                </>
              } />
              <Route path="/community/events/create" element={
                <>
                  <CreateEvent />
                </>
              } />
              <Route path="/community/events/:id" element={
                <>
                  <EventDetail />
                </>
              } />
              <Route path="/community/admin" element={
                <>
                  <AdminDashboard />
                </>
              } />
              <Route path="/community/admin/vetting" element={
                <>
                  <VettingQueue />
                </>
              } />
              <Route path="/community/admin/vetting/:id" element={
                <>
                  <VettingApplicationDetail />
                </>
              } />
              <Route path="/community/admin/members" element={
                <>
                  <MemberManagement />
                </>
              } />
              <Route path="/community/admin/members/:id" element={
                <>
                  <AdminMemberDetail />
                </>
              } />
              <Route path="/community/admin/settings" element={
                <>
                  <AdminSettings />
                </>
              } />
              <Route path="/community/admin/notifications" element={
                <>
                  <NotificationManagement />
                </>
              } />
              <Route path="/community/admin/analytics" element={
                <>
                  <AdminAnalytics />
                </>
              } />
              <Route path="/community/mentor" element={
                <>
                  <MentorDashboard />
                </>
              } />
              <Route path="/community/sessions/book" element={
                <>
                  <MentorSessionBooking />
                </>
              } />
              <Route path="/community/sessions/book-paid" element={
                <>
                  <PaidSessionBooking />
                </>
              } />
              <Route path="/community/sessions/my-sessions" element={
                <>
                  <MenteeSessions />
                </>
              } />
              <Route path="/community/courses/create" element={
                <>
                  <CreateCourse />
                </>
              } />
              <Route path="/community/courses" element={
                <>
                  <MentorCourses />
                </>
              } />
              <Route path="/community/courses/:id" element={
                <>
                  <CourseDetail />
                </>
              } />
              <Route path="/community/mentors" element={
                <>
                  <MentorsShowcase />
                </>
              } />
              <Route path="/community/certificates/:id" element={
                <>
                  <CertificateViewer />
                </>
              } />
              <Route path="/community/payment/callback/:type/:id" element={
                <>
                  <PaymentCallback />
                </>
              } />
              <Route path="/community/auth/callback" element={
                <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
                  <AuthCallback />
                </Suspense>
              } />
              <Route path="/community/auth/reset-password" element={
                <ResetPassword />
              } />
      </Routes>
    </div>
  );
}

export default App;