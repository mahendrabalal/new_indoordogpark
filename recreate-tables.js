const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://jmvgnrwqcjtrudadxttq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdmducndxY2p0cnVkYWR4dHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQyNzkxMiwiZXhwIjoyMDcwMDAzOTEyfQ.yr5qxPSeWnwMG8u89LjQ_1vdTJmhPVeM9eRF-cudAqk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function recreateTables() {
  console.log('🔧 Recreating tables from scratch...\n');

  // Step 1: Drop existing tables
  console.log('Step 1: Dropping existing tables...');

  const dropStatements = [
    'DROP TABLE IF EXISTS subscriptions CASCADE',
    'DROP TABLE IF EXISTS park_submissions CASCADE',
  ];

  for (const sql of dropStatements) {
    console.log(`  Executing: ${sql}`);
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok || response.status === 404) {
      console.log('  ✅ Done\n');
    }
  }

  console.log('Step 2: Reading migration file...');
  const migrationPath = path.join(__dirname, 'supabase/migrations/create_park_listings_tables.sql');
  const fullSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('Step 3: Creating tables with complete structure...\n');

  // Remove the IF NOT EXISTS since we just dropped the tables
  const sql = fullSQL.replace(/IF NOT EXISTS /g, '');

  // Split into statements and execute
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute...\n`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`[${i+1}/${statements.length}] Executing: ${stmt.substring(0, 60)}...`);

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ query: stmt + ';' })
      });

      if (response.ok) {
        console.log('  ✅ Success');
      } else {
        const error = await response.text();
        console.log('  ⚠️ ', error.substring(0, 100));
      }
    } catch (err) {
      console.log('  ⚠️ ', err.message);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log('\n🔍 Verifying...\n');

  // Wait for cache
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Verify
  const { data, error } = await supabase
    .from('park_submissions')
    .select('id, name, listing_type, created_at')
    .limit(1);

  if (error) {
    console.log('❌ Verification failed:', error.message);
    console.log('\nThe RPC method might not exist.');
    console.log('Please run the SQL manually in Supabase Dashboard.');
  } else {
    console.log('✅ Tables created successfully!');
    console.log('\n🎉 Database is ready!');
    console.log('\nYou can now test the listing submission at:');
    console.log('http://localhost:3001/list-property');
  }
}

recreateTables().catch(console.error);
