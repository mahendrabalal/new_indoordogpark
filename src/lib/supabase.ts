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
    // Return a robust recursive proxy during build to prevent crashes on nested calls
    const createSafeProxy = (label: string): any => {
      const proxy: any = new Proxy(() => { }, {
        get: (target, prop) => {
          if (prop === 'then') return undefined;
          return createSafeProxy(`${label}.${String(prop)}`);
        },
        apply: (target, thisArg, args) => {
          console.warn(`${label}() called during build or without configuration`);
          return Promise.resolve({ data: { session: null, user: null }, error: null, count: 0 });
        }
      });
      return proxy;
    };
    return createSafeProxy('supabaseBrowser');
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