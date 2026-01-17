import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface UserReward {
  id: string;
  wallet_address: string;
  referral_code: string;
  total_referrals: number;
  total_earned: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_address: string;
  referred_address: string;
  referral_code: string;
  earned_amount: number;
  status: string;
  created_at: string;
}

export interface Insight {
  id: string;
  user_address: string;
  query: string;
  category: string;
  model: string;
  answer: string;
  cost: number;
  tx_hash: string;
  points_earned: number;
  created_at: string;
}
