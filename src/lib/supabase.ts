'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | undefined;

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
      throw new Error('Supabase environment variables are missing');
    }
    // Return a proxy or dummy client during build to prevent crashes
    return new Proxy({} as SupabaseClient, {
      get: () => () => {
        console.warn('Supabase client called during build or without configuration');
        return { data: { session: null, user: null }, error: null };
      }
    });
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
}

// Export a getter or a proxy to prevent top-level execution crash
export const supabase = getSupabaseBrowserClient();