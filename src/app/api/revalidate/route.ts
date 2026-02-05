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
    const body = await request.json();
    const { secret, paths = [], tags = [] } = body;

    // Check for secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    const results = {
      paths: [] as string[],
      tags: [] as string[],
    };

    // Revalidate multiple paths
    for (const path of paths) {
      try {
        await revalidatePath(path);
        results.paths.push(path);
        console.log(`Revalidated path: ${path}`);
      } catch (error) {
        console.error(`Failed to revalidate path ${path}:`, error);
      }
    }

    // Revalidate multiple tags
    for (const tag of tags) {
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