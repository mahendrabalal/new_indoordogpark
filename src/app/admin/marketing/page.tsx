'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

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

export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState<'blog' | 'generic'>('blog');
    const [subscribers, setSubscribers] = useState<{ total: number; owners: number; consumers: number }>({ total: 0, owners: 0, consumers: 0 });
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

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

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchSubscribers();
        fetchPosts();

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
        // We'll use the public sanity API or a simplified fetch here since we are client side
        // Typically we'd have an API route for this, but let's try direct client fetch if configured 
        // OR simpler: assume we can use the same helper script logic. 
        // NOTE: Sanity client might need a token if dataset private, but usually public for read.
        // Let's rely on a server action or just use a small fetch to our existing blog API?
        // We have /api/revalidate? No...
        // Let's just hardcode a fetch to the blog page json or similar?
        // Better: Generic fetch to Sanity via the project ID.

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

    const handleSend = async (isTest: boolean) => {
        setStatus('sending');
        setMessage('');
        setDetails([]);

        const payload = {
            template: activeTab === 'blog' ? 'blog' : 'marketing',
            segment: segment,
            testEmail: isTest ? testEmail : undefined,
            data: activeTab === 'blog' ? {
                slug: selectedSlug
            } : {
                subject,
                headline,
                bodyContent,
                ctaText,
                ctaUrl
            }
        };

        if (!isTest) {
            const confirmMsg = `Are you sure you want to broadcast this to ${segment === 'all' ? subscribers.total : (segment === 'owners' ? subscribers.owners : subscribers.consumers)} people?`;
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
                                className={`w-1/2 py-4 text-center text-sm font-medium border-b-2 ${activeTab === 'blog'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Blog Broadcast
                            </button>
                            <button
                                onClick={() => setActiveTab('generic')}
                                className={`w-1/2 py-4 text-center text-sm font-medium border-b-2 ${activeTab === 'generic'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Custom Announcement
                            </button>
                        </nav>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Audience Selector */}
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
                            This will send emails to <strong>{segment === 'all' ? subscribers.total : (segment === 'owners' ? subscribers.owners : subscribers.consumers)}</strong> subscribers.
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
