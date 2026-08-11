const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Using Service Role Key:', supabaseKey ? 'PRESENT' : 'MISSING');

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('park_submissions')
    .select('id, name')
    .limit(1);
    
  if (error) console.error("Error:", error);
  else console.log("Success:", data);
}

main();
