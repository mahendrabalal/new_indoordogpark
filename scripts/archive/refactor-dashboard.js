const fs = require('fs');

const path = './src/components/admin/marketing/DashboardView.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add imports
code = code.replace(
    'export function DashboardView({ stats, onNavigate }: Props) {',
    `import { useState, useEffect } from 'react';\n\nexport function DashboardView({ stats, onNavigate }: Props) {\n    const [queuedCount, setQueuedCount] = useState<number | null>(null);\n    const [isProcessing, setIsProcessing] = useState(false);\n\n    useEffect(() => {\n        fetch('/api/admin/marketing/queue/stats')\n            .then(res => res.json())\n            .then(data => setQueuedCount(data.pendingCount))\n            .catch(() => setQueuedCount(0));\n    }, []);\n\n    const processQueue = async () => {\n        setIsProcessing(true);\n        try {\n            const res = await fetch('/api/admin/marketing/queue/process');\n            const data = await res.json();\n            alert(data.message || 'Queue processed');\n            const statsRes = await fetch('/api/admin/marketing/queue/stats');\n            const statsData = await statsRes.json();\n            setQueuedCount(statsData.pendingCount);\n        } catch (e) {\n            alert('Failed to process queue');\n        }\n        setIsProcessing(false);\n    };\n`
);

// 2. Change grid columns from 3 to 4
code = code.replace(
    'className="grid grid-cols-1 md:grid-cols-3 gap-6"',
    'className="grid grid-cols-1 md:grid-cols-4 gap-6"'
);

// 3. Add the queued card
const cardHtml = `                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="text-sm font-medium text-gray-500 mb-1">Consumers</div>
                    <div className="text-4xl font-bold text-green-600">{stats.consumers}</div>
                    <div className="mt-auto pt-4 text-sm text-gray-400">Newsletter subscribers</div>
                </div>`;

const newCardHtml = `                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
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
                        {isProcessing ? 'Processing...' : 'Process Queue Now \u2192'}
                    </button>
                </div>`;

code = code.replace(cardHtml, newCardHtml);

fs.writeFileSync(path, code);
console.log('Successfully refactored DashboardView.');
