import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// The '!' non-null assertion is safe here because we require these keys for the app to run.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);