import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables - only throw if not in build environment or phase
if (!supabaseUrl || !supabaseServiceRoleKey) {
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE && !process.env.OPEN_NEXT) {
    console.warn('Configuration warning: Supabase admin variables are missing');
  }
}

const FETCH_TIMEOUT_MS = 5000;

// Create client with fallbacks for build time compatibility
export const supabaseAdminClient = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));
      },
    },
  });
