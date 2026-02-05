'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Types
interface BlogPost {
    title: string;
    slug: string;
    publishedAt: string;
}

interface FailureDetail {
    email: string;
    status: 'failed';
    error: string;
}

interface ParkContact {
    id: string;
    name: string;
    city: string;
    state: string;
    email: string;
    last_outreach_sent_at?: string;
    outreach_status?: string;
    source_type?: 'submission' | 'subscriber';
}

interface SubscriberMetadata {
    parkName?: string;
    location?: string;
}

export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState<'blog' | 'generic' | 'outreach'>('blog');
    const [subscribers, setSubscribers] = useState<{ total: number; owners: number; consumers: number }>({ total: 0, owners: 0, consumers: 0 });
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [approvedParks, setApprovedParks] = useState<ParkContact[]>([]);
    const [selectedParkId, setSelectedParkId] = useState('');
    const [showOnlyPending, setShowOnlyPending] = useState(false);

    // Form States
    const [selectedSlug, setSelectedSlug] = useState('');
    const [subject, setSubject] = useState('');
    const [headline, setHeadline] = useState('');
    const [bodyContent, setBodyContent] = useState('');
    const [ctaText, setCtaText] = useState('');
    const [ctaUrl, setCtaUrl] = useState('');
    const [segment, setSegment] = useState('all');
    const [testEmail, setTestEmail] = useState('');

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [details, setDetails] = useState<FailureDetail[]>([]);


    useEffect(() => {
        fetchSubscribers();
        fetchPosts();
        fetchParks();

        // Populate test email with current user
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user?.email) setTestEmail(data.user.email);
        };
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/admin/marketing/stats');
            if (res.ok) {
                const data = await res.json();
                setSubscribers({
                    total: data.total,
                    owners: data.owners,
                    consumers: data.consumers
                });
            }
        } catch (e) {
            console.error('Failed to fetch stats', e);
        }
    };

    const fetchPosts = async () => {
        const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
        const query = encodeURIComponent('*[_type == "post"] | order(publishedAt desc)[0...10] {title, "slug": slug.current, publishedAt}');
        const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${query}`;

        try {
            const res = await fetch(url);
            const json = await res.json();
            if (json.result) {
                setRecentPosts(json.result);
                if (json.result.length > 0) setSelectedSlug(json.result[0].slug);
            }
        } catch (e) {
            console.error('Failed to fetch posts', e);
        }
    };
    const fetchParks = async () => {
        try {
            // 1. Fetch from park_submissions
            const { data: submissions } = await supabase
                .from('park_submissions')
                .select('id, name, city, state, email, last_outreach_sent_at, outreach_status')
                .eq('status', 'approved')
                .not('email', 'is', null)
                .order('name', { ascending: true });

            // 2. Fetch from subscribers (the new ones we imported)
            const { data: subscriberParks } = await supabase
                .from('subscribers')
                .select('id, email, type, last_outreach_sent_at, outreach_status, metadata')
                .eq('type', 'owner')
                .not('email', 'is', null);

            let mergedParks: ParkContact[] = [];

            if (submissions) {
                mergedParks = [...submissions.map((p: any) => ({ ...p, source_type: 'submission' as const }))];
            }

            if (subscriberParks) {
                const subParksMapped = subscriberParks.map((s: any) => {
                    const metadata = s.metadata as SubscriberMetadata | null;
                    return {
                        id: s.id,
                        name: metadata?.parkName || s.email,
                        city: metadata?.location?.split(',')[0]?.trim() || '',
                        state: metadata?.location?.split(',')[1]?.trim() || '',
                        email: s.email,
                        last_outreach_sent_at: s.last_outreach_sent_at,
                        outreach_status: s.outreach_status,
                        source_type: 'subscriber' as const
                    };
                });

                // Avoid duplicates if email exists in both
                const submissionEmails = new Set(mergedParks.map((p: any) => p.email.toLowerCase()));
                const uniqueSubParks = subParksMapped.filter((p: any) => !submissionEmails.has(p.email.toLowerCase()));

                mergedParks = [...mergedParks, ...uniqueSubParks];
            }

            // Sort merged list by name
            mergedParks.sort((a, b) => a.name.localeCompare(b.name));

            setApprovedParks(mergedParks);
            if (mergedParks.length > 0 && !selectedParkId) setSelectedParkId(mergedParks[0].id);

        } catch (e) {
            console.error('Failed to fetch parks', e);
        }
    };

    const handleSend = async (isTest: boolean) => {
        setStatus('sending');
        setMessage('');
        setDetails([]);

        const payload = {
            template: activeTab,
            segment: activeTab === 'outreach' ? 'specific-park' : segment,
            testEmail: isTest ? testEmail : undefined,
            data: activeTab === 'blog' ? {
                slug: selectedSlug
            } : activeTab === 'outreach' ? {
                parkId: selectedParkId,
                personalizedNote: bodyContent
            } : {
                subject,
                headline,
                bodyContent,
                ctaText,
                ctaUrl
            }
        };

        if (!isTest) {
            const recipientCount = activeTab === 'outreach' ? 1 : (segment === 'all' ? subscribers.total : (segment === 'owners' ? subscribers.owners : subscribers.consumers));
            const confirmMsg = `Are you sure you want to broadcast this to ${recipientCount} recipients?`;
            if (!window.confirm(confirmMsg)) {
                setStatus('idle');
                return;
            }
        }

        try {
            const res = await fetch('/api/admin/marketing/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(json.message || 'Sent successfully');
                fetchParks(); // Refresh data to show updated outreach status
                if (json.details) {
                    setDetails(json.details.filter((d: FailureDetail) => d.status === 'failed'));
                } else {
                    setDetails([]);
                }
            } else {
                setStatus('error');
                setMessage(json.error || 'Failed to send');
                setDetails([]);
            }
        } catch {
            setStatus('error');
            setMessage('Network error');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Marketing Center</h1>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Total Subscribers</div>
                    <div className="text-3xl font-bold text-gray-900">{subscribers.total}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Park Owners</div>
                    <div className="text-3xl font-bold text-indigo-600">{subscribers.owners}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Consumers</div>
                    <div className="text-3xl font-bold text-green-600">{subscribers.consumers}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Column */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('blog')}
                                className={`w-1/3 py-4 text-center text-sm font-medium border-b-2 ${activeTab === 'blog'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Blog Broadcast
                            </button>
                            <button
                                onClick={() => setActiveTab('generic')}
                                className={`w-1/3 py-4 text-center text-sm font-medium border-b-2 ${activeTab === 'generic'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Custom Announcement
                            </button>
                            <button
                                onClick={() => setActiveTab('outreach')}
                                className={`w-1/3 py-4 text-center text-sm font-medium border-b-2 ${activeTab === 'outreach'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Park Outreach
                            </button>
                        </nav>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Audience Selector - Hidden for Outreach */}
                        {activeTab !== 'outreach' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                                <select
                                    value={segment}
                                    onChange={(e) => setSegment(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                >
                                    <option value="all">All Subscribers ({subscribers.total})</option>
                                    <option value="owners">Park Owners Only ({subscribers.owners})</option>
                                    <option value="consumers">Consumers Only ({subscribers.consumers})</option>
                                </select>
                            </div>
                        )}

                        {activeTab === 'blog' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Blog Post</label>
                                <select
                                    value={selectedSlug}
                                    onChange={(e) => setSelectedSlug(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                >
                                    {recentPosts.map(post => (
                                        <option key={post.slug} value={post.slug}>{post.title}</option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs text-gray-500">
                                    The email will automatically pull the featured image, excerpt, and title from the blog post.
                                </p>
                            </div>
                        ) : activeTab === 'outreach' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Select Target Park</label>
                                    <label className="flex items-center text-xs text-gray-500 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showOnlyPending}
                                            onChange={(e) => setShowOnlyPending(e.target.checked)}
                                            className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Show Only Pending Outreach
                                    </label>
                                </div>
                                <select
                                    value={selectedParkId}
                                    onChange={(e) => setSelectedParkId(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                >
                                    {approvedParks
                                        .filter(park => !showOnlyPending || park.outreach_status === 'pending' || !park.outreach_status)
                                        .map(park => {
                                            const lastSent = park.last_outreach_sent_at ? new Date(park.last_outreach_sent_at).toLocaleDateString() : 'Never';
                                            const status = park.outreach_status || 'pending';
                                            const isNew = status === 'pending';
                                            return (
                                                <option key={park.id} value={park.id}>
                                                    {isNew ? '🆕 ' : ''}[{status.toUpperCase()}] {park.name} ({park.city}) - Sent: {lastSent}
                                                </option>
                                            );
                                        })}
                                </select>

                                {selectedParkId && (
                                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        {(() => {
                                            const park = approvedParks.find(p => p.id === selectedParkId);
                                            if (!park) return null;
                                            const isSent = park.outreach_status === 'sent';
                                            return (
                                                <>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</div>
                                                        <div className="flex items-center mt-1">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isSent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {park.outreach_status?.toUpperCase() || 'PENDING'}
                                                            </span>
                                                            <span className="ml-3 text-sm text-gray-600">
                                                                {park.last_outreach_sent_at ? `Last sent on ${new Date(park.last_outreach_sent_at).toLocaleString()}` : 'No outreach recorded yet'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Personalized Note (Optional)</label>
                                    <textarea
                                        value={bodyContent}
                                        onChange={e => setBodyContent(e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        placeholder="Add a personalized message for this park owner..."
                                    />
                                </div>
                                <div className="p-4 bg-blue-50 text-blue-700 rounded-md text-sm">
                                    <p className="font-semibold mb-1">Outreach Template:</p>
                                    <p>This will send the standard Partnership Offer email which includes:</p>
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Introduction to IndoorDogPark.org</li>
                                        <li>Benefits of premium listing</li>
                                        <li>$9.99/mo pricing & FIRST50 discount code</li>
                                        <li>Direct link to upgrade their listing</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        placeholder="We have exciting news!"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Headline (Inside Email)</label>
                                    <input
                                        type="text"
                                        value={headline}
                                        onChange={e => setHeadline(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        placeholder="Big updates coming..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Body Content (Markdown Supported)</label>
                                    <textarea
                                        value={bodyContent}
                                        onChange={e => setBodyContent(e.target.value)}
                                        rows={6}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        placeholder="Write your email content here..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Button Text (Optional)</label>
                                        <input
                                            type="text"
                                            value={ctaText}
                                            onChange={e => setCtaText(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                            placeholder="Learn More"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Button URL (Optional)</label>
                                        <input
                                            type="text"
                                            value={ctaUrl}
                                            onChange={e => setCtaUrl(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Column */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Send Test</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Test Recipient</label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={e => setTestEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>
                            <button
                                onClick={() => handleSend(true)}
                                disabled={status === 'sending'}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Test Email'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h3 className="text-lg font-medium text-indigo-900 mb-2">Broadcast Campaign</h3>
                        <p className="text-sm text-indigo-700 mb-4">
                            This will send emails to <strong>{activeTab === 'outreach' ? 1 : (segment === 'all' ? subscribers.total : (segment === 'owners' ? subscribers.owners : subscribers.consumers))}</strong> recipients.
                        </p>
                        <button
                            onClick={() => handleSend(false)}
                            disabled={status === 'sending'}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {status === 'sending' ? 'Processing...' : '🚀 Broadcast Now'}
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-md ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                            {details.length > 0 && (
                                <div className="mt-2 text-sm">
                                    <p className="font-semibold">Failures:</p>
                                    <ul className="list-disc pl-5 mt-1 overflow-y-auto max-h-32">
                                        {details.map((d, i) => (
                                            <li key={i}>{d.email} - {d.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
