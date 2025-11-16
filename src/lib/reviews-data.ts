import { createClient } from '@supabase/supabase-js';

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  created_at: string;
}

/**
 * Creates a public Supabase client (no cookies) for static generation
 * This allows the function to be used during static page generation
 */
function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Fetches approved reviews for a park (server-side)
 * Used for generating structured data schemas
 * 
 * Best practices:
 * - Server-side rendering for SEO
 * - Limited to 10 most recent reviews for performance
 * - Graceful error handling
 * - Filters by status if column exists
 * - Uses public client (no cookies) to allow static generation
 */
export async function getParkReviews(parkId: string): Promise<Review[]> {
  try {
    const supabase = createPublicClient();
    
    // Build base query - try with status filter first
    let query = supabase
      .from('reviews')
      .select('id, rating, title, content, created_at')
      .eq('park_id', parkId)
      .eq('status', 'approved') // Try filtering by status
      .order('created_at', { ascending: false })
      .limit(10); // Limit to most recent 10 reviews for structured data (Google's recommendation)

    let { data: reviews, error } = await query;

    // If status column doesn't exist, retry without the filter
    // PostgreSQL error code 42703 = undefined_column
    if (error && error.code === '42703' && error.message?.includes('status')) {
      query = supabase
        .from('reviews')
        .select('id, rating, title, content, created_at')
        .eq('park_id', parkId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      const result = await query;
      reviews = result.data;
      error = result.error;
    }

    if (error) {
      // Log error but don't throw - graceful degradation
      console.error('Error fetching reviews for structured data:', error);
      return [];
    }

    return (reviews || []) as Review[];
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error('Error in getParkReviews:', error);
    return [];
  }
}

