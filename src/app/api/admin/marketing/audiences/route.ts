import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || (user.user_metadata as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: submissions } = await supabaseAdminClient
            .from('park_submissions')
            .select('id, name, city, state, email')
            .eq('status', 'approved')
            .not('email', 'is', null);

        const { data: subscriberParks } = await supabaseAdminClient
            .from('subscribers')
            .select('id, email, type, metadata')
            .eq('type', 'owner')
            .not('email', 'is', null);

        const { data: campaignLogs } = await supabaseAdminClient
            .from('email_campaign_logs')
            .select('recipient_email')
            .eq('status', 'delivered');

        const badgeSentEmails = new Set((campaignLogs || []).map((log: any) => log.recipient_email.toLowerCase()));

        let mergedParks: any[] = [];
        if (submissions) {
            mergedParks = [...submissions.map((p: any) => ({ ...p, source_type: 'submission' }))];
        }

        if (subscriberParks) {
            const subParksMapped = subscriberParks.map((s: any) => {
                const metadata = s.metadata as any;
                return {
                    id: s.id,
                    name: metadata?.parkName || s.email,
                    city: metadata?.location?.split(',')[0]?.trim() || '',
                    state: metadata?.location?.split(',')[1]?.trim() || '',
                    email: s.email,
                    source_type: 'subscriber'
                };
            });

            const submissionEmails = new Set(mergedParks.map((p: any) => p.email.toLowerCase()));
            const uniqueSubParks = subParksMapped.filter((p: any) => !submissionEmails.has(p.email.toLowerCase()));
            mergedParks = [...mergedParks, ...uniqueSubParks];
        }

        mergedParks = mergedParks.map(park => ({
            ...park,
            outreach_status: badgeSentEmails.has(park.email.toLowerCase()) ? 'sent' : 'pending'
        })).sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json(mergedParks);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch audiences' }, { status: 500 });
    }
}
