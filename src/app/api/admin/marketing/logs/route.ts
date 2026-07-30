import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Parse a campaign_name string into a display-friendly object.
 * 
 * Convention:
 *   badge_outreach           -> { type: 'badge_outreach', detail: null }
 *   blog_broadcast::slug     -> { type: 'blog_broadcast', detail: 'slug' }
 *   generic_broadcast::subj  -> { type: 'generic_broadcast', detail: 'subj' }
 *   generic_broadcast        -> { type: 'generic_broadcast', detail: null }  (legacy)
 */
function parseCampaignName(raw: string): { type: string; detail: string | null } {
    const sep = raw.indexOf('::');
    if (sep === -1) return { type: raw, detail: null };
    return { type: raw.substring(0, sep), detail: raw.substring(sep + 2) };
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || (user.user_metadata as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const view = searchParams.get('view') || 'summary';
        const campaignName = searchParams.get('campaign');
        const batchDate = searchParams.get('date');

        if (view === 'detail' && campaignName && batchDate) {
            // Drill-down: return individual emails for a specific campaign batch
            const startOfDay = new Date(batchDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(batchDate);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabaseAdminClient
                .from('email_campaign_logs')
                .select('*')
                .eq('campaign_name', campaignName)
                .gte('sent_at', startOfDay.toISOString())
                .lte('sent_at', endOfDay.toISOString())
                .order('sent_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json({ view: 'detail', data });
        }

        if (view === 'sent-blogs') {
            // Return list of blog slugs that have already been sent
            const { data, error } = await supabaseAdminClient
                .from('email_campaign_logs')
                .select('campaign_name')
                .like('campaign_name', 'blog_broadcast::%');

            if (error) throw error;

            const sentSlugs = [...new Set(
                (data || []).map((row: any) => {
                    const parsed = parseCampaignName(row.campaign_name);
                    return parsed.detail;
                }).filter(Boolean)
            )];

            return NextResponse.json({ sentSlugs });
        }

        // Summary view: fetch all logs, group by campaign_name + date
        const { data, error } = await supabaseAdminClient
            .from('email_campaign_logs')
            .select('*')
            .order('sent_at', { ascending: false });

        if (error) throw error;

        const campaignMap = new Map<string, {
            campaign_name: string;
            campaign_type: string;
            campaign_detail: string | null;
            date: string;
            total_sent: number;
            total_drafts: number;
            first_sent: string;
            last_sent: string;
            last_subject: string | null;
            last_body: string | null;
        }>();

        for (const log of (data || [])) {
            const date = new Date(log.sent_at).toISOString().split('T')[0];
            const key = `${log.campaign_name}::${date}`;

            if (!campaignMap.has(key)) {
                const parsed = parseCampaignName(log.campaign_name);
                campaignMap.set(key, {
                    campaign_name: log.campaign_name,
                    campaign_type: parsed.type,
                    campaign_detail: parsed.detail,
                    date,
                    total_sent: 0,
                    total_drafts: 0,
                    first_sent: log.sent_at,
                    last_sent: log.sent_at,
                    last_subject: log.subject || null,
                    last_body: log.body_content || null,
                    last_recipient_email: log.recipient_email || null,
                });
            }

            const entry = campaignMap.get(key)!;
            if (log.status === 'draft' || log.status === 'failed') {
                entry.total_drafts++;
            } else {
                entry.total_sent++;
            }
            if (log.sent_at < entry.first_sent) entry.first_sent = log.sent_at;
            if (log.sent_at > entry.last_sent) {
                entry.last_sent = log.sent_at;
                if (log.subject) entry.last_subject = log.subject;
                if (log.body_content) entry.last_body = log.body_content;
                if (log.recipient_email) entry.last_recipient_email = log.recipient_email;
            }
        }

        const campaigns = Array.from(campaignMap.values())
            .sort((a, b) => new Date(b.last_sent).getTime() - new Date(a.last_sent).getTime());

        return NextResponse.json({ view: 'summary', data: campaigns });
    } catch (e) {
        console.error('Campaign logs error:', e);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
