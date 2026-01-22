const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local', override: true });

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
    console.log('🚀 Starting subscriber import sync...');

    // List of state-specific JSON files to import
    const dataDir = path.join(process.cwd(), 'public/data');
    const dataFiles = fs.readdirSync(dataDir)
        .filter((file: string) => file.endsWith('.json') && !file.includes('keyword_clusters'));

    let totalProcessed = 0;
    let successCount = 0;
    let failCount = 0;

    for (const file of dataFiles) {
        const dataPath = path.join(dataDir, file);
        const content = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(content);
        const parks = Array.isArray(data) ? data : (data.parks || []);

        const sourceLab = `import_${path.basename(file, '.json')}`;
        console.log(`📂 Processing ${parks.length} parks from ${file} (Source: ${sourceLab})`);

        const parksWithEmails = parks.filter((p: ParkData) => p.email && p.email.trim() !== '');

        for (const park of parksWithEmails) {
            totalProcessed++;
            const email = park.email!.toLowerCase().trim();
            const metadata = {
                parkName: park.name,
                location: `${park.city || ''}, ${park.state || ''}`.replace(/^, |, $/g, '')
            };

            const { error } = await supabase
                .from('subscribers')
                .upsert({
                    email: email,
                    type: 'owner',
                    source: sourceLab,
                    status: 'active',
                    metadata: metadata,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'email' });

            if (error) {
                console.error(`   ❌ Failed ${park.name} (${email}): ${error.message}`);
                failCount++;
            } else {
                successCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Sync Summary');
    console.log('='.repeat(60));
    console.log(`Total found with emails: ${totalProcessed}`);
    console.log(`✅ Successful sync: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
}

importSubscribers().catch(console.error);
