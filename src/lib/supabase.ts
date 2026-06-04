'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { safeLocalStorage } from './storage';

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
    const customSafeStorage = {
      getItem(key: string): string | null {
        return safeLocalStorage.getItem(key);
      },
      setItem(key: string, value: string): void {
        safeLocalStorage.setItem(key, value);
      },
      removeItem(key: string): void {
        safeLocalStorage.removeItem(key);
      }
    };

    client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          try {
            if (typeof document === 'undefined') return '';
            const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return match ? decodeURIComponent(match[3]) : '';
          } catch (e) {
            console.warn(`[supabase] Failed to read cookie ${name}:`, e);
            return '';
          }
        },
        set(name: string, value: string, options: any) {
          try {
            if (typeof document === 'undefined') return;
            let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            if (options) {
              if (options.path) cookieString += `; path=${options.path}`;
              if (options.domain) cookieString += `; domain=${options.domain}`;
              if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
              if (options.secure) cookieString += `; secure`;
              if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
            }
            document.cookie = cookieString;
          } catch (e) {
            console.warn(`[supabase] Failed to set cookie ${name}:`, e);
          }
        },
        remove(name: string, options: any) {
          try {
            if (typeof document === 'undefined') return;
            document.cookie = `${encodeURIComponent(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          } catch (e) {
            console.warn(`[supabase] Failed to remove cookie ${name}:`, e);
          }
        }
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: customSafeStorage,
      },
    });
  }

  return client;
}

// Export a getter or a proxy to prevent top-level execution crash
export const supabase = getSupabaseBrowserClient();