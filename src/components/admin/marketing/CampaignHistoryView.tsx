import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface CampaignSummary {
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
    last_recipient_email?: string | null;
}

interface CampaignDetail {
    id: string;
    recipient_email: string;
    campaign_name: string;
    sent_at: string;
    status: string;
}

const CAMPAIGN_STYLES: Record<string, { label: string; icon: string; bg: string; border: string }> = {
    badge_outreach:     { label: 'Badge Outreach',     icon: '🏅', bg: 'bg-indigo-50',  border: 'border-indigo-200' },
    blog_broadcast:     { label: 'Blog Broadcast',     icon: '📝', bg: 'bg-amber-50',   border: 'border-amber-200' },
    generic_broadcast:  { label: 'Generic Broadcast',  icon: '📨', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

function getStyle(type: string) {
    return CAMPAIGN_STYLES[type] || { label: type, icon: '📧', bg: 'bg-gray-50', border: 'border-gray-200' };
}

function formatSlugToTitle(slug: string): string {
    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

export function CampaignHistoryView() {
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
    const [details, setDetails] = useState<CampaignDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState<'summary' | 'detail'>('summary');
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignSummary | null>(null);
    const [detailSearch, setDetailSearch] = useState('');

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/marketing/logs?view=summary');
            if (res.ok) {
                const json = await res.json();
                setCampaigns(json.data || []);
            }
        } catch (e) {
            console.error('Failed to fetch campaign summary', e);
        } finally {
            setIsLoading(false);
        }
    };

    const openDetail = async (campaign: CampaignSummary) => {
        setSelectedCampaign(campaign);
        setActiveView('detail');
        setIsLoading(true);
        setDetailSearch('');
        try {
            const res = await fetch(
                `/api/admin/marketing/logs?view=detail&campaign=${encodeURIComponent(campaign.campaign_name)}&date=${campaign.date}`
            );
            if (res.ok) {
                const json = await res.json();
                setDetails(json.data || []);
            }
        } catch (e) {
            console.error('Failed to fetch campaign details', e);
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        setActiveView('summary');
        setSelectedCampaign(null);
        setDetails([]);
    };

    const filteredDetails = details.filter(d =>
        d.recipient_email.toLowerCase().includes(detailSearch.toLowerCase())
    );

    // ── Summary View ──────────────────────────────────────────────
    if (activeView === 'summary') {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Campaign History</h2>
                    <p className="text-gray-500 mt-1">Overview of all email campaigns sent from the platform.</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-lg font-semibold text-gray-900">No campaigns yet</h3>
                        <p className="text-gray-500 mt-1">Once you send your first campaign, it will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {campaigns.map((campaign, i) => {
                            const style = getStyle(campaign.campaign_type);
                            const sentDate = new Date(campaign.last_sent);
                            return (
                                <button
                                    key={`${campaign.campaign_name}-${campaign.date}-${i}`}
                                    onClick={() => openDetail(campaign)}
                                    className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all p-5 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg ${style.bg} ${style.border} border flex items-center justify-center flex-shrink-0`}>
                                                <span className="text-xl">{style.icon}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {style.label}
                                                </div>

                                                {/* Show blog title or subject line if available */}
                                                {campaign.campaign_detail && (
                                                    <div className="text-sm text-gray-700 mt-0.5 truncate max-w-md">
                                                        {campaign.campaign_type === 'blog_broadcast' ? (
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="text-gray-400">Post:</span>
                                                                <span className="font-medium">{formatSlugToTitle(campaign.campaign_detail)}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="text-gray-400">Subject:</span>
                                                                <span className="font-medium">{campaign.campaign_detail}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Show email address if it was a single send */}
                                                {campaign.total_sent === 1 && campaign.last_recipient_email && (
                                                    <div className="text-sm text-gray-700 mt-0.5 truncate max-w-md">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="text-gray-400">To:</span>
                                                            <span className="font-medium text-indigo-600">{campaign.last_recipient_email}</span>
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {sentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    {' at '}
                                                    {sentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 flex-shrink-0">
                                            {campaign.total_drafts > 0 && (
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-yellow-600">{campaign.total_drafts}</div>
                                                    <div className="text-xs text-yellow-600 uppercase tracking-wide">Drafts / Failed</div>
                                                </div>
                                            )}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">{campaign.total_sent}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide">Emails Sent</div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ── Detail View ───────────────────────────────────────────────
    const style = selectedCampaign ? getStyle(selectedCampaign.campaign_type) : { label: '', icon: '', bg: '', border: '' };
    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Campaign History
                </button>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${style.bg} ${style.border} border flex items-center justify-center`}>
                        <span className="text-lg">{style.icon}</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{style.label}</h2>
                        <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                            <span>
                                {selectedCampaign && new Date(selectedCampaign.last_sent).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span>·</span>
                            <span>{selectedCampaign?.total_sent} emails sent</span>
                            {selectedCampaign?.campaign_detail && (
                                <>
                                    <span>·</span>
                                    <span className="text-gray-700 font-medium">
                                        {selectedCampaign.campaign_type === 'blog_broadcast'
                                            ? `"${formatSlugToTitle(selectedCampaign.campaign_detail)}"`
                                            : `"${selectedCampaign.campaign_detail}"`}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <input
                        type="text"
                        placeholder="Search recipients..."
                        value={detailSearch}
                        onChange={e => setDetailSearch(e.target.value)}
                        className="block w-full max-w-sm pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                    <table className="min-w-full divide-y divide-gray-200 relative">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Sent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDetails.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No matching recipients found.
                                    </td>
                                </tr>
                            ) : (
                                filteredDetails.map((log, idx) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 text-sm text-gray-400 tabular-nums">{idx + 1}</td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">{log.recipient_email}</span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.sent_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {log.status === 'draft' || log.status === 'failed' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                    Draft / Failed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Delivered
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredDetails.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 text-right">
                        Showing {filteredDetails.length} of {details.length} recipients
                    </div>
                )}
            </div>
        </div>
    );
}
