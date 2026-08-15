const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing raw fetch to Supabase URL with ANON Key...');

async function main() {
  const url = `${supabaseUrl}/rest/v1/park_submissions?select=id,name,status&status=eq.approved&limit=1`;
  const res = await fetch(url, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const data = await res.text();
  console.log('Response Status:', res.status);
  console.log('Response Body:', data);
}

main();
