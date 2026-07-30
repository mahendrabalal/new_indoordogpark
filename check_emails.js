const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkStatus() {
  console.log('--- Checking email_campaign_logs for today ---');
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { data: logs, error: logsError } = await supabase
    .from('email_campaign_logs')
    .select('status, created_at, recipient_email')
    .gte('created_at', todayStart.toISOString());

  if (logsError) {
    console.error('Error fetching logs:', logsError.message);
  } else {
    console.log(`Found ${logs.length} logs today.`);
    const sent = logs.filter(l => l.status === 'sent').length;
    const failed = logs.filter(l => l.status === 'failed' || l.status === 'draft').length;
    console.log(`Sent: ${sent}`);
    console.log(`Failed/Draft: ${failed}`);
  }

  console.log('\n--- Checking email_queue ---');
  const { data: queue, error: queueError } = await supabase
    .from('email_queue')
    .select('*');

  if (queueError) {
    console.error('Error fetching queue:', queueError.message);
  } else {
    console.log(`Found ${queue.length} items in email_queue.`);
  }
}

checkStatus();
