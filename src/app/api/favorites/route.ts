import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error in favorites GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { parkId, parkSlug } = await request.json();

    if (!parkId) {
      return NextResponse.json({ error: 'Park ID is required' }, { status: 400 });
    }

    // First, check if the favorite already exists
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('park_id', parkId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing favorite:', checkError);
      return NextResponse.json({ error: 'Failed to check favorite' }, { status: 500 });
    }

    // If it already exists, return it
    if (existingFavorite) {
      return NextResponse.json({ favorite: existingFavorite });
    }

    // Otherwise, insert the new favorite
    const { data: favorite, error: insertError } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        park_id: parkId,
        park_slug: parkSlug || null,
      })
      .select()
      .single();

    // Handle duplicate key error gracefully (race condition fallback)
    if (insertError) {
      // If it's a duplicate key error, fetch and return the existing favorite
      if (insertError.code === '23505' || insertError.message?.includes('duplicate key')) {
        const { data: existing, error: fetchError } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('park_id', parkId)
          .single();

        if (fetchError) {
          console.error('Error fetching existing favorite after duplicate:', fetchError);
          return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
        }

        return NextResponse.json({ favorite: existing });
      }

      console.error('Error adding favorite:', insertError);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error('Error in favorites POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}