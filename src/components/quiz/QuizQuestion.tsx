import React from 'react';
import { QuizQuestion as QuestionType } from './types';

interface QuizQuestionProps {
  question: QuestionType;
  onAnswer: (points: number, selectedIndex: number) => void;
  isAnimating: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer, isAnimating }) => {
  if (!question || !question.text || !question.options) {
    console.error('Invalid question data:', question);
    return null;
  }

  // Add debug logging for selections
  const handleOptionClick = (points: number, index: number) => {
    console.log('Option selected:', {
      questionId: question.id,
      selectedIndex: index,
      points: points
    });
    onAnswer(points, index);
  };

  return (
    <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <h3 className="text-xl font-bold text-brand-navy mb-6">{question.text}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option.points, index)}
            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-secondary hover:bg-secondary-light/5 transition-all duration-200"
          >
            <span className="text-gray-700">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;