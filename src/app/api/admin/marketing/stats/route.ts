
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userMetadata = user.user_metadata as { role?: string } | undefined;
        if (userMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const adminClient = supabaseAdminClient;

        const { count: totalSubs, error: e1 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active');
        const { count: ownersSubs, error: e2 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('type', 'owner');
        const { count: consumers, error: e3 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('type', 'consumer');
        const { count: partners, error: e4 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('type', 'partner');

        // Also count approved park submissions as they are included in the marketing audience
        const { count: approvedParks, error: e5 } = await adminClient.from('park_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved');

        if (e1 || e2 || e3 || e4 || e5) {
            console.error('Stats fetch error:', e1, e2, e3, e4, e5);
        }

        const totalOwners = (ownersSubs || 0) + (approvedParks || 0);
        const totalAudience = (totalSubs || 0) + (approvedParks || 0);

        return NextResponse.json({
            total: totalAudience,
            owners: totalOwners,
            consumers: consumers || 0,
            partners: partners || 0
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
