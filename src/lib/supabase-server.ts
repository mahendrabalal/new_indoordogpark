import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function createServerClient() {
  // Validate Supabase configuration - only throw if not in build environment or phase
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE && !process.env.OPEN_NEXT) {
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
    return createSafeProxy('supabaseServer');
  }

  const cookieStore = await cookies();

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
