import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GoalRow = {
  id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  monthly_saving: number;
  icon: string;
  color: string;
  created_at: string;
};

export type ChatMessageRow = {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  text: string;
  created_at: string;
};

export type BudgetPlanRow = {
  id: string;
  salary: number;
  city: string;
  rent: number;
  travel: number;
  remittance: number;
  has_loans: boolean;
  loan_emi: number;
  result: Record<string, unknown>;
  created_at: string;
};

export type EmiAnalysisRow = {
  id: string;
  product_cost: number;
  down_payment: number;
  monthly_emi: number;
  months: number;
  processing_fee: number;
  salary: number;
  result: Record<string, unknown>;
  created_at: string;
};
