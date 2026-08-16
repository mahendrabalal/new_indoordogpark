import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import { Resend } from 'resend';

// 1. Sanity Clients
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const writeToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

const sanityReadClient = createClient({
  projectId: projectId || '',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Fresh data
});

const sanityWriteClient = writeToken
  ? createClient({
      projectId: projectId || '',
      dataset,
      apiVersion: '2024-01-01',
      token: writeToken,
      useCdn: false,
    })
  : null;

// Image URL builder for Sanity
const builder = projectId ? imageUrlBuilder(sanityReadClient) : null;
function getImageUrl(source: any): string | null {
  if (!source || !builder) return null;
  try {
    return builder.image(source).width(1200).height(630).quality(85).url();
  } catch {
    return null;
  }
}

async function handleBroadcast(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dryRun') === 'true';
    const isPreview = searchParams.get('preview') === 'true';
    const testEmail = searchParams.get('testEmail');
    const specificSlug = searchParams.get('slug');
    const secret = searchParams.get('secret');

    // Security: Check CRON_SECRET if configured in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && secret !== cronSecret) {
      // In development or if no CRON_SECRET is configured, we allow local calls
      if (process.env.NODE_ENV === 'production' && !secret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
      }
    }

    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!beehiivApiKey || !beehiivPubId || beehiivApiKey.includes('your_')) {
      return NextResponse.json(
        { success: false, error: 'BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not configured in .env.local' },
        { status: 500 }
      );
    }

    // 2. Fetch the latest unpublished blog post
    let postQuery = '';
    if (specificSlug) {
      postQuery = `*[_type == "post" && slug.current == "${specificSlug}" && !(_id in path("drafts.**"))][0]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        featuredImage,
        publishedAt,
        newsletterSent,
        "authorName": author->name
      }`;
    } else {
      postQuery = `*[_type == "post" && !(_id in path("drafts.**")) && newsletterSent != true] | order(publishedAt desc)[0]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        featuredImage,
        publishedAt,
        newsletterSent,
        "authorName": author->name
      }`;
    }

    const post = await sanityReadClient.fetch(postQuery);

    // If no unsent post is found, safely skip
    if (!post) {
      return NextResponse.json({
        success: true,
        action: 'skipped',
        message: 'No new unpublished articles found. Waiting for next schedule (Thursday/Sunday).',
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Prepare Email Content & URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
    const postUrl = `${siteUrl}/blog/${post.slug}?utm_source=beehiiv&utm_medium=newsletter&utm_campaign=auto_weekly_digest`;
    const heroImageUrl =
      getImageUrl(post.mainImage) ||
      post.featuredImage ||
      `${siteUrl}/images/hero/hero.webp`;

    const summaryText =
      post.excerpt ||
      'Discover our latest expert guide on indoor dog facilities, exercise strategies, and year-round canine wellness.';

    const logoUrl = `${siteUrl}/images/logo/logo.png`;

    // High-converting HTML Body for Beehiiv Broadcast
    const emailBodyHtml = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; background-color: #f1f5f9; padding: 24px 12px;">

  <!-- Outer Card Container -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">

    <!-- Top Branded Header with Gradient Background & White Logo Badge -->
    <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%); padding: 32px 20px 28px; text-align: center;">
      <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
        <div style="display: inline-block; background: #ffffff; padding: 10px 24px 8px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
          <img src="${logoUrl}" alt="IndoorDogPark.org" width="145" style="display: block; margin: 0 auto; max-width: 145px; height: auto;" />
        </div>
      </a>
      <p style="color: rgba(255,255,255,0.95); margin: 14px 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">
        🐾 This Week's Featured Dog Care & Recreation Guide
      </p>
    </div>

    <!-- Main Content Area -->
    <div style="padding: 32px 28px 24px;">

      <!-- Featured Post Title -->
      <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; line-height: 1.35; margin: 0 0 20px; letter-spacing: -0.4px;">
        <a href="${postUrl}" style="color: #0f172a; text-decoration: none;">${post.title}</a>
      </h2>

    <!-- Hero Image -->
    ${heroImageUrl ? `
    <div style="margin-bottom: 20px; border-radius: 10px; overflow: hidden; border: 1px solid #f1f5f9;">
      <a href="${postUrl}">
        <img src="${heroImageUrl}" alt="${post.title}" style="width: 100%; height: auto; display: block; max-height: 320px; object-fit: cover;" />
      </a>
    </div>` : ''}

    <!-- Excerpt / Teaser -->
    <p style="font-size: 16px; color: #334155; line-height: 1.65; margin: 0 0 20px;">
      ${summaryText}
    </p>

    <!-- Value Highlights Box -->
    <div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 16px 18px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #475569; font-weight: 500;">
        💡 <strong>In this guide:</strong> We break down actionable safety tips, health benefits, and climate-controlled recreation strategies for your dog.
      </p>
    </div>

    <!-- Call to Action Button -->
    <div style="text-align: center; margin: 32px 0 24px;">
      <a href="${postUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">
        Read the Full Article on IndoorDogPark.org →
      </a>
    </div>

    <!-- Sign-off -->
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #64748b; text-align: center;">
      <p style="margin: 0 0 6px;">Happy exploring with your pup!</p>
      <p style="margin: 0; font-weight: 600; color: #334155;">The IndoorDogPark.org Team</p>
    </div>

  </div> <!-- Close Main Content Area -->

  </div> <!-- Close Outer Card Container -->

</div> <!-- Close Outermost Wrapper -->
    `;

    // 4. Visual Preview Mode (View in browser)
    if (isPreview) {
      return new NextResponse(emailBodyHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // 5. Test Email Mode (Send only to your email via Resend to verify)
    if (testEmail) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        return NextResponse.json({ success: false, error: 'RESEND_API_KEY missing' }, { status: 500 });
      }

      const resend = new Resend(resendApiKey);
      const testSendResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
        to: [testEmail],
        replyTo: 'media@indoordogpark.org',
        subject: `[TEST PREVIEW] New Post: ${post.title}`,
        html: emailBodyHtml,
      });

      if (testSendResult.error) {
        return NextResponse.json({ success: false, error: testSendResult.error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        testMode: true,
        recipient: testEmail,
        post: { id: post._id, title: post.title, slug: post.slug },
        message: `Test preview email successfully sent to ${testEmail}!`,
      });
    }

    // 6. Dry Run Mode
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        message: `Dry run successful for post: "${post.title}"`,
        post: {
          id: post._id,
          title: post.title,
          slug: post.slug,
          postUrl,
          heroImageUrl,
        },
      });
    }

    // 5. Call Beehiiv Posts API to create and blast newsletter
    const beehiivEndpoint = `https://api.beehiiv.com/v2/publications/${beehiivPubId}/posts`;

    const beehiivPayload = {
      title: post.title,
      subtitle: post.excerpt || 'New dog care guide from IndoorDogPark.org',
      status: 'confirmed', // 'confirmed' automatically publishes and emails all subscribers
      send_to: 'all',
      body_content: emailBodyHtml,
      reply_to_address: 'media@indoordogpark.org',
      preview_text: post.excerpt || 'Discover our latest indoor dog park and recreation guide.',
      thumbnail_url: heroImageUrl,
      content_tags: ['Weekly Guide', 'Dog Care'],
    };

    const beehiivRes = await fetch(beehiivEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${beehiivApiKey}`,
      },
      body: JSON.stringify(beehiivPayload),
    });

    const beehiivData = await beehiivRes.json().catch(() => ({}));

    if (!beehiivRes.ok) {
      console.error('[Cron Newsletter] Beehiiv broadcast failed:', beehiivData);
      return NextResponse.json(
        {
          success: false,
          error: beehiivData?.errors || beehiivData?.message || 'Failed to dispatch broadcast via Beehiiv API',
        },
        { status: 502 }
      );
    }

    // 6. Update Sanity CMS to mark this post as sent (Idempotency)
    if (sanityWriteClient) {
      try {
        await sanityWriteClient
          .patch(post._id)
          .set({
            newsletterSent: true,
            newsletterSentAt: new Date().toISOString(),
          })
          .commit();
        console.log(`[Cron Newsletter] Marked post ${post._id} as newsletterSent in Sanity.`);
      } catch (patchErr) {
        console.warn('[Cron Newsletter] Warning: Could not patch Sanity document:', patchErr);
      }
    }

    return NextResponse.json({
      success: true,
      action: 'broadcasted',
      post: {
        id: post._id,
        title: post.title,
        slug: post.slug,
      },
      beehiivPostId: beehiivData?.data?.id,
      timestamp: new Date().toISOString(),
      message: `Successfully broadcasted "${post.title}" to Beehiiv subscribers!`,
    });
  } catch (err) {
    console.error('[Cron Newsletter] Exception:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal cron error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleBroadcast(request);
}

export async function POST(request: NextRequest) {
  return handleBroadcast(request);
}
