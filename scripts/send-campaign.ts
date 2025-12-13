
import { EmailCampaignService } from '../src/lib/email-campaign-service';
import { ParkOutreachEmail } from '../src/emails/ParkOutreachEmail';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as React from 'react';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    // 1. Configure Service
    const service = new EmailCampaignService({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        resendApiKey: process.env.RESEND_API_KEY!,
    });

    // 2. Get Recipients
    // We want all active 'owner' subscribers
    const recipients = await service.getRecipients('subscribers', '*', {
        type: 'owner',
        status: 'active',
    });

    if (recipients.length === 0) {
        console.log('No recipients found.');
        return;
    }

    // 3. Define Generators
    const subjectGenerator = (recipient: any) =>
        `Partner with IndoorDogPark.org - Upgrade Your Listing`;

    const templateGenerator = (recipient: any) => {
        // Logic to extract/format data for the component
        // If name is not in DB, use email username or generic
        const name = recipient.metadata?.parkName || recipient.email.split('@')[0];

        return React.createElement(ParkOutreachEmail, {
            parkName: name,
            parkEmail: recipient.email,
            parkCity: recipient.metadata?.city || '',
            parkState: recipient.metadata?.state || '',
            baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org',
        });
    };

    // 4. Run Campaign
    await service.runCampaign(recipients, subjectGenerator, templateGenerator);
}

main().catch(console.error);
