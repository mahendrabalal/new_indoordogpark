import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export async function POST(req: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Update subscriber status to unsubscribed
        const { error } = await supabase
            .from('subscribers')
            .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
            .eq('email', email.toLowerCase());

        if (error) {
            console.error('Error unsubscribing:', error);
            return NextResponse.json(
                { error: 'Failed to unsubscribe. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'You have been successfully unsubscribed.',
        });
    } catch (error) {
        console.error('Unsubscribe API error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
