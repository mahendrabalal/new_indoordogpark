import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { postToFacebookPage } from '@/lib/facebook';
import { fetchPostBySlug } from '@/lib/sanity-api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Auth Check
        const supabase = await createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userMetadata = user.user_metadata as { role?: string } | undefined;
        if (userMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { platform, slug } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Blog post slug is required' }, { status: 400 });
        }

        // Fetch the blog post
        const post = await fetchPostBySlug(slug);
        if (!post) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        const results: Record<string, any> = {};

        if (platform === 'facebook' || platform === 'all') {
            try {
                const fbResult = await postToFacebookPage(
                    post.title,
                    post.excerpt || '',
                    post.slug
                );
                results.facebook = fbResult;
            } catch (err) {
                results.facebook = {
                    success: false,
                    error: err instanceof Error ? err.message : 'Unknown error',
                };
            }
        }

        // Future: Add Twitter, Pinterest sharing here
        // if (platform === 'twitter' || platform === 'all') { ... }
        // if (platform === 'pinterest' || platform === 'all') { ... }

        const anySuccess = Object.values(results).some((r: any) => r.success);

        return NextResponse.json({
            success: anySuccess,
            results,
            post: { title: post.title, slug: post.slug },
        });

    } catch (error) {
        const e = error as Error;
        console.error('Social share error:', e);
        return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
    }
}
