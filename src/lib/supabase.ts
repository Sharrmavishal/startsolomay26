import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QuizLead {
  name: string;
  email: string;
  quiz_stage: string;
  quiz_persona: string;
  quiz_score: number;
  opt_in: boolean;
}

export const saveQuizLead = async (lead: QuizLead) => {
  try {
    // Validate required fields
    if (!lead.name || !lead.email || !lead.quiz_stage || !lead.quiz_persona) {
      console.error('Missing required fields:', lead);
      throw new Error('Missing required fields');
    }

    // Clean and validate data
    const cleanLead = {
      ...lead,
      name: lead.name.trim(),
      email: lead.email.trim().toLowerCase(),
      quiz_score: Number(lead.quiz_score),
      opt_in: Boolean(lead.opt_in)
    };

    console.log('Attempting to save quiz lead:', cleanLead);

    const { data, error } = await supabase
      .from('quiz_leads')
      .insert([cleanLead])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Quiz lead saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error saving quiz lead:', error);
    throw error;
  }
};