
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

supabase.from('marketing_contacts').select('*', { count: 'exact', head: true }).then(({ count, error }) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Total Marketing Contacts:', count);
        if (count > 0) {
            supabase.from('marketing_contacts').select('email, status').limit(5).then(({ data }) => console.log('Sample:', data));
        }
    }
});
