const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ParkData {
    name: string;
    email?: string;
    city?: string;
    state?: string;
    [key: string]: any;
}

async function importSubscribers() {
    console.log('🚀 Starting subscriber import...');

    const dataFiles = [
        'public/data/california.json',
        'public/data/washington.json',
        'public/data/mixmatch.json'
    ];
    let allParks: ParkData[] = [];

    for (const file of dataFiles) {
        const dataPath = path.join(process.cwd(), file);
        if (fs.existsSync(dataPath)) {
            const content = fs.readFileSync(dataPath, 'utf-8');
            const data = JSON.parse(content);
            // Handle both array and object with parks array
            const parks = Array.isArray(data) ? data : (data.parks || []);
            console.log(`📂 Loaded ${parks.length} parks from ${file}`);
            allParks = [...allParks, ...parks];
        } else {
            console.warn(`⚠️ File not found: ${file}`);
        }
    }

    console.log(`📂 Total loaded parks: ${allParks.length}`);
    const parksWithEmails = allParks.filter(p => p.email && p.email.trim() !== '');

    // Filter parks with emails
    console.log(`📊 Found ${parksWithEmails.length} parks with email addresses.`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const park of parksWithEmails) {
        const email = park.email!.toLowerCase().trim();
        const metadata = {
            parkName: park.name,
            location: `${park.city || ''}, ${park.state || ''}`.replace(/^, |, $/g, '')
        };

        console.log(`Processing ${park.name} (${email})...`);

        // Upsert subscriber
        // We use upsert to avoid errors if they already exist, but we want to make sure we don't overwrite
        // 'consumer' types if they somehow exist with same email (unlikely for business emails).
        // For safety, let's just use simple insert and ignore conflicts or use upsert.
        // Given the requirement "add these data", upsert is safer to ensure metadata is present.

        const { error } = await supabase
            .from('subscribers')
            .upsert({
                email: email,
                type: 'owner',
                source: 'import_california_json',
                status: 'active',
                metadata: metadata,
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' });

        if (error) {
            console.error(`   ❌ Failed: ${error.message}`);
            failCount++;
        } else {
            console.log(`   ✅ Imported/Updated`);
            successCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Import Summary');
    console.log('='.repeat(60));
    console.log(`Total processed: ${parksWithEmails.length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
}

importSubscribers().catch(console.error);
