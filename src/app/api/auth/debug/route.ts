import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const { user, error } = await getUserFromRequest(request);

    return NextResponse.json({
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
      error: error?.message || null,
      cookies: allCookies.map(c => c.name),
      supabaseCookies: allCookies.filter(c => c.name.startsWith('sb-')).map(c => ({
        name: c.name,
        hasValue: !!c.value,
        valueLength: c.value?.length || 0
      }))
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
