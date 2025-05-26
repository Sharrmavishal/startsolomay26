// Quiz types and interfaces
export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizOption {
  text: string;
  points: number;
}

export interface QuizAnswer {
  points: number;
  selectedIndex: number;
}

export interface Course {
  name: string;
  price: number;
  description: string;
  curriculum: string[];
  cta: string;
}

export interface QuizResult {
  stage: string;
  persona: string;
  summary: string;
  description: string;
  helpText: string;
  courses: Course[];
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<string, QuizAnswer>;
  totalScore: number;
  result: QuizResult | null;
  isComplete: boolean;
}