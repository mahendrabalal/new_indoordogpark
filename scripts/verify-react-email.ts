
import { generateParkOutreachEmail, generateOwnerWelcomeEmail } from '../src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify() {
    console.log('🧪 Verifying React Email generation...');

    try {
        // Test Outreach Email
        console.log('\n--- Generating Outreach Email ---');
        const outreachHtml = await generateParkOutreachEmail({
            parkName: 'Test Park',
            parkEmail: 'test@example.com',
            parkCity: 'Test City',
            parkState: 'TS',
            personalizedNote: 'This is a test note.',
        });
        console.log('✅ Outreach Email generated successfully!');
        console.log('Snippet:', outreachHtml.substring(0, 100).replace(/\n/g, ' '));

        // Test Welcome Email
        console.log('\n--- Generating Owner Welcome Email ---');
        const welcomeHtml = await generateOwnerWelcomeEmail();
        console.log('✅ Owner Welcome Email generated successfully!');
        console.log('Snippet:', welcomeHtml.substring(0, 100).replace(/\n/g, ' '));

        // Check for critical content
        if (welcomeHtml.includes('FIRST50')) {
            console.log('✅ Code validated: FIRST50 found in welcome email.');
        } else {
            console.error('❌ Missing FIRST50 code in welcome email!');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error generating emails:', error);
        process.exit(1);
    }
}

verify();
