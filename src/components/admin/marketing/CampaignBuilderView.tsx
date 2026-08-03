import { useState, useEffect, useRef } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

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
    subscribers: { total: number; owners: number; consumers: number; partners: number };
    recentPosts: BlogPost[];
    approvedParks: ParkContact[];
    onSend: (payload: any) => Promise<{ success: boolean; message: string; details?: any[] }>;
}

export function CampaignBuilderView({ subscribers, recentPosts, approvedParks, onSend }: Props) {
    const [audienceType, setAudienceType] = useState('pending_owners');
    const [templateType, setTemplateType] = useState('badge_outreach');
    const [sentBlogSlugs, setSentBlogSlugs] = useState<Set<string>>(new Set());

    const pendingOwnersCount = approvedParks.filter(p => !p.outreach_status || p.outreach_status === 'pending').length;

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

    // Enforce valid template selection based on audience
    useEffect(() => {
        if (audienceType !== 'pending_owners' && audienceType !== 'single_partner' && templateType === 'badge_outreach') {
            setTemplateType('generic');
        }
    }, [audienceType, templateType]);

    const [selectedSlug, setSelectedSlug] = useState('');
    const [subject, setSubject] = useState('');
    const [headline, setHeadline] = useState('');
    const [bodyContent, setBodyContent] = useState('');

    useEffect(() => {
        const savedSubject = localStorage.getItem('campaign_draft_subject');
        const savedHeadline = localStorage.getItem('campaign_draft_headline');
        const savedBody = localStorage.getItem('campaign_draft_body');
        if (savedSubject) setSubject(savedSubject);
        if (savedHeadline) setHeadline(savedHeadline);
        if (savedBody) setBodyContent(savedBody);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem('campaign_draft_subject', subject);
            localStorage.setItem('campaign_draft_headline', headline);
            localStorage.setItem('campaign_draft_body', bodyContent);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [subject, headline, bodyContent]);

    const [attachments, setAttachments] = useState<{ filename: string; content: string; size: number }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Check size (max 5MB per file to prevent payload issues)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target?.result as string;
                // e.g. "data:application/pdf;base64,JVBER..." -> we need just the base64 part for Resend
                const base64Data = base64String.split(',')[1];
                
                setAttachments(prev => [...prev, {
                    filename: file.name,
                    content: base64Data,
                    size: file.size
                }]);
            };
            reader.readAsDataURL(file);
        });
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const [customPartners, setCustomPartners] = useState([{ email: '', name: '', notes: '' }]);
    const [isPastingCsv, setIsPastingCsv] = useState(false);
    const [csvText, setCsvText] = useState('');

    const handleCsvPaste = () => {
        const rows = csvText.split('\n');
        const newPartners: {email: string, name: string, notes: string}[] = [];
        
        rows.forEach(row => {
            if (!row.trim()) return;
            
            const parts = row.split(',');
            const hasMultipleEmails = parts.filter(p => p.includes('@')).length > 1;
            
            if (hasMultipleEmails) {
                // User pasted a comma-separated list of emails
                parts.forEach(part => {
                    const cleanPart = part.trim();
                    if (cleanPart.includes('@')) {
                        newPartners.push({
                            email: cleanPart,
                            name: '',
                            notes: ''
                        });
                    }
                });
            } else {
                // Standard "Email, Name" format
                const rawEmail = parts[0];
                const nameParts = parts.slice(1);
                
                if (rawEmail && rawEmail.includes('@')) {
                    newPartners.push({
                        email: rawEmail.trim(),
                        name: nameParts.join(',').trim() || '',
                        notes: ''
                    });
                }
            }
        });
        
        if (newPartners.length > 0) {
            setCustomPartners(prev => {
                const existing = prev.filter(p => p.email);
                return [...existing, ...newPartners];
            });
            setIsPastingCsv(false);
            setCsvText('');
        }
    };

    const [isSending, setIsSending] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const executeSend = async () => {
        setShowConfirm(false);
        setIsSending(true);
        setResult(null);
        setIsSuccess(false);

        const payload = {
            template: templateType === 'badge_outreach' ? 'outreach' : (templateType === 'blog' ? 'blog' : 'generic'),
            segment: audienceType === 'single_partner' ? 'single' : (templateType === 'badge_outreach' ? 'bulk-outreach' : (audienceType === 'consumers' ? 'consumers' : (audienceType === 'partners' ? 'partners' : 'all'))),
            data: templateType === 'blog' 
                ? { slug: selectedSlug } 
                : templateType === 'badge_outreach' 
                    ? { personalizedNote: bodyContent } 
                    : { 
                        subject, 
                        headline, 
                        bodyContent,
                        customPartners: audienceType === 'single_partner' ? customPartners : undefined,
                        attachments: attachments.length > 0 ? attachments : undefined
                    },
        };

        const response = await onSend(payload);
        setResult(response);
        setIsSending(false);
        if (response.success) {
            setIsSuccess(true);
        }
    };

    const resetCampaign = () => {
        setIsSuccess(false);
        setResult(null);
        setSubject('');
        setHeadline('');
        setBodyContent('');
        setCustomPartners([{ email: '', name: '', notes: '' }]);
        
        localStorage.removeItem('campaign_draft_subject');
        localStorage.removeItem('campaign_draft_headline');
        localStorage.removeItem('campaign_draft_body');
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto mt-10 animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                    <i className="bi bi-check2-all"></i>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Campaign Launched!</h2>
                <p className="text-slate-600 text-lg mb-8">
                    {result?.message || 'Your broadcast is currently being processed and sent.'}
                </p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={resetCampaign}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                    >
                        Start New Campaign
                    </button>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Sidebar Settings Panel */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Campaign Settings</h3>
                    
                    <div className="space-y-5">
                        {/* Audience Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">To (Audience)</label>
                            <select 
                                value={audienceType} 
                                onChange={(e) => setAudienceType(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm shadow-sm"
                            >
                                <option value="pending_owners">Pending Park Owners ({pendingOwnersCount})</option>
                                <option value="all">All Subscribers ({subscribers.total})</option>
                                <option value="consumers">Consumers ({subscribers.consumers})</option>
                                <option value="partners">Partners/B2B ({subscribers.partners})</option>
                                <option value="single_partner">Custom Partners (B2B)</option>
                            </select>
                        </div>

                        {/* Template Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Template</label>
                            <select 
                                value={templateType} 
                                onChange={(e) => setTemplateType(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm shadow-sm"
                            >
                                { (audienceType === 'pending_owners' || audienceType === 'single_partner') && (
                                    <option value="badge_outreach">Badge Offer Outreach</option>
                                )}
                                <option value="generic">Custom Announcement</option>
                                <option value="blog">Blog Broadcast</option>
                            </select>
                        </div>

                        {/* Contextual Settings based on selections */}
                        
                        {/* 1. Custom Partners Settings */}
                        {audienceType === 'single_partner' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2">
                                {customPartners.map((partner, idx) => (
                                    <div key={idx} className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg space-y-3 relative shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800">Partner {idx + 1}</h4>
                                            {customPartners.length > 1 && (
                                                <button 
                                                    onClick={() => setCustomPartners(prev => prev.filter((_, i) => i !== idx))}
                                                    className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                                                >
                                                    <i className="bi bi-x-circle"></i> Remove
                                                </button>
                                            )}
                                        </div>
                                        <input 
                                            type="email" 
                                            placeholder="Email Address" 
                                            value={partner.email} 
                                            onChange={e => {
                                                const updated = [...customPartners];
                                                updated[idx].email = e.target.value;
                                                setCustomPartners(updated);
                                            }} 
                                            className="w-full text-sm border-0 rounded p-2 shadow-sm" 
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Business Name" 
                                            value={partner.name} 
                                            onChange={e => {
                                                const updated = [...customPartners];
                                                updated[idx].name = e.target.value;
                                                setCustomPartners(updated);
                                            }} 
                                            className="w-full text-sm border-0 rounded p-2 shadow-sm" 
                                        />
                                        <textarea 
                                            placeholder="Internal Notes (e.g. met at expo)" 
                                            value={partner.notes} 
                                            onChange={e => {
                                                const updated = [...customPartners];
                                                updated[idx].notes = e.target.value;
                                                setCustomPartners(updated);
                                            }} 
                                            rows={2} 
                                            className="w-full text-sm border-0 rounded p-2 shadow-sm resize-none" 
                                        />
                                    </div>
                                ))}
                                {isPastingCsv ? (
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                                        <label className="text-xs font-bold text-slate-700">Paste CSV Data (Email, Name)</label>
                                        <textarea 
                                            value={csvText}
                                            onChange={e => setCsvText(e.target.value)}
                                            placeholder="example@dogpark.com, The Dog Penn&#10;hello@park.com, Central Bark"
                                            rows={4}
                                            className="w-full text-sm border-slate-300 rounded p-2 shadow-sm resize-y"
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleCsvPaste}
                                                className="py-2 px-4 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors"
                                            >
                                                Import List
                                            </button>
                                            <button 
                                                onClick={() => setIsPastingCsv(false)}
                                                className="py-2 px-4 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setCustomPartners(prev => [...prev, { email: '', name: '', notes: '' }])}
                                            className="flex-1 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors text-sm border border-indigo-200"
                                        >
                                            + Add Another
                                        </button>
                                        <button 
                                            onClick={() => setIsPastingCsv(true)}
                                            className="flex-1 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors text-sm border border-slate-900 flex items-center justify-center gap-2"
                                        >
                                            <i className="bi bi-file-earmark-spreadsheet"></i> Bulk Paste
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. Blog Selection Settings */}
                        {templateType === 'blog' && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <label className="block text-sm font-semibold text-slate-700">Select Blog Post</label>
                                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                    {recentPosts.map(p => {
                                        const alreadySent = sentBlogSlugs.has(p.slug);
                                        return (
                                            <div 
                                                key={p.slug}
                                                onClick={() => setSelectedSlug(p.slug)}
                                                className={`p-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                                                    selectedSlug === p.slug 
                                                        ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-500' 
                                                        : alreadySent 
                                                            ? 'bg-slate-100 border-slate-200 text-slate-500 opacity-60' 
                                                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
                                                }`}
                                            >
                                                <div className="font-medium truncate">{p.title}</div>
                                                {alreadySent && <span className="text-[10px] uppercase font-bold text-amber-600 mt-1 block">Already Sent</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedSlug && sentBlogSlugs.has(selectedSlug) && (
                                    <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                                        Warning: This post was already broadcasted.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={() => setShowConfirm(true)}
                    disabled={isSending || (audienceType === 'single_partner' && (!customPartners[0] || !customPartners[0].email)) || (templateType === 'blog' && !selectedSlug)}
                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <i className="bi bi-send-fill"></i>
                    {isSending ? 'Sending...' : 'Review & Blast'}
                </button>
                
                {result?.success === false && (
                    <div className="p-3 bg-rose-50 text-rose-800 text-sm rounded-lg border border-rose-200">
                        <strong>Error:</strong> {result.message}
                    </div>
                )}
            </div>

            {/* Compose Area Panel */}
            <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3 text-slate-600 text-sm">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="font-medium text-slate-500">New Message</span>
                </div>

                <div className="flex-1 flex flex-col">
                    {templateType === 'generic' ? (
                        <>
                            {/* Subject Line */}
                            <div className="border-b border-slate-100">
                                <input 
                                    type="text" 
                                    placeholder="Subject" 
                                    value={subject} 
                                    onChange={e => setSubject(e.target.value)} 
                                    className="w-full px-6 py-4 text-xl font-medium outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
                                />
                            </div>
                            
                            {/* Headline */}
                            <div className="border-b border-slate-100 bg-slate-50/50">
                                <input 
                                    type="text" 
                                    placeholder="Email Headline (Optional)" 
                                    value={headline} 
                                    onChange={e => setHeadline(e.target.value)} 
                                    className="w-full px-6 py-3 text-sm outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
                                />
                            </div>

                            {/* Body */}
                            <div className="flex-1 flex flex-col w-full bg-white relative min-h-[300px]">
                                <div className="flex-1 overflow-y-auto">
                                    <RichTextEditor 
                                        value={bodyContent} 
                                        onChange={setBodyContent} 
                                        placeholder="Write your email content..." 
                                    />
                                </div>
                                
                                {/* Attachments Area */}
                                <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-sm shadow-sm">
                                                <i className="bi bi-paperclip text-slate-400"></i>
                                                <span className="text-slate-700 truncate max-w-[150px]">{file.filename}</span>
                                                <span className="text-slate-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
                                                <button onClick={() => removeAttachment(idx)} className="ml-1 text-rose-500 hover:text-rose-700">
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="file" 
                                            multiple 
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            className="hidden" 
                                            id="email-attachments"
                                        />
                                        <label 
                                            htmlFor="email-attachments" 
                                            className="cursor-pointer flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg shadow-sm transition-colors"
                                        >
                                            <i className="bi bi-paperclip"></i>
                                            Attach Files
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : templateType === 'badge_outreach' ? (
                        <div className="p-8 flex-1 flex flex-col bg-slate-50/50">
                            <div className="max-w-2xl mx-auto w-full space-y-6">
                                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-indigo-900 text-sm">
                                    <i className="bi bi-info-circle-fill text-lg"></i>
                                    <div>
                                        <p className="font-bold mb-1">Badge Offer Outreach Template</p>
                                        <p className="text-indigo-800 opacity-90">This template automatically includes the standard pitch, their claim link, and badge assets. You can optionally add a personalized note below.</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Personalized Intro (Optional)</label>
                                    <div className="h-64 mt-2 relative border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <RichTextEditor 
                                            value={bodyContent} 
                                            onChange={setBodyContent} 
                                            placeholder="E.g., Hi team, I saw you just opened in Chicago..." 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 flex-1 flex items-center justify-center bg-slate-50/50">
                            <div className="text-center max-w-sm">
                                <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl rotate-[-5deg]">
                                    <i className="bi bi-newspaper"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Blog Broadcast Mode</h3>
                                <p className="text-slate-500 text-sm">
                                    The email content, subject line, and formatting will be automatically generated from the selected blog post.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 text-2xl">
                            <i className="bi bi-rocket-takeoff-fill"></i>
                        </div>
                        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Ready to Broadcast?</h3>
                        <p className="text-center text-slate-600 mb-6">
                            You are about to send the <strong className="text-slate-800 capitalize">{templateType.replace('_', ' ')}</strong> campaign to <strong className="text-indigo-600 text-lg font-bold px-1">{audienceType === 'single_partner' ? customPartners.filter(p => p.email).length : (audienceType === 'pending_owners' ? pendingOwnersCount : (audienceType === 'all' ? subscribers.total : (audienceType === 'consumers' ? subscribers.consumers : subscribers.partners)))}</strong> recipient(s). This action cannot be undone.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={executeSend}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Confirm & Blast
                            </button>
                            <button 
                                onClick={() => setShowConfirm(false)}
                                className="w-full py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
