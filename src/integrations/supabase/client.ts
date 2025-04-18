import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qwicnjwchxcturtcxldl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aWNuandjaHhjdHVydGN4bGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTA1MzksImV4cCI6MjA1ODc2NjUzOX0.fWkKRIBhYreVURhaGt9_eTOZauTwC5ueX_zn2G-CwAk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
