interface Stats {
    total: number;
    owners: number;
    consumers: number;
}

interface Props {
    stats: Stats;
    onNavigate: (view: 'audiences' | 'builder' | 'history' | 'social') => void;
}

export function DashboardView({ stats, onNavigate }: Props) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Marketing Overview</h2>
                <p className="text-gray-500 mt-1">High-level metrics for your outreach campaigns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
