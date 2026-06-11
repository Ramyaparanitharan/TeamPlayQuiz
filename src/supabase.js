import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgosfolmsdrtmjdkjwyw.supabase.co';
const supabaseAnonKey = 'sb_publishable_U2AiY_-cERwbRNAqByPGbA_OPG4-oKT';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);