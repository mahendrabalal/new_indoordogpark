import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ parkId: string }> }
) {
  try {
    const { parkId } = await params;
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('park_id', parkId);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in favorites DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}