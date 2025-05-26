import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { quizQuestions, getQuizResult } from './quizData';
import { QuizState } from './types';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    totalScore: 0,
    result: null,
    isComplete: false
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (points: number, selectedIndex: number) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      // Get current question ID
      const currentQuestion = quizQuestions[state.currentQuestion];
      if (!currentQuestion) {
        console.error('Current question not found');
        return;
      }
      
      const currentQuestionId = currentQuestion.id;
      
      // Update answers with both points and selectedIndex
      const newAnswers = {
        ...state.answers,
        [currentQuestionId]: {
          points,
          selectedIndex
        }
      };
      
      // Debug log for answer storage
      console.log('Storing answer:', {
        questionId: currentQuestionId,
        answer: newAnswers[currentQuestionId]
      });
      
      // Calculate new total score from points only
      const newTotalScore = Object.values(newAnswers).reduce((sum, answer) => sum + answer.points, 0);
      
      // Check if this was the last question
      if (state.currentQuestion === quizQuestions.length - 1) {
        // Get result based on total score and answers
        const result = getQuizResult(newTotalScore, newAnswers);
        
        setState({
          ...state,
          answers: newAnswers,
          totalScore: newTotalScore,
          result: result,
          isComplete: true
        });
      } else {
        setState({
          ...state,
          currentQuestion: state.currentQuestion + 1,
          answers: newAnswers,
          totalScore: newTotalScore
        });
      }
      
      setIsAnimating(false);
    }, 300);
  };

  // Get the current question
  const currentQuestion = quizQuestions[state.currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-8 md:pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-6 md:mb-8 text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-4 md:p-8">
              {!state.isComplete ? (
                <>
                  <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      No wrong answers in this quiz.
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                      We're just figuring out your next move — together.
                    </p>
                  </div>
                  <QuizProgress 
                    currentQuestion={state.currentQuestion}
                    totalQuestions={quizQuestions.length}
                  />
                  {currentQuestion && (
                    <QuizQuestion
                      question={currentQuestion}
                      onAnswer={handleAnswer}
                      isAnimating={isAnimating}
                    />
                  )}
                </>
              ) : (
                state.result && <QuizResult result={state.result} score={state.totalScore} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;