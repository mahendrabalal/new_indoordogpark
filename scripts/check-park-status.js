const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function checkParkStatus() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('📊 Checking park submission status...\n');

  // Check total parks
  const { count: totalParks, error: totalError } = await supabase
    .from('park_submissions')
    .select('*', { count: 'exact', head: true });

  if (!totalError) {
    console.log(`Total parks in database: ${totalParks}`);
  }

  // Check by status
  const statuses = ['pending', 'approved', 'rejected'];

  for (const status of statuses) {
    const { count, error } = await supabase
      .from('park_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (!error) {
      console.log(`${status.toUpperCase()}: ${count}`);
    }
  }

  // Check parks with emails
  console.log('\n📧 Parks with email addresses:');

  const { data: parksWithEmails, error: emailError } = await supabase
    .from('park_submissions')
    .select('name, email, status, city, state')
    .not('email', 'is', null)
    .not('email', 'eq', '');

  if (!emailError) {
    console.log(`Total parks with emails: ${parksWithEmails.length}\n`);

    // Group by status
    const byStatus = parksWithEmails.reduce((acc, park) => {
      acc[park.status] = (acc[park.status] || 0) + 1;
      return acc;
    }, {});

    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} parks`);
    });

    // List some examples
    if (parksWithEmails.length > 0) {
      console.log('\n📝 Examples of parks with emails:');
      parksWithEmails.slice(0, 10).forEach(park => {
        console.log(`  • ${park.name} (${park.city}, ${park.state}) - ${park.status}`);
      });

      if (parksWithEmails.length > 10) {
        console.log(`  ... and ${parksWithEmails.length - 10} more`);
      }
    }
  }

  // Check if there are any parks without emails that might be imported
  const { data: parksWithoutEmails, error: noEmailError } = await supabase
    .from('park_submissions')
    .select('name, status, city, state')
    .or('email.is.null,email.eq.');

  if (!noEmailError && parksWithoutEmails.length > 0) {
    console.log(`\n⚠️  Parks without email addresses: ${parksWithoutEmails.length}`);
    console.log('These parks need email addresses added before outreach.');
  }
}

checkParkStatus().catch(console.error);