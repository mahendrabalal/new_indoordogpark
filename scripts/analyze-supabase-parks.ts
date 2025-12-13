
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

    // 1. Get exact count of all parks (approved and others if needed)
    // Assuming we want approved parks as valid "parks"
    const { count, error: countError } = await supabase
        .from('park_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    if (countError) {
        console.error('Error counting parks:', countError.message);
        return;
    }

    console.log(`\n📊 Total Approved Parks in Supabase: ${count}`);

    // 2. Get newest parks
    console.log('\n🆕 Newest 5 Parks:');

    const { data: newestParks, error: dataError } = await supabase
        .from('park_submissions')
        .select('id, name, city, state, created_at, email')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);

    if (dataError) {
        console.error('Error fetching newest parks:', dataError.message);
        return;
    }

    if (newestParks && newestParks.length > 0) {
        newestParks.forEach((park: any, index: number) => {
            console.log(`${index + 1}. ${park.name}`);
            console.log(`   Location: ${park.city}, ${park.state}`);
            console.log(`   Added: ${new Date(park.created_at).toLocaleDateString()} (${park.created_at})`);
            console.log(`   Email: ${park.email || 'N/A'}`);
            console.log('');
        });
    } else {
        console.log('   No approved parks found.');
    }

    // 3. Check for recent pending submissions
    const { count: pendingCount, error: pendingError } = await supabase
        .from('park_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (!pendingError) {
        console.log(`\n⏳ Pending Submissions: ${pendingCount}`);
    }

}

main().catch(console.error);
