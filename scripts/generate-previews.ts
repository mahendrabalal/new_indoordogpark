import { render } from '@react-email/render';
import { ParkOutreachEmail } from '../src/emails/ParkOutreachEmail';
import { ConsumerWelcomeEmail } from '../src/emails/ConsumerWelcomeEmail';
import { OwnerWelcomeEmail } from '../src/emails/OwnerWelcomeEmail';
import { FollowUpEmail } from '../src/emails/FollowUpEmail';
import * as fs from 'fs';
import * as path from 'path';

// Helper to ensure directory exists
const ensureDirectoryExistence = (filePath: string) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

const outputDir = path.join(process.cwd(), 'email-previews');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

async function generatePreviews() {
    console.log('Generating email previews...');
    const baseUrl = 'https://indoordogpark.org';

    // 1. Park Outreach Email
    console.log('Generating ParkOutreachEmail...');
    const outreachHtml = await render(
        ParkOutreachEmail({
            parkName: 'Paws & Play Indoor Park',
            parkCity: 'Austin',
            parkState: 'TX',
            parkEmail: 'contact@pawsandplay.com',
            personalizedNote: 'We noticed you have a great rating on Google Maps!',
            baseUrl,
        })
    );
    fs.writeFileSync(path.join(outputDir, 'park-outreach.html'), outreachHtml);

    // 2. Consumer Welcome Email
    console.log('Generating ConsumerWelcomeEmail...');
    const consumerHtml = await render(
        ConsumerWelcomeEmail({
            email: 'doglover@example.com',
            baseUrl,
        })
    );
    fs.writeFileSync(path.join(outputDir, 'consumer-welcome.html'), consumerHtml);

    // 3. Owner Welcome Email
    console.log('Generating OwnerWelcomeEmail...');
    const ownerHtml = await render(
        OwnerWelcomeEmail({
            baseUrl,
        })
    );
    fs.writeFileSync(path.join(outputDir, 'owner-welcome.html'), ownerHtml);

    // 4. Follow Up Email
    console.log('Generating FollowUpEmail...');
    const followUpHtml = await render(
        FollowUpEmail({
            parkName: 'Paws & Play Indoor Park',
            parkCity: 'Austin',
            parkState: 'TX',
            baseUrl,
        })
    );
    fs.writeFileSync(path.join(outputDir, 'follow-up.html'), followUpHtml);

    console.log(`Previews generated in ${outputDir}`);
}

generatePreviews().catch(console.error);
