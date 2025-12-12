
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userMetadata = user.user_metadata as { role?: string } | undefined;
        if (userMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch counts using Service Role Client to bypass RLS
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceRoleKey || !supabaseUrl) {
            console.error('Missing Service Role Key or URL');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        // We use a direct REST call or separate client instance for admin operations
        // Importing createClient from @supabase/supabase-js specifically for admin tasks
        const adminClient = createClient(supabaseUrl, serviceRoleKey);

        const { count: total, error: e1 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active');
        const { count: owners, error: e2 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('type', 'owner');
        const { count: consumers, error: e3 } = await adminClient.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('type', 'consumer');

        if (e1 || e2 || e3) {
            console.error('Stats fetch error:', e1, e2, e3);
        }

        return NextResponse.json({
            total: total || 0,
            owners: owners || 0,
            consumers: consumers || 0
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
