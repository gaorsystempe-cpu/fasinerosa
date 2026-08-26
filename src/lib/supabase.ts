import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl: string = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('tu-proyecto')
);

export const supabase: SupabaseClient<any, any, any> | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'la_facinerosa',
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
