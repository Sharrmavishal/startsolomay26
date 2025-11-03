import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  correct_answer?: string;
  points: number;
  order_index: number;
}

interface QuizSubmission {
  id?: string;
  answers: Record<string, string>;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  is_passed: boolean;
  submitted_at?: string;
}

interface CourseQuizProps {
  lessonId: string;
  enrollmentId: string;
  studentId: string;
  onComplete?: () => void;
}

const CourseQuiz: React.FC<CourseQuizProps> = ({
  lessonId,
  enrollmentId,
  studentId,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [startTime] = useState(Date.now());
  const [hasPreviousSubmission, setHasPreviousSubmission] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [lessonId, enrollmentId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      
      // Load questions
      const { data: quizQuestions, error: questionsError } = await supabase
        .from('course_quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (questionsError) throw questionsError;

      setQuestions(quizQuestions || []);

      // Check for previous submission
      const { data: prevSubmission } = await supabase
        .from('course_quiz_submissions')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('enrollment_id', enrollmentId)
        .maybeSingle();

      if (prevSubmission) {
        setHasPreviousSubmission(true);
        setSubmission({
          id: prevSubmission.id,
          answers: prevSubmission.answers,
          total_questions: prevSubmission.total_questions,
          correct_answers: prevSubmission.correct_answers,
          score_percentage: parseFloat(prevSubmission.score_percentage.toString()),
          is_passed: prevSubmission.is_passed,
          submitted_at: prevSubmission.submitted_at,
        });
        setAnswers(prevSubmission.answers);
      }
    } catch (error: any) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    try {
      setSubmitting(true);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const { data: submissionData, error: submitError } = await supabase
        .from('course_quiz_submissions')
        .upsert({
          lesson_id: lessonId,
          enrollment_id: enrollmentId,
          student_id: studentId,
          answers,
          passing_score_percentage: 70.00,
          time_taken_seconds: timeTaken,
        }, {
          onConflict: 'enrollment_id,lesson_id',
        })
        .select()
        .single();

      if (submitError) throw submitError;

      setSubmission({
        id: submissionData.id,
        answers: submissionData.answers,
        total_questions: submissionData.total_questions,
        correct_answers: submissionData.correct_answers,
        score_percentage: parseFloat(submissionData.score_percentage.toString()),
        is_passed: submissionData.is_passed,
        submitted_at: submissionData.submitted_at,
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCorrectAnswer = (question: QuizQuestion): string => {
    if (question.question_type === 'short_answer') {
      return question.correct_answer || '';
    }
    const correctOption = question.options.find(opt => opt.is_correct);
    return correctOption?.id || '';
  };

  const isAnswerCorrect = (question: QuizQuestion, answer: string): boolean => {
    if (question.question_type === 'short_answer') {
      return answer.toLowerCase().trim() === (question.correct_answer || '').toLowerCase().trim();
    }
    const correctOption = question.options.find(opt => opt.is_correct);
    return answer === correctOption?.id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <p>No quiz questions found for this lesson.</p>
        </div>
      </div>
    );
  }

  // Show results if submitted
  if (submission) {
    return (
      <div className="space-y-6">
        <div className={`rounded-lg p-6 ${
          submission.is_passed 
            ? 'bg-green-50 border-2 border-green-500' 
            : 'bg-red-50 border-2 border-red-500'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {submission.is_passed ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                submission.is_passed ? 'text-green-800' : 'text-red-800'
              }`}>
                {submission.is_passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
              </h3>
              <p className={`text-sm ${
                submission.is_passed ? 'text-green-700' : 'text-red-700'
              }`}>
                {submission.is_passed 
                  ? 'Congratulations! You passed the quiz.' 
                  : `You need ${submission.is_passed ? '0' : '70'}% to pass. Try again!`}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#1D3A6B]">{submission.score_percentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#1D3A6B]">{submission.correct_answers}/{submission.total_questions}</div>
              <div className="text-xs text-gray-600">Correct</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#1D3A6B]">{Math.floor((submission.time_taken_seconds || 0) / 60)}m</div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
          </div>
        </div>

        {/* Review Questions */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Review Your Answers</h4>
          {questions.map((question, idx) => {
            const userAnswer = submission.answers[question.id];
            const correct = isAnswerCorrect(question, userAnswer);
            const correctAnswerId = getCorrectAnswer(question);
            
            return (
              <div key={question.id} className={`border rounded-lg p-4 ${
                correct ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
              }`}>
                <div className="flex items-start gap-2 mb-3">
                  {correct ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Question {idx + 1}: {question.question_text}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Points: {question.points}</p>
                  </div>
                </div>
                
                {question.question_type === 'short_answer' ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Your answer: </span>
                      <span className="text-sm">{userAnswer || '(No answer)'}</span>
                    </div>
                    {!correct && (
                      <div>
                        <span className="text-sm font-medium text-green-700">Correct answer: </span>
                        <span className="text-sm text-green-700">{question.correct_answer}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const isSelected = option.id === userAnswer;
                      const isCorrect = option.id === correctAnswerId;
                      
                      return (
                        <div
                          key={option.id}
                          className={`px-3 py-2 rounded ${
                            isCorrect
                              ? 'bg-green-100 border border-green-300'
                              : isSelected && !isCorrect
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="text-xs font-medium">
                                {isCorrect ? '✓ Correct' : '✗ Your Answer'}
                              </span>
                            )}
                            {isCorrect && !isSelected && (
                              <span className="text-xs font-medium text-green-700">Correct Answer</span>
                            )}
                            <span className="text-sm">{option.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submission.is_passed && (
          <button
            onClick={() => {
              setSubmission(null);
              setAnswers({});
            }}
            className="w-full bg-[#1D3A6B] text-white px-6 py-3 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  // Show quiz form
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Quiz Instructions</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1 ml-7">
          <li>• Answer all {questions.length} questions</li>
          <li>• You need 70% to pass</li>
          <li>• You can retake the quiz if you don't pass</li>
          <li>• Passing the quiz will mark this lesson as complete</li>
        </ul>
      </div>

      <div className="space-y-6">
        {questions.map((question, idx) => (
          <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1D3A6B] text-white text-xs font-bold px-2 py-1 rounded">
                  {idx + 1}
                </span>
                <span className="text-xs text-gray-500">{question.points} point{question.points !== 1 ? 's' : ''}</span>
              </div>
              <p className="font-medium text-gray-900">{question.question_text}</p>
            </div>

            {question.question_type === 'short_answer' ? (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            ) : (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      answers[question.id] === option.id
                        ? 'border-[#1D3A6B] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="text-[#1D3A6B] focus:ring-[#1D3A6B]"
                    />
                    <span className="flex-1">{option.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {Object.keys(answers).length} of {questions.length} questions answered
        </p>
        <button
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length < questions.length}
          className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default CourseQuiz;

