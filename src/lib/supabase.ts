import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

// True only when both vars are present at build time
export const supabaseConfigured = Boolean(url && key);

// Use placeholder values when env vars are absent so createClient never throws
// at module-init time (it validates that the URL is a non-empty string).
// All actual network calls are guarded by supabaseConfigured checks.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-anon-key',
);
