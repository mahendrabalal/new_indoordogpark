interface Stats {
    total: number;
    owners: number;
    consumers: number;
}

interface Props {
    stats: Stats;
    onNavigate: (view: 'audiences' | 'builder' | 'history') => void;
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

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-indigo-900">Ready to engage your audience?</h3>
                    <p className="text-indigo-700 mt-2 max-w-lg">
                        Create a new campaign to send badge offers, blog broadcasts, or custom announcements to your targeted lists.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('builder')}
                    className="mt-6 md:mt-0 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Create New Campaign
                </button>
            </div>
        </div>
    );
}
