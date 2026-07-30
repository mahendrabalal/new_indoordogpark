interface Stats {
    total: number;
    owners: number;
    consumers: number;
}

interface Props {
    stats: Stats;
    onNavigate: (view: 'audiences' | 'builder' | 'history' | 'social') => void;
}

import { useState, useEffect } from 'react';

export function DashboardView({ stats, onNavigate }: Props) {
    const [queuedCount, setQueuedCount] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        fetch('/api/admin/marketing/queue/stats')
            .then(res => res.json())
            .then(data => setQueuedCount(data.pendingCount))
            .catch(() => setQueuedCount(0));
    }, []);

    const processQueue = async () => {
        setIsProcessing(true);
        setStatusMessage(null);
        try {
            const res = await fetch('/api/admin/marketing/queue/process');
            const data = await res.json();
            setStatusMessage({ type: 'success', text: data.message || 'Queue processed successfully' });
            const statsRes = await fetch('/api/admin/marketing/queue/stats');
            const statsData = await statsRes.json();
            setQueuedCount(statsData.pendingCount);
        } catch (e) {
            setStatusMessage({ type: 'error', text: 'Failed to process queue' });
        }
        setIsProcessing(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Marketing Overview</h2>
                <p className="text-gray-500 mt-1">High-level metrics for your outreach campaigns.</p>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-xl border shadow-sm ${statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0 text-xl">
                            {statusMessage.type === 'success' ? '✅' : '❌'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                {statusMessage.text}
                            </p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setStatusMessage(null)}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${statusMessage.type === 'success' ? 'text-green-600 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50' : 'text-red-600 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'}`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Audience</div>
                    <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
                    <button 
                        onClick={() => onNavigate('audiences')}
                        className="mt-auto pt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium text-left"
                    >
                        View all contacts &rarr;
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="text-sm font-medium text-gray-500 mb-1">Park Owners</div>
                    <div className="text-4xl font-bold text-indigo-600">{stats.owners}</div>
                    <div className="mt-auto pt-4 text-sm text-gray-400">Verified facility managers</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="text-sm font-medium text-gray-500 mb-1">Consumers</div>
                    <div className="text-4xl font-bold text-green-600">{stats.consumers}</div>
                    <div className="mt-auto pt-4 text-sm text-gray-400">Newsletter subscribers</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-amber-200 bg-amber-50 shadow-sm flex flex-col">
                    <div className="text-sm font-medium text-amber-800 mb-1">Queued Emails</div>
                    <div className="text-4xl font-bold text-amber-600">{queuedCount !== null ? queuedCount : '...'}</div>
                    <button 
                        onClick={processQueue}
                        disabled={isProcessing || !queuedCount}
                        className="mt-auto pt-4 text-sm text-amber-700 hover:text-amber-900 font-medium text-left disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : 'Process Queue Now →'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100 flex flex-col">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900">📧 Email Broadcast</h3>
                        <p className="text-indigo-700 mt-2">
                            Send blog broadcasts, badge offers, or custom announcements to your subscriber list.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('builder')}
                        className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Create Email Campaign
                    </button>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100 flex flex-col">
                    <div>
                        <h3 className="text-xl font-bold text-blue-900">🌐 Social Share</h3>
                        <p className="text-blue-700 mt-2">
                            Share blog posts to Facebook, Twitter, and Pinterest with a single click.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('social')}
                        className="mt-6 w-full px-6 py-3 bg-[#1877F2] text-white font-medium rounded-lg shadow-sm hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Share to Social Media
                    </button>
                </div>
            </div>
        </div>
    );
}
