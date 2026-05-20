import { NextRequest } from 'next/server';
import { POST as subscribePost } from './subscribe/route';

// Backwards-compatible endpoint for older forms/components that still post to `/api/newsletter`.
// Delegates to the canonical `/api/newsletter/subscribe` implementation.
export async function POST(req: NextRequest) {
  return subscribePost(req);
}

