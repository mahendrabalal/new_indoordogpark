
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log('🚀 Checking marketing_contacts table...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('❌ Missing Supabase environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Get count
    const { count, error: countError } = await supabase
        .from('marketing_contacts')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('❌ Error counting marketing_contacts:', countError.message);
        // It's possible the table doesn't exist
        return;
    }

    console.log(`\n📊 Total Marketing Contacts: ${count}`);

    // 2. Sample data
    if (count > 0) {
        console.log('\n👀 Sample Contacts (First 5):');
        const { data: contacts, error } = await supabase
            .from('marketing_contacts')
            .select('name, email, source, status')
            .limit(5);

        if (error) {
            console.error('Error fetching sample:', error.message);
        } else {
            contacts.forEach((c, i) => {
                console.log(`${i + 1}. ${c.name} (${c.email}) - Source: ${c.source}, Status: ${c.status}`);
            });
        }
    }
}

main().catch(console.error);
