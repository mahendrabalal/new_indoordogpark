import type { NextRequest } from 'next/server';
import { createServerClient } from './supabase-server';

function extractAccessToken(authHeader: string | null): string | undefined {
  if (!authHeader) return undefined;

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }

  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0];
  }

  return undefined;
}

export async function getUserFromRequest(request: NextRequest) {
  const supabase = createServerClient();
  const accessToken = extractAccessToken(request.headers.get('authorization'));

  const {
    data: { user },
    error,
  } = accessToken ? await supabase.auth.getUser(accessToken) : await supabase.auth.getUser();

  return { supabase, user, error };
}
