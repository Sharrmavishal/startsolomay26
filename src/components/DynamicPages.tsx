import React from 'react';
import { useLocation } from 'react-router-dom';
import AboutPage from './AboutPage';
import SupportPage from './SupportPage';
import BlogList from './BlogList';
import CourseOverviewSection from './CourseOverviewSection';
import PolicyPage from './PolicyPage';
import MentorRegistrationPage from './MentorRegistrationPage';
import SolosprintBootcampPage from './SolosprintBootcampPage';
import LearnPage from './learn/LearnPage';
import QuizPage from './QuizPage';
import WomenEntrepreneursPage from './WomenEntrepreneursPage';
import LaidOffEngineersPage from './LaidOffEngineersPage';
import GraduatesStudentsPage from './GraduatesStudentsPage';

const DynamicPages: React.FC = () => {
  const location = useLocation();
  const currentPage = location.pathname.substring(1);
  
  // Render the appropriate component based on the current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'support':
        return <SupportPage />;
      case 'blog':
        return <BlogList />;
      case 'learn':
        return <LearnPage />;
      case 'join-mentor':
        return <MentorRegistrationPage />;
      case 'solosprint-bootcamp':
        return <SolosprintBootcampPage />;
      case 'quiz':
        return <QuizPage />;
      case 'path/women-entrepreneurs':
        return <WomenEntrepreneursPage />;
      case 'path/laid-off-engineers':
        return <LaidOffEngineersPage />;
      case 'path/graduates-students':
        return <GraduatesStudentsPage />;
      case 'course':
        return (
          <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <CourseOverviewSection />
              </div>
            </div>
          </div>
        );
      case 'policies/privacy':
        return <PolicyPage type="privacy" />;
      case 'policies/terms':
        return <PolicyPage type="terms" />;
      case 'policies/refund':
        return <PolicyPage type="refund" />;
      default:
        return null;
    }
  };
  
  return renderPageContent();
};

export default DynamicPages;