import React from 'react';
import { ArrowLeft, Brain, Target, Rocket, RefreshCcw, ArrowRight } from 'lucide-react';
import MentorshipSection from './MentorshipSection';
import { useNavigate } from 'react-router-dom';
import { quizResults } from '../quiz/quizData';

const LearnPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    navigate('/quiz');
  };

  // Flatten all courses from all stages
  const allCourses = quizResults.flatMap((stage, stageIndex) => {
    return stage.courses.map(course => ({
      ...course,
      stage: stage.stage,
      stageIndex
    }));
  });

  const getStageIcon = (stageIndex: number) => {
    switch(stageIndex) {
      case 0: return <Brain className="h-12 w-12 text-primary" />;
      case 1: return <Target className="h-12 w-12 text-primary" />;
      case 2: return <Rocket className="h-12 w-12 text-primary" />;
      case 3: return <Rocket className="h-12 w-12 text-primary" />;
      case 4: return <RefreshCcw className="h-12 w-12 text-primary" />;
      default: return <Brain className="h-12 w-12 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-gray-50)] pt-20">
      <div className="container mx-auto px-4">
        <a 
          href="/" 
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
        </a>

        {/* Hero Section */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12">
          <img
            src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1743180328/Learn_page_content_ewd61z.png"
            alt="Start Solo Learning Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center text-center">
            <div className="max-w-3xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                learn. launch. lead
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Explore action-focused WhatsApp sprints and mentorships designed to take you from idea to income—one solo step at a time
              </p>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[color:var(--color-gray-900)] mb-8 text-center">Explore Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allCourses.map((course, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg border border-[color:var(--color-gray-100)] overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {getStageIcon(course.stageIndex)}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-primary mb-1">{course.stage}</div>
                      <h3 className="text-xl font-bold text-[color:var(--color-gray-900)]">{course.name}</h3>
                    </div>
                  </div>

                  <p className="text-[color:var(--color-gray-900)] mb-4">{course.description}</p>

                  <div className="bg-[color:var(--color-gray-50)] p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-[color:var(--color-gray-900)] mb-4">Course Curriculum:</h4>
                    <div className="space-y-4">
                      {course.curriculum.map((item, i) => (
                        <div key={i} className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-[color:var(--color-gray-900)]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-[color:var(--color-gray-900)]">
                      ₹{course.price}
                    </div>
                    <a
                      href={course.ctaUrl}
                      className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {course.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz CTA Section - More Compact */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg p-6 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[color:var(--color-gray-900)] mb-1">
                Not Sure Where to Begin?
              </h2>
              <p className="text-[color:var(--color-gray-900)]">
                Take our quick quiz to discover your solopreneur stage
              </p>
            </div>
            <button
              onClick={handleQuizClick}
              className="flex-shrink-0 inline-flex items-center bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition ml-4"
            >
              Take the Quiz <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mentorship Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[color:var(--color-gray-900)] mb-8 text-center">Work with a Mentor</h2>
          <MentorshipSection />
        </div>
      </div>
    </div>
  );
};

export default LearnPage;