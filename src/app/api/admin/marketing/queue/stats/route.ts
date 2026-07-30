import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { count } = await supabaseAdminClient
            .from('email_queue')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
            
        return NextResponse.json({ pendingCount: count || 0 });
    } catch (error) {
        return NextResponse.json({ pendingCount: 0 });
    }
}
