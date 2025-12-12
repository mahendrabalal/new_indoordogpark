
const { Resend } = require('resend');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const { createClient: createSanityClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');
const React = require('react');
const { render } = require('@react-email/render');
const { BlogPostEmail } = require('../src/emails/BlogPostEmail');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Parse command line arguments
const args = process.argv.slice(2);
const slugArg = args.find(arg => arg.startsWith('--slug='));
const dryRun = args.includes('--dry-run');
const testEmailArg = args.find(arg => arg.startsWith('--test-email='));

const slug = slugArg ? slugArg.split('=')[1] : null;
const testEmail = testEmailArg ? testEmailArg.split('=')[1] : null;

if (!slug) {
    console.error('❌ Error: Please provide a slug using --slug=your-post-slug');
    process.exit(1);
}

// Sanity Configuration
const sanityConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false, // We want fresh data
};

// Builder for image URLs
const builder = imageUrlBuilder(sanityConfig);
function urlFor(source) {
    return builder.image(source);
}

async function main() {
    console.log(`🚀 Starting Blog Broadcast for slug: "${slug}"`);
    if (dryRun) console.log('🧪 DRY RUN MODE: No emails will be sent.');
    if (testEmail) console.log(`🧪 TEST MODE: Sending only to ${testEmail}`);

    // 1. Initialize Clients
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseKey || !resendKey) {
        console.error('❌ Missing environment variables (SUPABASE_URL, SERVICE_ROLE_KEY, or RESEND_API_KEY)');
        process.exit(1);
    }

    if (!sanityConfig.projectId) {
        console.error('❌ Missing Sanity config');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);
    const sanity = createSanityClient(sanityConfig);

    // 2. Fetch Blog Post
    console.log('📄 Fetching blog post from Sanity...');
    const postQuery = `*[_type == "post" && slug.current == "${slug}"][0]{
        title,
        slug,
        excerpt,
        mainImage,
        publishedAt
    }`;

    const post = await sanity.fetch(postQuery);

    if (!post) {
        console.error(`❌ Blog post not found for slug: ${slug}`);
        process.exit(1);
    }

    console.log(`✅ Found post: "${post.title}"`);

    // 3. Fetch Subscribers
    let subscribers = [];
    if (testEmail) {
        subscribers = [{ email: testEmail, type: 'test' }];
        console.log(`👥 Targeted recipient: ${testEmail}`);
    } else {
        console.log('👥 Fetching active subscribers...');
        const { data, error } = await supabase
            .from('subscribers')
            .select('email, type')
            .eq('status', 'active');

        if (error) {
            console.error('❌ Error fetching subscribers:', error);
            process.exit(1);
        }
        subscribers = data || [];
        console.log(`✅ Found ${subscribers.length} active subscribers.`);
    }

    if (subscribers.length === 0) {
        console.log('⚠️ No subscribers to send to.');
        process.exit(0);
    }

    // 4. Send Emails

    // Get image URL if exists
    let imageUrl = undefined;
    if (post.mainImage) {
        imageUrl = urlFor(post.mainImage).width(800).url();
    } else if (post.featuredImage) {
        imageUrl = post.featuredImage;
    }

    // Save preview if dry run
    if (dryRun) {
        const previewEmail = React.createElement(BlogPostEmail, {
            title: post.title,
            excerpt: post.excerpt || "Check out our latest article on IndoorDogPark.org!",
            slug: post.slug.current,
            imageUrl: imageUrl,
            email: 'preview@example.com'
        });
        const htmlEmail = await render(previewEmail);

        const previewPath = 'preview-blog-email.html';
        fs.writeFileSync(previewPath, htmlEmail);
        console.log(`📝 Preview saved to ${previewPath}`);
        console.log('✅ Dry run complete.');
        return;
    }

    // Confirmation before blast (unless test email)
    if (!testEmail) {
        console.log('⚠️  WARNING: You are about to send real emails to all subscribers.');
        console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (const sub of subscribers) {
        if (!sub.email) continue;

        // Simple rate limiting
        await new Promise(r => setTimeout(r, 200)); // 5 emails/sec max

        process.stdout.write(`📧 Sending to ${sub.email}... `);

        try {
            // Render individually to include unsubscribe link specific to user
            const emailComponent = React.createElement(BlogPostEmail, {
                title: post.title,
                excerpt: post.excerpt || "Check out our latest article on IndoorDogPark.org!",
                slug: post.slug.current,
                imageUrl: imageUrl,
                email: sub.email
            });
            const htmlEmail = await render(emailComponent);

            const data = await resend.emails.send({
                from: 'IndoorDogPark <newsletter@indoordogpark.org>',
                to: sub.email,
                subject: `New Post: ${post.title}`,
                html: htmlEmail,
                replyTo: 'media@indoordogpark.org'
            });

            if (data.error) {
                console.log(`❌ Failed: ${data.error.message}`);
                failCount++;
                results.push({ email: sub.email, status: 'failed', error: data.error });
            } else {
                console.log(`✅ Sent`);
                successCount++;
                results.push({ email: sub.email, status: 'sent', id: data.data?.id });
            }
        } catch (err) {
            console.log(`❌ Exception: ${err.message}`);
            failCount++;
            results.push({ email: sub.email, status: 'error', error: err.message });
        }
    }

    // 5. Summary
    console.log('\n' + '='.repeat(40));
    console.log('📝 Broadcast Summary');
    console.log('='.repeat(40));
    console.log(`Total Target: ${subscribers.length}`);
    console.log(`Sent: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    // Log file
    const logFile = `broadcast-log-${Date.now()}.json`;
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`📄 Log saved to ${logFile}`);
}

main().catch(console.error);
