import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface ParkData {
  name: string;
  email?: string;
  city?: string;
  state?: string;
  website?: string;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

async function syncParksToBeehiiv() {
  const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
  const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID || BEEHIIV_API_KEY.includes('your_')) {
    console.error('❌ Beehiiv credentials missing in .env.local!');
    console.error('Please set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID.');
    process.exit(1);
  }

  console.log('🐝 Starting Beehiiv Contact Sync...');
  const parkMap = new Map<string, ParkData>();

  // 1. Gather from public/data/*.json
  const dataDir = path.resolve(process.cwd(), 'public/data');
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json') && f !== 'keyword_clusters.json');
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const p of list) {
            if (p.email && p.email.includes('@')) {
              parkMap.set(p.email.toLowerCase().trim(), {
                name: p.name,
                email: p.email.toLowerCase().trim(),
                city: p.city,
                state: p.state || file.replace('.json', '').toUpperCase(),
                website: p.website,
              });
            }
          }
        }
      } catch (e) {}
    }
  }

  // 2. Gather from outreach-db-all CSV
  const csvPath = path.resolve(process.cwd(), 'data-backups/outreach-db-all-2026-06-19.csv');
  if (fs.existsSync(csvPath)) {
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = parseCsvLine(line);
      const email = cols[1]?.toLowerCase().trim();
      if (email && email.includes('@')) {
        const existing = parkMap.get(email);
        parkMap.set(email, {
          name: cols[0] || existing?.name || 'Park Owner',
          email,
          city: cols[5] || existing?.city || '',
          state: cols[6] || existing?.state || '',
          website: cols[3] || existing?.website || '',
        });
      }
    }
  }

  const allContacts = Array.from(parkMap.values());
  console.log(`📋 Found ${allContacts.length} verified park owner emails in local database.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allContacts.length; i++) {
    const contact = allContacts[i];
    console.log(`[${i + 1}/${allContacts.length}] Syncing to Beehiiv: ${contact.name} (${contact.email})...`);

    const customFields = [
      { name: 'user_type', value: 'park_owner' },
      { name: 'source', value: 'directory_database' },
      contact.name ? { name: 'park_name', value: contact.name } : null,
      contact.city ? { name: 'city', value: contact.city } : null,
      contact.state ? { name: 'state', value: contact.state } : null,
      contact.website ? { name: 'website', value: contact.website } : null,
    ].filter(Boolean);

    try {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${BEEHIIV_API_KEY}`,
          },
          body: JSON.stringify({
            email: contact.email,
            reactivate_existing: false,
            send_welcome_email: false,
            utm_source: 'directory_outreach',
            custom_fields: customFields,
          }),
        }
      );

      if (res.ok || res.status === 409) {
        successCount++;
        console.log(`   ✅ Synced: ${contact.email}`);
      } else {
        const errText = await res.text();
        console.log(`   ⚠️ Beehiiv status ${res.status}: ${errText}`);
        failCount++;
      }
    } catch (err: any) {
      console.error(`   ❌ Error: ${err.message}`);
      failCount++;
    }

    // Small delay to be polite to Beehiiv rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\n=======================================');
  console.log('🎉 Beehiiv Sync Complete!');
  console.log(`✅ Successfully Synced: ${successCount}`);
  console.log(`❌ Errors/Skipped: ${failCount}`);
  console.log('=======================================');
}

syncParksToBeehiiv().catch(console.error);
