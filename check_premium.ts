import { supabaseAdminClient } from './src/lib/supabase-admin';

async function checkPremiumPark() {
    const { data, error } = await supabaseAdminClient
        .from('park_submissions')
        .select('*')
        .eq('listing_type', 'featured')
        .eq('status', 'approved');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Premium Parks:', JSON.stringify(data, null, 2));
}

checkPremiumPark();
