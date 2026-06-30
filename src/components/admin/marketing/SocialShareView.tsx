import { useState, useEffect } from 'react';

interface BlogPost {
    title: string;
    slug: string;
    publishedAt?: string;
}

interface Props {
    recentPosts: BlogPost[];
}

interface ShareResult {
    platform: string;
    success: boolean;
    message: string;
    postId?: string;
}

export function SocialShareView({ recentPosts }: Props) {
    const [selectedSlug, setSelectedSlug] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const [shareResults, setShareResults] = useState<ShareResult[]>([]);
    const [shareHistory, setShareHistory] = useState<any[]>([]);

    const selectedPost = recentPosts.find(p => p.slug === selectedSlug);

    const handleShare = async (platform: 'facebook' | 'all') => {
        if (!selectedSlug) return;
        setIsSharing(true);
        setShareResults([]);

        try {
            const res = await fetch('/api/admin/marketing/social-share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, slug: selectedSlug }),
            });
            const json = await res.json();

            if (!res.ok) {
                setShareResults([{ platform, success: false, message: json.error || 'Server error' }]);
                return;
            }

            const results: ShareResult[] = [];
            if (json.results?.facebook) {
                results.push({
                    platform: 'Facebook',
                    success: json.results.facebook.success,
                    message: json.results.facebook.success
                        ? 'Posted to your Facebook Page!'
                        : json.results.facebook.error || 'Failed to post',
                    postId: json.results.facebook.postId,
                });
            }
            // Future: Twitter, Pinterest results
            setShareResults(results);

            // Add to local history
            if (results.some(r => r.success)) {
                setShareHistory(prev => [{
                    slug: selectedSlug,
                    title: selectedPost?.title,
                    platforms: results.filter(r => r.success).map(r => r.platform),
                    timestamp: new Date().toISOString(),
                }, ...prev]);
            }
        } catch (e) {
            setShareResults([{ platform, success: false, message: 'Network error. Is the server running?' }]);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Social Share</h2>
                <p className="text-gray-500 mt-1">Share blog posts to your social media accounts with 1 click.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Post Selector + Share Buttons */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Select Blog Post */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-xl">📝</span> Select Blog Post
                        </h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {recentPosts.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No blog posts found.</p>
                            ) : (
                                recentPosts.map(p => (
                                    <label
                                        key={p.slug}
                                        className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${
                                            selectedSlug === p.slug
                                                ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50'
                                                : 'hover:bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="socialPost"
                                            className="sr-only"
                                            value={p.slug}
                                            checked={selectedSlug === p.slug}
                                            onChange={() => { setSelectedSlug(p.slug); setShareResults([]); }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-sm font-medium truncate ${selectedSlug === p.slug ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                {p.title}
                                            </div>
                                            {p.publishedAt && (
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(p.publishedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        {selectedSlug === p.slug && (
                                            <span className="text-indigo-600 text-sm">✓</span>
                                        )}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-xl">🚀</span> Share To
                        </h3>

                        {!selectedSlug ? (
                            <p className="text-gray-400 text-sm italic">Select a blog post above to enable sharing.</p>
                        ) : (
                            <div className="space-y-3">
                                {/* Facebook */}
                                <button
                                    onClick={() => handleShare('facebook')}
                                    disabled={isSharing}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    <span className="font-medium">{isSharing ? 'Posting...' : 'Share to Facebook Page'}</span>
                                </button>

                                {/* Twitter - Coming Soon */}
                                <button
                                    disabled
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    <span className="font-medium">Share to X (Twitter)</span>
                                    <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                                </button>

                                {/* Pinterest - Coming Soon */}
                                <button
                                    disabled
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                                    <span className="font-medium">Share to Pinterest</span>
                                    <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                                </button>
                            </div>
                        )}

                        {/* Results */}
                        {shareResults.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {shareResults.map((r, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                                            r.success
                                                ? 'bg-green-50 border border-green-200 text-green-800'
                                                : 'bg-red-50 border border-red-200 text-red-800'
                                        }`}
                                    >
                                        <span className="text-base flex-shrink-0">{r.success ? '✅' : '❌'}</span>
                                        <div>
                                            <strong>{r.platform}:</strong> {r.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Preview + Recent History */}
                <div className="space-y-6">
                    {/* Post Preview */}
                    {selectedPost && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Preview</h4>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        IDP
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Indoor Dog Park</div>
                                        <div className="text-xs text-gray-400">Just now</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                    🐾 New Blog Post!<br /><br />
                                    {selectedPost.title}
                                </p>
                                <div className="border rounded-md p-3 bg-white">
                                    <div className="text-xs text-gray-400 uppercase">indoordogpark.org</div>
                                    <div className="text-sm font-medium text-gray-900 mt-1">{selectedPost.title}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Shares */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Shares</h4>
                        {shareHistory.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No shares in this session yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {shareHistory.map((h, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500 mt-0.5">●</span>
                                        <div>
                                            <div className="text-gray-900 font-medium truncate">{h.title}</div>
                                            <div className="text-gray-400 text-xs">
                                                {h.platforms.join(', ')} • {new Date(h.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
