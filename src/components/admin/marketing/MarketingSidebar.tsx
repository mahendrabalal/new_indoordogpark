import { ChartBarIcon, UsersIcon, EnvelopeIcon, PlusCircleIcon, ShareIcon } from '@heroicons/react/24/outline';

interface Props {
    activeView: 'dashboard' | 'audiences' | 'history' | 'builder' | 'social';
    setActiveView: (view: 'dashboard' | 'audiences' | 'history' | 'builder' | 'social') => void;
}

export function MarketingSidebar({ activeView, setActiveView }: Props) {
    const navigation = [
        { name: 'Dashboard', view: 'dashboard', icon: ChartBarIcon },
        { name: 'Audiences', view: 'audiences', icon: UsersIcon },
        { name: 'Campaign History', view: 'history', icon: EnvelopeIcon },
        { name: 'New Campaign', view: 'builder', icon: PlusCircleIcon },
        { name: 'Social Share', view: 'social', icon: ShareIcon },
    ];

    return (
        <div className="w-64 flex-shrink-0 border-r border-gray-200 pr-4 min-h-[600px]">
            <nav className="space-y-1 sticky top-4">
                {navigation.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveView(item.view as any)}
                        className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeView === item.view
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <item.icon
                            className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                                activeView === item.view ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                            aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
