#!/usr/bin/env ts-node

/**
 * Script to send outreach emails to indoor dog parks
 * 
 * Usage:
 *   npx ts-node scripts/send-park-outreach.ts [options]
 * 
 * Options:
 *   --file <path>     Path to JSON file with park data (default: public/data/california.json)
 *   --test            Test mode - generates emails but doesn't send them
 *   --limit <number>  Limit number of emails to send (default: 10)
 *   --delay <ms>      Delay between emails in milliseconds (default: 2000)
 *   --filter-type     Filter by business type (e.g., "Indoor Dog Park")
 */

const fs = require('fs');
const path = require('path');

interface ParkData {
  id: string;
  name: string;
  email?: string;
  city?: string;
  state?: string;
  website?: string;
  businessType?: string;
  [key: string]: any;
}

interface SendResult {
  parkName: string;
  email: string;
  success: boolean;
  error?: string;
  emailId?: string;
}

// Import email generation function directly in test mode
let generateParkOutreachEmail: any = null;
if (process.argv.includes('--test')) {
  // In test mode, we'll generate emails directly without API call
  try {
    // Try to load the email function from the compiled Next.js app
    // For test mode, we'll generate a simple preview
    generateParkOutreachEmail = function(data: any) {
      return `
        <html>
          <body>
            <h1>Test Email for ${data.parkName}</h1>
            <p>This is a test email preview.</p>
            <p>Park: ${data.parkName}</p>
            <p>Email: ${data.parkEmail}</p>
            <p>Location: ${data.parkCity || ''}, ${data.parkState || ''}</p>
          </body>
        </html>
      `;
    };
  } catch (e) {
    // Fallback if can't load
  }
}

async function sendOutreachEmail(
  park: ParkData,
  baseUrl: string,
  apiToken?: string,
  testMode: boolean = false
): Promise<SendResult> {
  if (!park.email) {
    return {
      parkName: park.name,
      email: 'N/A',
      success: false,
      error: 'No email address',
    };
  }

  // In test mode, generate email locally without API call
  if (testMode) {
    try {
      const emailData = {
        parkName: park.name,
        parkEmail: park.email,
        parkCity: park.city,
        parkState: park.state,
        parkWebsite: park.website,
      };
      
      // Generate preview (simplified for test mode)
      const emailPreview = generateParkOutreachEmail 
        ? generateParkOutreachEmail(emailData)
        : `Email preview for ${park.name}`;
      
      return {
        parkName: park.name,
        email: park.email,
        success: true,
        emailId: 'test-preview',
      };
    } catch (error) {
      return {
        parkName: park.name,
        email: park.email,
        success: true, // Still success in test mode, just preview
        emailId: 'test-preview',
      };
    }
  }

  // Real mode: call API
  try {
    const response = await fetch(`${baseUrl}/api/outreach/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
      },
      body: JSON.stringify({
        parkName: park.name,
        parkEmail: park.email,
        parkCity: park.city,
        parkState: park.state,
        parkWebsite: park.website,
        testMode: false,
      }),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return {
        parkName: park.name,
        email: park.email,
        success: false,
        error: `Server returned non-JSON response. Is the dev server running? (${response.status})`,
      };
    }

    const data = await response.json();

    if (data.success) {
      return {
        parkName: park.name,
        email: park.email,
        success: true,
        emailId: data.emailId,
      };
    } else {
      return {
        parkName: park.name,
        email: park.email,
        success: false,
        error: data.error || 'Unknown error',
      };
    }
  } catch (error) {
    return {
      parkName: park.name,
      email: park.email,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function loadParkData(filePath: string): ParkData[] {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Handle both array and object with parks array
    if (Array.isArray(data)) {
      return data;
    } else if (data.parks && Array.isArray(data.parks)) {
      return data.parks;
    } else {
      throw new Error('Invalid JSON structure. Expected array or object with "parks" array.');
    }
  } catch (error) {
    console.error(`Error loading park data from ${filePath}:`, error);
    process.exit(1);
  }
}

function filterParks(parks: ParkData[], options: {
  filterType?: string;
  hasEmail?: boolean;
}): ParkData[] {
  let filtered = parks;

  if (options.hasEmail) {
    filtered = filtered.filter(p => p.email && p.email.trim() !== '');
  }

  if (options.filterType) {
    filtered = filtered.filter(p => 
      p.businessType?.toLowerCase().includes(options.filterType!.toLowerCase())
    );
  }

  return filtered;
}

async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let dataFile = 'public/data/california.json';
  let testMode = false;
  let limit = 10;
  let delay = 2000;
  let filterType: string | undefined;
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiToken = process.env.OUTREACH_API_TOKEN;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file':
        dataFile = args[++i];
        break;
      case '--test':
        testMode = true;
        break;
      case '--limit':
        limit = parseInt(args[++i], 10) || 10;
        break;
      case '--delay':
        delay = parseInt(args[++i], 10) || 2000;
        break;
      case '--filter-type':
        filterType = args[++i];
        break;
      case '--url':
        baseUrl = args[++i];
        break;
      case '--help':
        console.log(`
Usage: npx ts-node scripts/send-park-outreach.ts [options]

Options:
  --file <path>        Path to JSON file with park data (default: public/data/california.json)
  --test               Test mode - generates emails but doesn't send them
  --limit <number>     Limit number of emails to send (default: 10)
  --delay <ms>         Delay between emails in milliseconds (default: 2000)
  --filter-type <type> Filter by business type (e.g., "Indoor Dog Park")
  --url <url>          Base URL for API (default: http://localhost:3000)
  --help               Show this help message

Environment Variables:
  OUTREACH_API_TOKEN   Optional API token for authentication
  NEXT_PUBLIC_BASE_URL  Base URL for the application

Examples:
  # Test mode - generate 5 emails without sending
  npx ts-node scripts/send-park-outreach.ts --test --limit 5

  # Send to indoor dog parks only
  npx ts-node scripts/send-park-outreach.ts --filter-type "Indoor Dog Park" --limit 20

  # Use custom data file
  npx ts-node scripts/send-park-outreach.ts --file public/data/washington.json
        `);
        process.exit(0);
    }
  }

  console.log('🚀 Starting park outreach email campaign...\n');
  console.log(`Configuration:`);
  console.log(`  Data file: ${dataFile}`);
  console.log(`  Test mode: ${testMode ? 'YES (emails will NOT be sent)' : 'NO (emails WILL be sent)'}`);
  console.log(`  Limit: ${limit} emails`);
  console.log(`  Delay: ${delay}ms between emails`);
  console.log(`  Filter type: ${filterType || 'None'}`);
  console.log(`  Base URL: ${baseUrl}\n`);

  if (!testMode) {
    console.log('⚠️  WARNING: This will send real emails!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Load park data
  console.log('📂 Loading park data...');
  const allParks = loadParkData(dataFile);
  console.log(`   Loaded ${allParks.length} parks\n`);

  // Filter parks
  const parks = filterParks(allParks, {
    hasEmail: true,
    filterType,
  });

  console.log(`📊 Filtered to ${parks.length} parks with email addresses`);
  if (parks.length === 0) {
    console.error('❌ No parks found with email addresses. Exiting.');
    process.exit(1);
  }

  // Limit number of parks
  const parksToEmail = parks.slice(0, limit);
  console.log(`📧 Will process ${parksToEmail.length} parks\n`);

  // Send emails
  const results: SendResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < parksToEmail.length; i++) {
    const park = parksToEmail[i];
    console.log(`[${i + 1}/${parksToEmail.length}] Sending to ${park.name} (${park.email})...`);

    const result = await sendOutreachEmail(park, baseUrl, apiToken, testMode);
    results.push(result);

    if (result.success) {
      successCount++;
      console.log(`   ✅ Success${result.emailId ? ` (ID: ${result.emailId})` : ''}`);
    } else {
      failCount++;
      console.log(`   ❌ Failed: ${result.error}`);
    }

    // Delay between emails (except for the last one)
    if (i < parksToEmail.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Campaign Summary');
  console.log('='.repeat(60));
  console.log(`Total processed: ${results.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`Success rate: ${((successCount / results.length) * 100).toFixed(1)}%`);

  // Save results to file
  const resultsFile = `outreach-results-${Date.now()}.json`;
  fs.writeFileSync(
    resultsFile,
    JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
  );
  console.log(`\n💾 Results saved to: ${resultsFile}`);

  // Show failed emails
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed emails:');
    failed.forEach(r => {
      console.log(`   - ${r.parkName} (${r.email}): ${r.error}`);
    });
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

