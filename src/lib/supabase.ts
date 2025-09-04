// Supabase removed. Stub for quiz lead saving provided below.

export interface QuizLead {
  name: string;
  email: string;
  quiz_stage: string;
  quiz_persona: string;
  quiz_score: number;
  opt_in: boolean;
}

export const saveQuizLead = async (lead: QuizLead) => {
  console.log('Supabase integration removed. Quiz lead would be saved to Netlify form:', lead);
  return Promise.resolve([{ id: 'mock-id', ...lead }]);
};