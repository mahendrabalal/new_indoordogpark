'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MarketingSidebar } from '@/components/admin/marketing/MarketingSidebar';
import { DashboardView } from '@/components/admin/marketing/DashboardView';
import { AudiencesView } from '@/components/admin/marketing/AudiencesView';
import { CampaignHistoryView } from '@/components/admin/marketing/CampaignHistoryView';
import { CampaignBuilderView } from '@/components/admin/marketing/CampaignBuilderView';

export const dynamic = 'force-dynamic';

interface SubscriberMetadata {
    parkName?: string;
    location?: string;
}

export default function MarketingPage() {
    const [activeView, setActiveView] = useState<'dashboard' | 'audiences' | 'history' | 'builder'>('dashboard');
    
    // Shared Data
    const [subscribers, setSubscribers] = useState<{ total: number; owners: number; consumers: number }>({ total: 0, owners: 0, consumers: 0 });
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [approvedParks, setApprovedParks] = useState<any[]>([]);

    useEffect(() => {
        fetchSubscribers();
        fetchPosts();
        fetchParks();
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
            if (json.result) setRecentPosts(json.result);
        } catch (e) {
            console.error('Failed to fetch posts', e);
        }
    };

    const fetchParks = async () => {
        try {
            const res = await fetch('/api/admin/marketing/audiences');
            if (res.ok) {
                const data = await res.json();
                setApprovedParks(data);
            }
        } catch (e) {
            console.error('Failed to fetch parks', e);
        }
    };

    const handleSend = async (payload: any) => {
        try {
            const res = await fetch('/api/admin/marketing/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            
            if (!res.ok) {
                return { success: false, message: json.error || `Server error (${res.status}). Please check you are logged in as admin.` };
            }

            // Refresh data after sending
            fetchParks();

            // Treat "no recipients" as a soft failure
            if (json.sent === 0 || json.total === 0) {
                return { success: false, message: json.message || 'No recipients found for this audience.' };
            }

            return { 
                success: true, 
                message: json.message || 'Campaign launched successfully!', 
                details: json.details 
            };
        } catch (e) {
            console.error('Send campaign error:', e);
            return { success: false, message: 'Network error occurred. Is the server running?' };
        }
    };

    return (
        <div className="flex h-full min-h-screen bg-white">
            <MarketingSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 px-8 py-4 bg-gray-50/50">
                {activeView === 'dashboard' && <DashboardView stats={subscribers} onNavigate={setActiveView} />}
                {activeView === 'audiences' && <AudiencesView parks={approvedParks} />}
                {activeView === 'builder' && <CampaignBuilderView subscribers={subscribers} recentPosts={recentPosts} approvedParks={approvedParks} onSend={handleSend} />}
                {activeView === 'history' && <CampaignHistoryView />}
            </main>
        </div>
    );
}
