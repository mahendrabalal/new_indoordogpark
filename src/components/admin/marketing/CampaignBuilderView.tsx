import { useState, useEffect } from 'react';

interface BlogPost {
    title: string;
    slug: string;
}

interface ParkContact {
    id: string;
    name: string;
    city: string;
    outreach_status?: string;
}

interface Props {
    subscribers: { total: number; owners: number; consumers: number };
    recentPosts: BlogPost[];
    approvedParks: ParkContact[];
    onSend: (payload: any) => Promise<{ success: boolean; message: string; details?: any[] }>;
}

export function CampaignBuilderView({ subscribers, recentPosts, approvedParks, onSend }: Props) {
    const [step, setStep] = useState(1);
    
    // Step 1: Audience
    const [audienceType, setAudienceType] = useState('pending_owners');
    const pendingOwnersCount = approvedParks.filter(p => !p.outreach_status || p.outreach_status === 'pending').length;

    // Track already-sent blog slugs
    const [sentBlogSlugs, setSentBlogSlugs] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchSentBlogs = async () => {
            try {
                const res = await fetch('/api/admin/marketing/logs?view=sent-blogs');
                if (res.ok) {
                    const json = await res.json();
                    setSentBlogSlugs(new Set(json.sentSlugs || []));
                }
            } catch (e) {
                console.error('Failed to fetch sent blogs', e);
            }
        };
        fetchSentBlogs();
    }, []);

    // Step 2: Template
    const [templateType, setTemplateType] = useState('badge_outreach');
    const [selectedSlug, setSelectedSlug] = useState('');
    const [subject, setSubject] = useState('');
    const [headline, setHeadline] = useState('');
    const [bodyContent, setBodyContent] = useState('');

    // Single Partner fields
    const [partnerEmail, setPartnerEmail] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [partnerDetails, setPartnerDetails] = useState('');

    // Step 3: Send status
    const [isSending, setIsSending] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleNext = () => {
        if (step === 1 && audienceType === 'pending_owners') {
            setTemplateType('badge_outreach');
        } else if (step === 1 && audienceType === 'single_partner') {
            setTemplateType('generic');
        } else if (step === 1) {
            setTemplateType('generic');
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const executeSend = async () => {
        setShowConfirm(false);
        setIsSending(true);
        setResult(null);

        const payload = {
            template: templateType === 'badge_outreach' ? 'outreach' : (templateType === 'blog' ? 'blog' : 'generic'),
            segment: audienceType === 'single_partner' ? 'single' : (templateType === 'badge_outreach' ? 'bulk-outreach' : (audienceType === 'consumers' ? 'consumers' : 'all')),
            data: templateType === 'blog' 
                ? { slug: selectedSlug } 
                : templateType === 'badge_outreach' 
                    ? { personalizedNote: bodyContent } 
                    : { 
                        subject, 
                        headline, 
                        bodyContent,
                        singleEmailAddress: audienceType === 'single_partner' ? partnerEmail : undefined,
                        singleEmailType: 'owner',
                        metadata: audienceType === 'single_partner' ? { isPartner: true, partnerName, partnerDetails } : undefined
                    },
        };

        const response = await onSend(payload);
        setResult(response);
        setIsSending(false);
        if (response.success) setStep(4);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Email Broadcast</h2>
                <p className="text-gray-500 mt-1">Send email campaigns to your subscribers.</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-4 mb-8">
                <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <h3 className="text-lg font-medium">1. Choose your audience</h3>
                        <div className="grid gap-4">
                            <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${audienceType === 'pending_owners' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="audience" className="sr-only" checked={audienceType === 'pending_owners'} onChange={() => setAudienceType('pending_owners')} />
                                <div className="font-semibold text-gray-900">Pending Park Owners ({pendingOwnersCount})</div>
                                <div className="text-sm text-gray-500 mt-1">Verified facility managers who haven't received the badge offer.</div>
                            </label>
                            <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${audienceType === 'all' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="audience" className="sr-only" checked={audienceType === 'all'} onChange={() => setAudienceType('all')} />
                                <div className="font-semibold text-gray-900">All Subscribers ({subscribers.total})</div>
                                <div className="text-sm text-gray-500 mt-1">Everyone in your database.</div>
                            </label>
                            <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${audienceType === 'consumers' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="audience" className="sr-only" checked={audienceType === 'consumers'} onChange={() => setAudienceType('consumers')} />
                                <div className="font-semibold text-gray-900">Consumers ({subscribers.consumers})</div>
                                <div className="text-sm text-gray-500 mt-1">Users looking for dog parks.</div>
                            </label>
                            <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${audienceType === 'single_partner' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="audience" className="sr-only" checked={audienceType === 'single_partner'} onChange={() => setAudienceType('single_partner')} />
                                <div className="font-semibold text-gray-900">Single Partner (B2B Outreach)</div>
                                <div className="text-sm text-gray-500 mt-1">Send a direct pitch to a new partner and save their details.</div>
                            </label>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                        <h3 className="text-lg font-medium">2. Select a Template</h3>
                        <div className="grid gap-4">
                            {audienceType === 'pending_owners' && (
                                <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${templateType === 'badge_outreach' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="template" className="sr-only" checked={templateType === 'badge_outreach'} onChange={() => setTemplateType('badge_outreach')} />
                                    <div className="font-semibold text-gray-900">Badge Offer Outreach</div>
                                    <div className="text-sm text-gray-500 mt-1">Sends the official premium listing invite with dynamic links.</div>
                                </label>
                            )}
                            <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${templateType === 'blog' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="template" className="sr-only" checked={templateType === 'blog'} onChange={() => setTemplateType('blog')} />
                                <div className="font-semibold text-gray-900">Blog Broadcast</div>
                                <div className="text-sm text-gray-500 mt-1">Shares a recent blog post automatically.</div>
                            </label>
                            <label className={`block border p-4 rounded-lg cursor-pointer transition-colors ${templateType === 'generic' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="template" className="sr-only" checked={templateType === 'generic'} onChange={() => setTemplateType('generic')} />
                                <div className="font-semibold text-gray-900">Custom Announcement</div>
                                <div className="text-sm text-gray-500 mt-1">Write your own subject and markdown content.</div>
                            </label>
                        </div>

                        {templateType === 'blog' && (
                            <div className="mt-4 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Select Post</label>
                                <div className="space-y-2">
                                    {recentPosts.map(p => {
                                        const alreadySent = sentBlogSlugs.has(p.slug);
                                        return (
                                            <label
                                                key={p.slug}
                                                className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-colors ${
                                                    selectedSlug === p.slug
                                                        ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50'
                                                        : alreadySent
                                                            ? 'bg-gray-50 border-gray-200 opacity-60'
                                                            : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="blogPost"
                                                        className="sr-only"
                                                        value={p.slug}
                                                        checked={selectedSlug === p.slug}
                                                        onChange={() => setSelectedSlug(p.slug)}
                                                    />
                                                    <span className={`text-sm font-medium ${selectedSlug === p.slug ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                        {p.title}
                                                    </span>
                                                </div>
                                                {alreadySent && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                                                        ⚠️ Already Sent
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                                {selectedSlug && sentBlogSlugs.has(selectedSlug) && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                        <strong>Warning:</strong> This blog post has already been broadcast before. Sending it again will send duplicates to your audience.
                                    </div>
                                )}
                                
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2">
                                    <span>💡</span>
                                    <span>Want to share to social media too? Use the <strong>Social Share</strong> tab in the sidebar.</span>
                                </div>
                            </div>
                        )}
                        {templateType === 'generic' && (
                            <div className="space-y-3 mt-4">
                                {audienceType === 'single_partner' && (
                                    <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-medium text-gray-900 mb-2">Partner Details</h4>
                                        <input type="email" placeholder="Partner Email (e.g. contact@sparkysteps.com)" value={partnerEmail} onChange={e => setPartnerEmail(e.target.value)} className="w-full border p-2 rounded-md bg-white" />
                                        <input type="text" placeholder="Partner/Business Name (e.g. Sparky Steps)" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full border p-2 rounded-md bg-white" />
                                        <textarea placeholder="Business Details (e.g. Chicago dog walkers, good for future B2B...)" value={partnerDetails} onChange={e => setPartnerDetails(e.target.value)} rows={2} className="w-full border p-2 rounded-md bg-white" />
                                    </div>
                                )}
                                <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border p-2 rounded-md" />
                                <input type="text" placeholder="Headline" value={headline} onChange={e => setHeadline(e.target.value)} className="w-full border p-2 rounded-md" />
                                <textarea placeholder="Content (Markdown)" value={bodyContent} onChange={e => setBodyContent(e.target.value)} rows={4} className="w-full border p-2 rounded-md" />
                            </div>
                        )}
                        {templateType === 'badge_outreach' && (
                            <div className="mt-4">
                                <textarea placeholder="Optional personalized note for all parks..." value={bodyContent} onChange={e => setBodyContent(e.target.value)} rows={3} className="w-full border p-2 rounded-md" />
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in">
                        <h3 className="text-lg font-medium">3. Review and Send</h3>
                        <div className="bg-gray-50 p-6 rounded-lg border space-y-2">
                            <p><strong>Audience:</strong> <span className="capitalize">{audienceType.replace('_', ' ')}</span></p>
                            <p><strong>Template:</strong> <span className="capitalize">{templateType.replace('_', ' ')}</span></p>
                            {templateType === 'blog' && selectedSlug && (
                                <>
                                    <p><strong>Blog Post:</strong> {recentPosts.find(p => p.slug === selectedSlug)?.title || selectedSlug}</p>
                                </>
                            )}
                            {templateType === 'generic' && subject && (
                                <p><strong>Subject:</strong> {subject}</p>
                            )}
                            <p><strong>Total Recipients:</strong> {audienceType === 'single_partner' ? '1' : (audienceType === 'pending_owners' ? pendingOwnersCount : (audienceType === 'all' ? subscribers.total : subscribers.consumers))}</p>
                            {audienceType === 'single_partner' && (
                                <p><strong>Sending to:</strong> {partnerEmail} ({partnerName})</p>
                            )}
                        </div>
                        {result?.success === false && (
                            <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">❌</span>
                                    <strong>Campaign Failed</strong>
                                </div>
                                <p>{result.message}</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 text-center animate-in zoom-in">
                        <div className="text-green-500 text-5xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold">Campaign Launched!</h3>
                        {result?.message && (
                            <p className="text-gray-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 inline-block">
                                {result.message}
                            </p>
                        )}

                        <div className="flex justify-center space-x-4 mt-4">
                            <button onClick={() => { setStep(1); setAudienceType('pending_owners'); setResult(null); setSubject(''); setHeadline(''); setBodyContent(''); }} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Start New Campaign</button>
                            <button onClick={() => { setStep(2); setResult(null); }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Back to Editing</button>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                {step < 4 && (
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        <button 
                            onClick={handleBack} 
                            disabled={step === 1 || isSending}
                            className={`px-4 py-2 font-medium text-gray-700 ${step === 1 ? 'invisible' : 'hover:bg-gray-100 rounded-md'}`}
                        >
                            Back
                        </button>
                        {step < 3 ? (
                            <button 
                                onClick={handleNext} 
                                disabled={step === 2 && audienceType === 'single_partner' && !partnerEmail}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button 
                                onClick={() => setShowConfirm(true)}
                                disabled={isSending}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {isSending ? 'Sending...' : '🚀 Blast Campaign'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Ready to Broadcast?</h3>
                        <p className="text-center text-gray-500 mb-6">
                            You are about to send the <strong className="text-gray-800 capitalize">{templateType.replace('_', ' ')}</strong> campaign to <strong className="text-indigo-600 text-lg">{audienceType === 'single_partner' ? '1' : (audienceType === 'pending_owners' ? pendingOwnersCount : (audienceType === 'all' ? subscribers.total : subscribers.consumers))}</strong> recipient(s). This action cannot be undone.
                        </p>
                        <div className="flex justify-center space-x-3">
                            <button 
                                onClick={() => setShowConfirm(false)}
                                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeSend}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                            >
                                Confirm & Blast
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
