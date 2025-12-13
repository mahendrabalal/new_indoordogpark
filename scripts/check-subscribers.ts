
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing Supabase environment variables. Please check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

async function main() {
    console.log('🚀 Connecting to Supabase...');

    // 1. Get total count
    const { count, error: countError } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting subscribers:', countError.message);
        return;
    }

    console.log(`\n📊 Total Subscribers: ${count}`);

    // 2. Get newest subscribers
    console.log('\n🆕 Newest 10 Subscribers:');

    const { data: subscribers, error: dataError } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (dataError) {
        console.error('Error fetching subscribers:', dataError.message);
        return;
    }

    if (subscribers && subscribers.length > 0) {
        subscribers.forEach((sub: any, index: number) => {
            console.log(`${index + 1}. ${sub.email}`);
            console.log(`   Type: ${sub.type}`);
            console.log(`   Source: ${sub.source}`);
            console.log(`   Status: ${sub.status}`);
            // created_at might be null if not in schema, but usually is there. 
            // The screenshot doesn't show created_at but shows id, email, type, source, status.
            // Assuming created_at exists or we use internal default.
            if (sub.created_at) {
                console.log(`   Added: ${new Date(sub.created_at).toLocaleString()}`);
            }
            console.log('');
        });
    } else {
        console.log('   No subscribers found.');
    }
}

main().catch(console.error);
