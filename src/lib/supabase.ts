// Env vars are baked in at build time by CRA — trigger a fresh Vercel build to pick them up.
import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

// True only when both vars are present at build time
export const supabaseConfigured = Boolean(url && key);

if (!url || !key) {
  console.error(
    '[thepour] Supabase env vars missing at build time.\n' +
    '  REACT_APP_SUPABASE_URL: ' + (url ? 'set' : 'MISSING') + '\n' +
    '  REACT_APP_SUPABASE_ANON_KEY: ' + (key ? 'set' : 'MISSING') + '\n' +
    'These must be present when `npm run build` runs (CRA bakes them in at build time, not runtime).'
  );
}

console.log('[supabase] URL:', url ? url.slice(0, 40) : 'MISSING', '| key present:', !!key);

// Use placeholder values when env vars are absent so createClient never throws
// at module-init time (it validates that the URL is a non-empty string).
// All actual network calls are guarded by supabaseConfigured checks.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-anon-key',
);
