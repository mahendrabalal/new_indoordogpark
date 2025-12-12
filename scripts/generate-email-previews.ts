
import { render } from '@react-email/render';
import * as fs from 'fs';
import * as path from 'path';
import ConsumerWelcomeEmail from '../src/emails/ConsumerWelcomeEmail';
import OwnerWelcomeEmail from '../src/emails/OwnerWelcomeEmail';
import ParkOutreachEmail from '../src/emails/ParkOutreachEmail';
import FollowUpEmail from '../src/emails/FollowUpEmail';
import PremiumListingOfferEmail from '../src/emails/PremiumListingOfferEmail';
import BlogPostEmail from '../src/emails/BlogPostEmail';
import MarketingEmail from '../src/emails/MarketingEmail';

async function generatePreviews() {
    const previewsDir = path.join(process.cwd(), 'email-previews');

    if (!fs.existsSync(previewsDir)) {
        fs.mkdirSync(previewsDir);
    }

    const emails = [
        {
            name: 'consumer-welcome.html',
            component: ConsumerWelcomeEmail({
                email: 'test@example.com',
            }),
        },
        {
            name: 'owner-welcome.html',
            component: OwnerWelcomeEmail({
                baseUrl: 'http://localhost:3000',
            }),
        },
        {
            name: 'park-outreach.html',
            component: ParkOutreachEmail({
                parkName: 'Test Park',
                parkCity: 'Test City',
                parkState: 'TS',
                personalizedNote: 'Test note',
                parkEmail: 'park@test.com',
                baseUrl: 'http://localhost:3000',
            }),
        },
        {
            name: 'follow-up.html',
            component: FollowUpEmail({
                parkName: 'Test Park',
                baseUrl: 'http://localhost:3000',
            }),
        },
        {
            name: 'premium-listing-offer.html',
            component: PremiumListingOfferEmail({
                parkName: 'Earthdog Indoor Dog Park',
                recipientName: 'PJ',
                recipientEmail: 'pjearthdog@gmail.com',
                parkWebsite: 'https://www.earthdogli.com/dog-park',
                parkCity: 'Long Beach',
                parkState: 'CA',
                currentRanking: 15,
                totalParks: 245,
                personalizedNote: 'Your park has received excellent reviews from our community!',
            }),
        },
        {
            name: 'blog-post.html',
            component: BlogPostEmail({
                title: 'How to Start an Indoor Dog Park',
                excerpt: 'Starting an indoor dog park can be a lucrative business opportunity...',
                slug: 'how-to-start-indoor-dog-park',
                imageUrl: 'https://cdn.sanity.io/images/your-project/dataset/image-asset.jpg',
                email: 'subscriber@example.com',
            }),
        },
        {
            name: 'marketing-email.html',
            component: MarketingEmail({
                headline: 'Special Limited Time Offer',
                bodyContent: 'We are offering a **50% discount** on all featured listings this month. \n\nCheck it out!',
                ctaText: 'Claim Offer',
                ctaUrl: 'https://indoordogpark.org/pricing',
                email: 'subscriber@example.com',
            }),
        },
    ];

    for (const email of emails) {
        try {
            const html = await render(email.component);
            fs.writeFileSync(path.join(previewsDir, email.name), html);
            console.log(`✅ Generated ${email.name}`);
        } catch (error) {
            console.error(`❌ Error generating ${email.name}:`, error);
        }
    }
}

generatePreviews();
