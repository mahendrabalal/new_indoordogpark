import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');

  // Check for secret to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  if (!path && !tag) {
    return NextResponse.json(
      { error: 'Path or tag is required' },
      { status: 400 }
    );
  }

  try {
    // Revalidate specific path
    if (path) {
      await revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    }

    // Revalidate specific tag
    if (tag) {
      // @ts-expect-error - Next.js 16 signature mismatch
      await revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    return NextResponse.json({
      success: true,
      revalidatedAt: new Date().toISOString(),
      path: path || null,
      tag: tag || null,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret, paths = [], tags = [] } = body;

    // Check for secret to prevent unauthorized revalidation (supports query param or body secret)
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');
    const providedSecret = secret || querySecret;

    if (providedSecret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    const revalidatePaths = new Set<string>(paths);
    const revalidateTags = new Set<string>(tags);

    // Automatic tag and path inference from Sanity Webhook payloads
    const docType = body._type || body.type;
    if (docType) {
      switch (docType) {
        case 'post':
          revalidateTags.add('blog-posts');
          revalidateTags.add('blog-list');
          if (body.slug?.current) {
            revalidateTags.add(`blog-post-${body.slug.current}`);
            revalidatePaths.add(`/blog/${body.slug.current}`);
          }
          break;
        case 'author':
          revalidateTags.add('blog-authors');
          if (body.slug?.current) {
            revalidateTags.add(`blog-author-${body.slug.current}`);
          }
          break;
        case 'category':
          revalidateTags.add('blog-categories');
          break;
        case 'tag':
          revalidateTags.add('blog-tags');
          break;
        case 'stateContent':
          revalidateTags.add('state-content');
          revalidateTags.add('sanity-content');
          break;
        case 'cityContent':
          revalidateTags.add('city-content');
          revalidateTags.add('sanity-content');
          break;
        case 'parkSubmission':
          revalidateTags.add('park-submissions');
          revalidateTags.add('parks');
          break;
      }
    }

    const results = {
      paths: [] as string[],
      tags: [] as string[],
    };

    // Revalidate multiple paths
    for (const path of revalidatePaths) {
      try {
        await revalidatePath(path);
        results.paths.push(path);
        console.log(`Revalidated path: ${path}`);
      } catch (error) {
        console.error(`Failed to revalidate path ${path}:`, error);
      }
    }

    // Revalidate multiple tags
    for (const tag of revalidateTags) {
      try {
        // @ts-expect-error - Next.js 16 signature mismatch
        await revalidateTag(tag);
        results.tags.push(tag);
        console.log(`Revalidated tag: ${tag}`);
      } catch (error) {
        console.error(`Failed to revalidate tag ${tag}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      revalidatedAt: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Batch revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to process revalidation request' },
      { status: 500 }
    );
  }
}