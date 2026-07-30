const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function applyMigration() {
  console.log('Applying email_queue migration...');
  const migrationPath = path.join(__dirname, 'supabase/migrations/20260727000000_add_email_queue.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✅ Migration applied successfully via RPC!');
    } else {
      const error = await response.text();
      console.log('⚠️ Failed to apply via RPC:', error);
      console.log('\nPlease run the following SQL manually in your Supabase SQL Editor:');
      console.log(sql);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

applyMigration().catch(console.error);
